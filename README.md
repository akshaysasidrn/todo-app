# Todo App (Community Edition)

This is the Community Edition (CE) of our Todo App, featuring a NestJS backend and React frontend. It provides basic todo management functionality and serves as the foundation for our Enterprise Edition (EE).

## Features

- Create, read, update, and delete todos
- Mark todos as completed
- Responsive web interface

## Tech Stack

- Backend: NestJS with TypeORM (SQLite database)
- Frontend: React with TypeScript
- API: RESTful

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/todo-ce.git
   cd todo-ce
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the app:
   ```
   npm start
   ```

The app should now be running with the backend on `http://localhost:3000` and the frontend on `http://localhost:3001`.

## Project Structure

```
todo-ce/
├── server/                 # NestJS backend
│   ├── src/
│   │   ├── todo/           # Todo module
│   │   ├── migrations/     # Database migrations
│   │   └── main.ts         # Entry point
│   └── package.json
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   └── App.tsx         # Main App component
│   └── package.json
└── README.md
```

## API Endpoints

- `GET /todos`: Fetch all todos
- `POST /todos`: Create a new todo
- `PUT /todos/:id`: Update a todo
- `DELETE /todos/:id`: Delete a todo
