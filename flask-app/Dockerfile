FROM python:3.10-alpine3.15
WORKDIR /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000
# Run app.py when the container launches
CMD flask run --host=0.0.0.0
