const STORAGE_KEY = 'casualProWorkers';
let workers = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workers));
}

function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'dashboard') renderDashboard();
  if (id === 'workers') renderWorkers();
  if (id === 'attendance') renderAttendance();
}

document.getElementById('workerForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const idNumber = document.getElementById('idNumber').value.trim();
  const residence = document.getElementById('residence').value.trim();
  const sha = document.getElementById('sha').value.trim();
  if (!name || !idNumber || !residence || !sha) return alert("Fill all fields.");
  if (workers.some(w => w.idNumber === idNumber)) return alert("ID already exists.");
  workers.push({ name, idNumber, residence, sha, attendance: [] });
  save();
  renderWorkers();
  e.target.reset();
});

function renderWorkers() {
  const tbody = document.querySelector('#workerTable tbody');
  tbody.innerHTML = '';
  workers.forEach((w, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${w.name}</td><td>${w.idNumber}</td><td>${w.residence}</td><td>${w.sha}</td>
    <td><button onclick="deleteWorker(${i})">Delete</button></td>`;
    tbody.appendChild(row);
  });
}

function deleteWorker(index) {
  if (confirm('Delete this worker?')) {
    workers.splice(index, 1);
    save();
    renderWorkers();
  }
}

function markAttendance() {
  const date = document.getElementById('attendanceDate').value;
  if (!date) return alert('Select a date.');
  const rows = document.querySelectorAll('#attendanceTable tbody tr');
  rows.forEach((row, i) => {
    const present = row.querySelector('input[type="checkbox"]').checked;
    const pay = parseFloat(row.querySelector('input[type="number"]').value) || 0;
    if (present) {
      const exists = workers[i].attendance.some(a => a.date === date);
      if (!exists) workers[i].attendance.push({ date, pay });
    }
  });
  save();
  alert("Attendance saved.");
  renderDashboard();
}

function renderAttendance() {
  const tbody = document.querySelector('#attendanceTable tbody');
  tbody.innerHTML = '';
  workers.forEach((w, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${w.name}</td>
      <td><input type="checkbox" /></td>
      <td><input type="number" min="0" placeholder="Pay" /></td>`;
    tbody.appendChild(row);
  });
}

function renderDashboard() {
  document.getElementById('totalWorkers').innerText = workers.length;
  let totalPay = 0, totalDays = 0, attended = 0;
  const today = new Date().toISOString().split('T')[0];
  workers.forEach(w => {
    totalPay += w.attendance.reduce((sum, a) => sum + a.pay, 0);
    totalDays += w.attendance.length;
    if (w.attendance.some(a => a.date === today)) attended++;
  });
  document.getElementById('totalPay').innerText = totalPay.toFixed(2);
  document.getElementById('avgPay').innerText = workers.length ? (totalPay / workers.length).toFixed(2) : 0;
  document.getElementById('attendanceRate').innerText = workers.length ? Math.round((attended / workers.length) * 100) + "%" : "0%";
}

showView('dashboard');