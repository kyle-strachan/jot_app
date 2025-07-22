# Jot
A note-taking app using Node.js, Express, EJS, and MongoDB.

## Features
* JWT User authentication with bcrypt hashing
* CRUD operations on notes
* Colour-coded notes

## Setup
### Prerequisites
1. MongoDB must be installed.

### Environment variables
Create a .env file the project's root directory.
```
ACCESS_SECRET=yourAccessSecret
REFRESH_SECRET=yourRefreshSecret
MONGODB_URI=yourMongoConnectionString
PORT=3000
```

## Installation
```
git clone [public link pending]
cd jot_app
npm install
```

## Run locally
```
npm start
```

## API Endpoints

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