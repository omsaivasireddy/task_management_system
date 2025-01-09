
# Task Management System

A full-stack web application for managing tasks and subtasks, built with React, Ruby on Rails, and MySQL.

## Features

- User authentication
- Task creation and management 
- Subtask tracking
- Automatic task status updates
- Progress visualization

## Prerequisites

- Ruby (3.0.0 or higher)
- Rails (7.0.0 or higher)
- Node.js (18.0.0 or higher)
- MySQL (8.0 or higher)

## Installation

### Backend Setup

```bash
cd backend
bundle install
rails db:create db:migrate
rails s -p 3001
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Environment Variables

Create `.env` file in the backend directory:

```
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

## API Endpoints

### Authentication
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`

### Tasks
- GET `/api/v1/tasks`
- POST `/api/v1/tasks`
- GET `/api/v1/tasks/:id`
- PUT `/api/v1/tasks/:id`
- DELETE `/api/v1/tasks/:id`

### Subtasks
- GET `/api/v1/tasks/:task_id/subtasks`
- POST `/api/v1/tasks/:task_id/subtasks`
- PUT `/api/v1/tasks/:task_id/subtasks/:id`
- DELETE `/api/v1/tasks/:task_id/subtasks/:id`

```