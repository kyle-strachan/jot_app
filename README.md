# Jot
A secure note-taking app using Node.js, Express, EJS, and MongoDB.

## Features
* JWT user authentication with bcrypt hashing
* CRUD operations on notes
* Colour-coded notes
* Simple, responsive UI

## Screenshot
![Screenshot of app's user interface](./public/images/jot-screenshot.jpg)

## Installation
```
git clone https://github.com/kyle-strachan/jot_app.git
cd jot_app
npm install
```

## Setup
### Prerequisites
1. Node.js
    1. Ensure `node` and `npm` are available in the command line.
2. MongoDB, running locally or remote.

### Environment variables
Create a .env file in the project's root directory with unique access and refresh secrets.
```
MONGO_URL=mongodb://localhost:27017/DatabaseName
ACCESS_SECRET=AccessSecret
REFRESH_SECRET=RefreshSecret
PORT=3000
```

For production environments, add `NODE_ENV=production` for HTTPS cookie transmission.

## Run locally
```
npm start
```

## API Endpoints
While the application uses server-rendered views with EJS, routes are designed in RESTful structure and HTTP methods (GET, POST, PUT, DELETE). All endpoints handle errors gracefully back to UI instead of JSON responses.

### Auth Routes

| Method | Endpoint      | Description               |
|--------|---------------|---------------------------|
| POST   | `/register`   | Register a new user       |
| POST   | `/login`      | Log in and receive tokens |
| POST   | `/logout`     | Log out and clear cookies |

### Notes Routes

| Method | Endpoint           | Description                      |
|--------|--------------------|----------------------------------|
| GET    | `/notes`           | View all notes for logged-in user |
| GET    | `/notes/new`       | Show form to create a new note  |
| POST   | `/notes`           | Create a new note               |
| GET    | `/notes/:id/edit`  | Show edit form for a note       |
| PUT    | `/notes/:id`       | Update a note                   |
| DELETE | `/notes/:id`       | Delete a note                   |

## Future Development
1. Bug: New lines are not saved.
2. Introduce a search function