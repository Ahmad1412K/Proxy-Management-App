# Proxy-Management-App

This repository contains the code for a full-stack application for managing and viewing proxies,  it uses React JS for the frontend and Flask for the backend, with Redis as a data store.

## Prerequisites

Before you begin, ensure you have met the following requirements:
* You have installed [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Cloning the Repository

To clone this repository to your local machine, run the following command:

```bash
git clone git@github.com:Ahmad1412K/Proxy-Management-App.git
cd your-repo-name
 ```

## Running the Application
To start the application, run the following command from the root of the project:

```
docker-compose up
```

## Accessing the Application
### Web Application
Open your web browser and visit http://localhost:3000/ to start using the application. The application loads with the login page initially:

1. Sign Up: Since you don't have an account initially, navigate to the signup page by clicking the "Sign Up" button and register a new user.
2. Log In: Once signed up, log in with your new credentials.
3. Interacting with Proxies: After logging in, you'll be directed to the proxy management page where you can add, delete, and view proxies.

### API Testing
You can test the API endpoints using tools like Postman or curl:
 ```
# Example: POST /register to create a new user
curl -X POST http://localhost:5000/register -H 'Content-Type: application/json' -d '{"username":"testuser", "password":"testpass"}'

# Example: POST /login to authenticate a user
curl -X POST http://localhost:5000/login -H 'Content-Type: application/json' -d '{"username":"testuser", "password":"testpass"}'

# Example: GET /proxies to fetch all proxies (use the token received from login)
curl -X GET http://localhost:5000/proxies -H 'Authorization: Bearer YourTokenHere'
 ```
Replace YourTokenHere with the JWT token received after logging in.

## Shutting Down the Application
To stop and remove the containers, run the following command:
 ```
docker-compose down
 ```
