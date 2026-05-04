# Placement Tracking & Reports Module

Simple college demo module to track placement data and show reports.

## Project Structure

```
placement-module/
│── server/
│   ├── server.js
│   ├── seed.js
│   ├── models/
│   │   └── Student.js
│   └── routes/
│       └── routes.js
│
│── client/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
│── package.json
```

## Setup

1. Install dependencies

```
npm install
```

2. Start MongoDB (local)

Make sure MongoDB is running on `mongodb://127.0.0.1:27017`.

3. Seed sample data

```
npm run seed
```

4. Start server

```
npm start
```

5. Open the app

Visit `http://localhost:3000` in your browser.

## Environment (optional)

- `MONGO_URL` to override MongoDB connection
- `PORT` to change server port

## API Endpoints

- GET `/api/placed`
- GET `/api/unplaced`
- GET `/api/stats`
- GET `/api/company-report`
- GET `/api/department-report`
