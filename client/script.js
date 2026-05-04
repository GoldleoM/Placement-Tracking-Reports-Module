const resultTitle = document.getElementById('resultTitle');
const resultBox = document.getElementById('resultBox');

const btnStats = document.getElementById('btnStats');
const btnPlaced = document.getElementById('btnPlaced');
const btnUnplaced = document.getElementById('btnUnplaced');
const btnCompany = document.getElementById('btnCompany');
const btnDept = document.getElementById('btnDept');

const baseUrl = '/api';

function showLoading(title) {
  resultTitle.textContent = title;
  resultBox.innerHTML = '<p class="note">Loading...</p>';
}

function showError(msg) {
  resultBox.innerHTML = '<p class="note">' + msg + '</p>';
}

function makeTable(headers, rows) {
  let html = '<table class="table"><thead><tr>';
  headers.forEach((head) => {
    html += '<th>' + head + '</th>';
  });
  html += '</tr></thead><tbody>';

  rows.forEach((row) => {
    html += '<tr>';
    row.forEach((cell) => {
      html += '<td>' + (cell ?? '-') + '</td>';
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  return html;
}

async function getStats() {
  showLoading('Placement Statistics');
  try {
    const res = await fetch(baseUrl + '/stats');
    const data = await res.json();
    if (!data.ok) {
      showError(data.message || 'Something went wrong');
      return;
    }

    const stats = data.data;
    resultBox.innerHTML = `
      <div class="stat-line">Total Students: <strong>${stats.totalStudents}</strong></div>
      <div class="stat-line">Total Placed: <strong>${stats.totalPlaced}</strong></div>
      <div class="stat-line">Placement %: <strong>${stats.placementPercentage}%</strong></div>
    `;
  } catch (err) {
    showError('Failed to load stats');
  }
}

async function getPlacedStudents() {
  showLoading('Placed Students');
  try {
    const res = await fetch(baseUrl + '/placed');
    const data = await res.json();
    if (!data.ok) {
      showError(data.message || 'Something went wrong');
      return;
    }

    if (data.data.length === 0) {
      resultBox.innerHTML = '<p class="note">No placed students found.</p>';
      return;
    }

    const rows = data.data.map((s) => [s.name, s.roll, s.company, s.package]);
    resultBox.innerHTML = makeTable(['Name', 'Roll', 'Company', 'Package (LPA)'], rows);
  } catch (err) {
    showError('Failed to load placed students');
  }
}

async function getUnplacedStudents() {
  showLoading('Unplaced Students');
  try {
    const res = await fetch(baseUrl + '/unplaced');
    const data = await res.json();
    if (!data.ok) {
      showError(data.message || 'Something went wrong');
      return;
    }

    if (data.data.length === 0) {
      resultBox.innerHTML = '<p class="note">No unplaced students found.</p>';
      return;
    }

    const rows = data.data.map((s) => [s.name, s.roll, s.department, s.cgpa]);
    resultBox.innerHTML = makeTable(['Name', 'Roll', 'Department', 'CGPA'], rows);
  } catch (err) {
    showError('Failed to load unplaced students');
  }
}

async function getCompanyReport() {
  showLoading('Company-wise Report');
  try {
    const res = await fetch(baseUrl + '/company-report');
    const data = await res.json();
    if (!data.ok) {
      showError(data.message || 'Something went wrong');
      return;
    }

    if (data.data.length === 0) {
      resultBox.innerHTML = '<p class="note">No company data found.</p>';
      return;
    }

    const rows = data.data.map((r) => [r.company, r.placedCount]);
    resultBox.innerHTML = makeTable(['Company', 'Placed Students'], rows);
  } catch (err) {
    showError('Failed to load company report');
  }
}

async function getDepartmentReport() {
  showLoading('Department-wise Report');
  try {
    const res = await fetch(baseUrl + '/department-report');
    const data = await res.json();
    if (!data.ok) {
      showError(data.message || 'Something went wrong');
      return;
    }

    if (data.data.length === 0) {
      resultBox.innerHTML = '<p class="note">No department data found.</p>';
      return;
    }

    const rows = data.data.map((r) => [r.department, r.total, r.placed, r.unplaced]);
    resultBox.innerHTML = makeTable(['Department', 'Total', 'Placed', 'Unplaced'], rows);
  } catch (err) {
    showError('Failed to load department report');
  }
}

btnStats.addEventListener('click', getStats);
btnPlaced.addEventListener('click', getPlacedStudents);
btnUnplaced.addEventListener('click', getUnplacedStudents);
btnCompany.addEventListener('click', getCompanyReport);
btnDept.addEventListener('click', getDepartmentReport);
