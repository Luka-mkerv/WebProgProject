# Shift Manager - React + Express.js MVP

A simple employee shift management system built with **React** (frontend) and **Express.js** (backend).

## 🎯 Project Overview

This is a Minimum Viable Product (MVP) demonstrating:
- **Frontend**: React with functional components and hooks
- **Backend**: Express.js REST API
- **Architecture**: Client-server separation
- **State Management**: React useState/useEffect
- **HTTP Requests**: Axios for API calls
- **CRUD Operations**: Create, Read, Update, Delete

## 📁 Project Structure

```
shift-manager-mvp/
├── backend/
│   ├── server.js          # Express server & API routes
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # React entry point
│   │   ├── App.css        # Global styles
│   │   └── components/    # React components
│   │       ├── Login.jsx
│   │       ├── Dashboard.jsx
│   │       ├── ShiftList.jsx
│   │       ├── AddShift.jsx
│   │       ├── EmployeeList.jsx
│   │       └── RequestList.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json       # Frontend dependencies
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend will run on **http://localhost:5000**

### Frontend Setup

1. Navigate to frontend folder (in a new terminal):
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on **http://localhost:3000**

## 🔐 Demo Credentials

- **Admin**: `admin` / `admin123`
- **Manager**: `manager` / `manager123`
- **Employee**: `employee` / `employee123`

## 🎯 Features

### Authentication
- Login with role-based access (Admin, Manager, Employee)
- Session management

### Shift Management (Admin/Manager)
- View all shifts
- Add new shifts
- Delete shifts
- Assign shifts to employees

### Employee Management (Admin/Manager)
- View all employees
- Delete employees (Admin only)

### Request Management
- **Employees**: View and delete their own requests
- **Managers/Admin**: View all requests, approve/reject

## 🛠️ API Endpoints

### Authentication
- `POST /api/login` - User login

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Add new employee
- `DELETE /api/employees/:id` - Delete employee

### Shifts
- `GET /api/shifts` - Get all shifts
- `POST /api/shifts` - Create new shift
- `PUT /api/shifts/:id` - Update shift
- `DELETE /api/shifts/:id` - Delete shift

### Requests
- `GET /api/requests` - Get all requests
- `POST /api/requests` - Submit new request
- `PATCH /api/requests/:id` - Update request status
- `DELETE /api/requests/:id` - Delete request

## 🔄 Future Enhancements

- Database integration (Maybe)
- JWT authentication
- Real-time updates with WebSockets
- Bug fixes
- Cleaner UI

For questions about this project, please contact the developer.
