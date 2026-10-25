# Local Todo List API

A simple backend template to build your own **CRUD Todo List application locally**. It uses Node.js, Express, and a local JSON file to store tasks, so no database is required.

## Features

- Create, read, update, and delete tasks.
- Store tasks locally in `data/tasks.json`.
- Protect task endpoints with HTTP Basic Authentication.
- Configure the server and frontend CORS origin using environment variables.
- Use Helmet and JSON request size limits for basic security.

## Requirements

- [Node.js](https://nodejs.org/)
- npm

## Getting Started

1. Clone or download this repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```env
   PORT=3000
   CORS_ORIGIN=http://localhost:5173
   AUTH_USER=your_username
   AUTH_PASSWORD=your_long_random_password
   ```

4. Make sure your `package.json` includes a start script, such as:

   ```json
   "scripts": {
     "dev": "node --watch server.js"
   }
   ```

5. Start the server:

   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`.

## API Endpoints

All `/tasks` endpoints require **HTTP Basic Authentication**. The root endpoint (`/`) is public.

| Method | Endpoint     | Description                        |
| ------ | ------------ | ---------------------------------- |
| GET    | `/`          | Checks that the server is running. |
| GET    | `/tasks`     | Returns all tasks.                 |
| GET    | `/tasks/:id` | Returns a task by its ID.          |
| POST   | `/tasks`     | Creates a new task.                |
| PUT    | `/tasks/:id` | Updates an existing task.          |
| DELETE | `/tasks/:id` | Deletes a task by its ID.          |

### Task Format

Tasks use the following JSON structure:

```json
{
  "id": 1,
  "name": "Example",
  "completed": false
}
```

For `POST` and `PUT` requests, send a JSON body with the task fields and set `Content-Type: application/json`.

## Authentication

Use the username and password configured in your `.env` file to access `/tasks`.

When testing with an HTTP client, send the credentials using **Basic Authentication**. Do not commit your `.env` file or share real credentials.

## Testing the API

Use the included `tests.http` file with the REST Client extension in Visual Studio Code, or test the endpoints with Postman or another HTTP client.

Update the authentication header in `tests.http` with your Base64-encoded `username:password` credentials.

## Storage

Tasks are stored in `data/tasks.json`. If the file does not exist, the backend creates it with an example task.

**Note:** This template is intended for local development and learning. JSON-file storage is not designed for concurrent writes or production workloads. If you expose the API publicly, use stronger authentication and appropriate production security measures.
