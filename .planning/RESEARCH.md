# Research

Patterns:
- Express + Mongoose simple setup, REST GET routes
- Aggregation for reports:
  - Company report: group by company where placed=true
  - Department report: group by department, with counts and placed/unplaced using $sum + $cond
- CORS for local client calls

Notes:
- Keep queries readable and student-level naming
- Use fallback for optional fields (company/package)
