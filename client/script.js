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
  let html = '<table class="table"><tr>';

  for (let i = 0; i < headers.length; i++) {
    html += '<th>' + headers[i] + '</th>';
  }

  html += '</tr>';

  for (let i = 0; i < rows.length; i++) {
    html += '<tr>';
    for (let j = 0; j < rows[i].length; j++) {
      let val = rows[i][j];
      if (val == null) val = '-';
      html += '<td>' + val + '</td>';
    }
    html += '</tr>';
  }

  html += '</table>';
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
    const placedPercent = stats.totalStudents === 0 ? 0 : Math.round((stats.totalPlaced / stats.totalStudents) * 100);

    resultBox.innerHTML = `
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-label">Total Students</div>
          <div class="stat-value" style="color: #3498db">${stats.totalStudents}</div>
          <div class="progress-wrap">
            <div class="progress-bar" style="width: 100%"></div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Placed Students</div>
          <div class="stat-value" style="color: #0ee443">${stats.totalPlaced}</div>
          <div class="progress-wrap">
            <div class="progress-bar green" style="width: ${placedPercent}%"></div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Placement %</div>
          <div class="stat-value" style="color: #cf731d">${stats.placementPercentage}%</div>
          <div class="progress-wrap">
            <div class="progress-bar orange" style="width: ${stats.placementPercentage}%"></div>
          </div>
        </div>
      </div>
      <div class="note">Progress bars show placed and overall percentage.</div>
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

    const rows = data.data.map((s) => [
      s.name,
      s.roll,
      s.company,
      s.package,
      '<span class="badge green">Placed</span>'
    ]);
    resultBox.innerHTML = makeTable(['Name', 'Roll', 'Company', 'Package (LPA)', 'Status'], rows);
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

    const rows = data.data.map((s) => [
      s.name,
      s.roll,
      s.department,
      s.cgpa,
      '<span class="badge orange">Unplaced</span>'
    ]);
    resultBox.innerHTML = makeTable(['Name', 'Roll', 'Department', 'CGPA', 'Status'], rows);
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

    const rows = data.data.map((r) => [
      r.company,
      r.placedCount,
      r.avgPackage ?? '-',
      '<span class="badge green">Placed</span>'
    ]);
    resultBox.innerHTML = makeTable(['Company', 'Placed Students', 'Avg Package (LPA)', 'Status'], rows);
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

    const rows = data.data.map((r) => [
      r.department,
      r.total,
      r.placed,
      r.unplaced,
    ]);
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
