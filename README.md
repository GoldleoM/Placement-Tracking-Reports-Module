# Placement Dashboard (Placement Tracking and Reports Module)

Demo-ready placement tracking dashboard for a college placement system. It stores student records in MongoDB, exposes REST APIs for reports, and serves a single-page UI that renders tables, stats cards, and a pie chart.

## Tech Stack

- Backend: Node.js, Express, Mongoose
- Database: MongoDB
- Frontend: HTML, CSS, Vanilla JavaScript
- Charts: Chart.js (CDN)

## Key Features

- Placed and unplaced student lists
- Placement statistics with cards and progress bars
- Pie chart for placed vs unplaced students
- Company-wise report (count + average package)
- Department-wise report (total/placed/unplaced)
- Seed script with sample data

## How It Works (Flow)

1) Express serves the static UI from `client/` and exposes REST routes.
2) The UI buttons call API endpoints using `fetch()` (base path `/api`).
3) Mongoose queries and aggregations compute lists and reports.
4) The UI renders tables and charts based on API responses.

## REST API Endpoints

Routes are defined with the `/api` prefix directly in `server/routes/routes.js` and mounted with `app.use(apiRoutes)`.

1) GET `/api/placed`
   - Returns placed students with `name`, `roll`, `company`, `package`.

2) GET `/api/unplaced`
   - Returns unplaced students with `name`, `roll`, `department`, `cgpa`.

3) GET `/api/stats`
   - Returns counts and placement percentage:

```json
{
  "ok": true,
  "data": {
    "totalStudents": 10,
    "totalPlaced": 6,
    "placementPercentage": 60
  }
}
```

4) GET `/api/company-report`
   - Aggregates placed students by company and calculates average package.

5) GET `/api/department-report`
   - Aggregates totals and placed/unplaced counts per department.

All endpoints return `{ ok: true, data: ... }` on success and `{ ok: false, message: ... }` on error.

## Data Model

Collection: `students`

Student fields:
- `name` (String)
- `roll` (String)
- `department` (String)
- `cgpa` (Number)
- `placed` (Boolean)
- `company` (String, optional)
- `package` (Number, optional, LPA)

Company fields (used for report caching and display):
- `name` (String)
- `avgPackage` (Number)
- `placedCount` (Number)

## Report Logic (Backend)

- Placed/Unplaced: `Student.find({ placed: true/false })`
- Stats: `countDocuments()` for total and placed, then percentage = placed/total * 100
- Company report: aggregation with `$match` + `$group` + `$avg` + `$sort`
- Department report: `$group` with conditional sums for placed/unplaced

The company report also upserts the summary into the `companies` collection using `bulkWrite`.

## Frontend Behavior

- Buttons call the API and render results in `#resultBox`
- Tables show lists and reports
- Stats view shows cards + progress bars + pie chart
- Pie chart uses Chart.js and renders on demand

## How to Run

1) Install dependencies
```
npm install
```

2) Start MongoDB
Ensure MongoDB is running locally at `mongodb://127.0.0.1:27017/placement_demo`.

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

## Configuration

This project uses hardcoded values. To change them:

- MongoDB URL: update `dbUrl` in `server/server.js` and `seed.js`
- Port: update `PORT` in `server/server.js`

## Project Structure (Current)

```
WP/
├── client/
│   ├── index.html        # UI layout and buttons
│   ├── script.js         # Fetch calls, DOM rendering, Chart.js
│   └── style.css         # Page layout, cards, tables, chart styling
├── server/
│   ├── models/
│   │   ├── Company.js    # Company summary schema
│   │   └── Student.js    # Student schema
│   ├── routes/
│   │   └── routes.js     # REST API routes
│   └── server.js         # Express app, middleware, static client, DB connect
├── seed.js               # Inserts sample student data into MongoDB
├── package.json          # App metadata and npm scripts
└── README.md             # Project documentation
```

## Viva Summary (Quick Study Notes)

- Problem statement: track placement status of students and generate reports for placement cell.
- Architecture: single-page UI + Express API + MongoDB (Mongoose).
- Data flow: UI button -> fetch API -> DB query/aggregation -> JSON -> UI renders table/cards/chart.
- Key reports: placed list, unplaced list, stats, company report, department report.
- Stats math: placementPercentage = (totalPlaced / totalStudents) * 100.
- Charting: Chart.js pie chart shows placed vs unplaced counts.
- Error handling: API returns `{ ok: false, message }` and UI shows a note.
- Seeding: `seed.js` clears and inserts sample data to demo the reports.
- Limitations: no auth, no pagination, no filters; designed for demo use.
- Future scope: add search, filters, pagination, export to CSV, auth/admin panel.

## Common Viva Questions (Short Answers)

Q: Why MongoDB?
A: Flexible schema, fast setup for demo data, easy aggregation support.

Q: Why Mongoose?
A: Adds schemas, validation, and cleaner query/aggregation syntax in Node.js.

Q: How is the company report calculated?
A: Aggregation pipeline groups placed students by company, counts them, and averages package.

Q: How is department report calculated?
A: Aggregation groups by department and uses conditional sums for placed/unplaced.

Q: How does the UI get data?
A: Vanilla JS `fetch()` calls to `/api/*` endpoints and renders HTML tables/cards.

Q: How is the pie chart drawn?
A: Chart.js renders a pie chart using placed and unplaced counts from `/api/stats`.
