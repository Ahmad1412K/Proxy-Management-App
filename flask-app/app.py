from flask import Flask, request, jsonify, make_response
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from models import db, User, Proxy
from flask_bcrypt import Bcrypt
from flask import request, jsonify
from datetime import datetime
from celery_utils import make_celery
from celery.schedules import crontab
import requests
from flask_cors import CORS



app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///proxy.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "your-secret-key"
app.config["JWT_SECRET_KEY"] = "your-jwt-secret-key"
app.config["CELERY_BROKER_URL"] = (
    "redis://host.docker.internal:6379/0" 
)
app.config["result_backend"] = "redis://host.docker.internal:6379/0"

db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
celery = make_celery(app)

with app.app_context():
    db.create_all()

@celery.task(name='app.check_proxy_status')
def check_proxy_status():
    print("inside_task")
    proxies = Proxy.query.all()
    if not proxies:
        return

    try:
        for proxy in proxies:
            URL = f"http://{proxy.ip_address}:{proxy.port}"
            response = requests.get(
                URL,
                timeout=10,
            )
            proxy.status = "active" if response.status_code == 200 else "inactive"
    except requests.RequestException:
        proxy.status = "inactive"

    proxy.last_checked = datetime.utcnow()
    db.session.commit()


celery.conf.beat_schedule = {
    "check-all-proxies": {
        "task": "app.check_proxy_status",
        "schedule": crontab(minute="*/1"),  # every 10 minutes
    }
}



@app.route("/register", methods=["POST"])
def register():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    if not username or not password:
        return jsonify({"msg": "Username and password required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already exists"}), 409

    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201


@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    if not username or not password:
        return jsonify({"msg": "Missing username or password"}), 400

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200

    return jsonify({"msg": "Bad username or password"}), 401


@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


@app.route("/proxy", methods=["POST"])
@jwt_required()
def add_proxy():
    data = request.get_json()
    new_proxy = Proxy(
        ip_address=data["ip_address"],
        port=data["port"],
        status=data.get("status", "active"),
        last_checked=data.get("last_checked", datetime.utcnow()),
    )
    db.session.add(new_proxy)
    db.session.commit()
    return (
        jsonify({"message": "Proxy added successfully", "proxy": str(new_proxy)}),
        201,
    )


@app.route("/proxy/<int:proxy_id>", methods=["DELETE"])
@jwt_required()
def delete_proxy(proxy_id):
    proxy = Proxy.query.get(proxy_id)
    if proxy:
        db.session.delete(proxy)
        db.session.commit()
        return jsonify({"message": "Proxy deleted successfully"}), 200
    else:
        return jsonify({"message": "Proxy not found"}), 404


@app.route("/proxy/<int:proxy_id>", methods=["GET"])
@jwt_required()
def get_proxy(proxy_id):
    proxy = Proxy.query.get(proxy_id)
    if proxy:
        return (
            jsonify(
                {
                    "id": proxy.id,
                    "ip_address": proxy.ip_address,
                    "port": proxy.port,
                    "status": proxy.status,
                    "last_checked": proxy.last_checked.isoformat(),
                }
            ),
            200,
        )
    else:
        return jsonify({"message": "Proxy not found"}), 404


@app.route("/proxy", methods=["GET"])
@jwt_required()
def list_proxies():
    proxies = Proxy.query.all()
    proxies_list = [
        {
            "id": proxy.id,
            "ip_address": proxy.ip_address,
            "port": proxy.port,
            "status": proxy.status,
            "last_checked": proxy.last_checked.isoformat(),
        }
        for proxy in proxies
    ]
    return jsonify(proxies_list), 200


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=5000)
