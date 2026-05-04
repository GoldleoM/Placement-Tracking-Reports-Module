# Context

Project: Placement Tracking & Reports Module
Goal: Simple, demo-ready placement tracking dashboard with REST APIs and MongoDB.
Constraints: Node.js + Express, MongoDB (Mongoose), HTML/CSS/JS only; no frontend frameworks.
Key endpoints: /placed, /unplaced, /stats, /company-report, /department-report.
UI: Single dashboard page with buttons and dynamic results area.
Data: students collection with placement and department/company info.

Decisions:
- Use simple Express router in server/routes/routes.js
- Serve frontend as static files from server/../client for easy demo
- Use basic aggregation for reports; keep responses simple JSON
- Provide seed script to insert demo data
