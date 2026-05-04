# Placement Tracking & Reports Module

Simple, demo-ready placement module for a college placement system. It tracks placed/unplaced students and generates basic reports from MongoDB. The UI is a single HTML page with buttons that call REST APIs.

## Tech Stack

- Backend: Node.js, Express, Mongoose
- Database: MongoDB
- Frontend: HTML, CSS, Vanilla JavaScript

## How to Run

1) Install dependencies

```
npm install
```

2) Start MongoDB

Make sure MongoDB is running locally at `mongodb://127.0.0.1:27017`.

3) Seed sample data

```
npm run seed
```

4) Start the server

```
npm start
```

5) Open the app

Visit `http://localhost:3000` in your browser.

## Environment Variables

- `MONGO_URL`: override MongoDB connection string
- `PORT`: change server port (default `3000`)

Example:

```
set MONGO_URL=mongodb://127.0.0.1:27017/placement_demo
set PORT=3000
npm start
```

## Project Structure (with purpose)

```
placement-module/
│── server/
│   ├── server.js         # Express app setup, middleware, static client, DB connect
│   ├── seed.js           # Inserts sample student data into MongoDB
│   ├── models/
│   │   └── Student.js    # Mongoose schema + model for students collection
│   └── routes/
│       └── routes.js     # REST API routes for reports and lists
│
│── client/
│   ├── index.html        # UI layout and buttons
│   ├── style.css         # Basic styling for page and tables
│   └── script.js         # Fetch calls and DOM rendering
│
│── package.json          # App metadata and npm scripts
│── README.md             # Project documentation
```

## Data Model

Collection: `students`

Fields:

- `name` (String)
- `roll` (String)
- `department` (String)
- `cgpa` (Number)
- `placed` (Boolean)
- `company` (String, optional)
- `package` (Number, optional, LPA)

## REST API Endpoints

Base path: `/api`

1) **GET `/api/placed`**

Returns students where `placed = true`.

Response shape:

```
{
  "ok": true,
  "data": [
    { "name": "Ayesha Khan", "roll": "CSE001", "company": "TCS", "package": 4.5 }
  ]
}
```

2) **GET `/api/unplaced`**

Returns students where `placed = false`.

Response shape:

```
{
  "ok": true,
  "data": [
    { "name": "Rahul Mehta", "roll": "CSE002", "department": "CSE", "cgpa": 7.9 }
  ]
}
```

3) **GET `/api/stats`**

Returns total students, total placed, and placement percentage.

Response shape:

```
{
  "ok": true,
  "data": {
    "totalStudents": 10,
    "totalPlaced": 6,
    "placementPercentage": 60
  }
}
```

4) **GET `/api/company-report`**

Returns number of placed students per company.

Response shape:

```
{
  "ok": true,
  "data": [
    { "company": "TCS", "placedCount": 2 },
    { "company": "Infosys", "placedCount": 1 }
  ]
}
```

5) **GET `/api/department-report`**

Returns total students per department with placed/unplaced split.

Response shape:

```
{
  "ok": true,
  "data": [
    { "department": "CSE", "total": 3, "placed": 2, "unplaced": 1 }
  ]
}
```

## Frontend Behavior

- Buttons call the respective API routes using `fetch()`
- Tables show student lists and reports
- Stats are shown as simple text lines

## Seeding Dummy Data

Run:

```
npm run seed
```

This clears the `students` collection and inserts sample rows from `server/seed.js`.

## Notes for Teammates

- The frontend is served by Express as static files from `client/`.
- API routes are mounted under `/api` in `server/server.js`.
- If you change API paths, update `client/script.js` as well.
- Keep changes simple and readable for demo use.
