from celery import Celery
from celery.schedules import crontab

def make_celery(app):
    # Initialize Celery
    celery = Celery(
        app.import_name,
        broker=app.config["CELERY_BROKER_URL"],
    )
    celery.conf.update(app.config)
    celery.autodiscover_tasks(['app.tasks'], force=True)

    

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            # Use the application context to run tasks
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery