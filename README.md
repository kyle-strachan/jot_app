# Jot
A secure note-taking app using Node.js, Express, EJS, and MongoDB.

## Features
* JWT user authentication with bcrypt hashing
* CRUD operations on notes
* Colour-coded notes
* Responsive UI

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
The application uses server-rendered views with EJS, routes are designed in RESTful structure and HTTP methods (GET, POST, PUT, DELETE). All endpoints handle errors gracefully back to UI instead of JSON responses.

### Auth Routes

| Method | Endpoint      | Description               |
|--------|---------------|---------------------------|
| POST   | `/register`   | Register a new user       |
| POST   | `/login`      | Log in and receive tokens |
| POST   | `/logout`     | Log out and clear cookies |

### Notes Routes (Protected)

All routes require authentication via access token stored in HTTP-only cookies. Not intended as public API.

| Method | Endpoint           | Description                      |
|--------|--------------------|----------------------------------|
| GET    | `/notes`           | View all notes for logged-in user |
| GET    | `/notes/new`       | Show form to create a new note  |
| POST   | `/notes`           | Create a new note               |
| GET    | `/notes/:id/edit`  | Show edit form for a note       |
| PUT    | `/notes/:id`       | Update a note                   |
| DELETE | `/notes/:id`       | Delete a note                   |

## Future Development
1. Introduce a search function

## Reflection notes

### Key focus

* My primary interest was exploring the security aspects of the app. I chose JWT to authenticate users via cookies. I recognise this key is encoded, so the objectID it contains can be easily decoded, but any attempt to modify the payload would invalidate the signature. I would love to explore this in more detail.
* I experimentally added a rate limiter; in rateLimit.js, the app is limited to 30 attempts per minute.
* I had a clear idea for the app’s front-end so elected to write my own CSS stylesheet instead of using a framework like Bootstrap; this also made it easier to integrate the note colour feature easier.

### Development notes

* I ran into testing issues with mixed case usernames, so I decided to force all usernames to be saved in lowercase to prevent login issues.
* I am pleased with the colour selection result which went through a drop-down iteration before settling with a radio group and hiding the default radio marker in CSS. The colour selection is conjugated with the class name to apply the colour to the note header, e.g. jot-panel-yellow, and a paler hover colour.
* After successful registration, the user is logged in automatically instead of having to register and then login.
* I was uncertain how far to implement client-side validation, especially on the login/register screen. I read conflicting advice on whether to include the same regex logic on client-side, the benefit is fewer invalid requests to the server, but the downside is revealing server-side validation logic to the client. That said, if you enter an invalid password, I have a message returning the allowed characters which reveals it anyway. I was unsure how to balance this and settled for only preventing blank strings on client-side, with regex and additional minimum string length validation on the back end.
* After logging out, I was able to use the browser’s back button to view cached protected notes. I attempted to use ‘noCache’ as middleware on all GET requests which mitigated the issue. I am unsure how to confirm the issue is solved.
