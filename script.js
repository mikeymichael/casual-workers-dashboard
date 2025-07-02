let STORAGE_KEY = 'casualWorkersAdvanced';
let workers = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(workers)); }

function switchView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'dashboard') renderDashboard();
  if (id === 'workers') renderWorkers();
}

document.getElementById('workerForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const idNumber = document.getElementById('idNumber').value.trim();
  const residence = document.getElementById('residence').value.trim();
  const phone = document.getElementById('phone').value.trim();
  if (!name || !idNumber || !residence || !phone) return alert("Fill all fields.");
  if (workers.some(w => w.idNumber === idNumber)) return alert("ID already exists.");
  workers.push({ name, idNumber, residence, phone, attendance: [], payments: [] });
  saveData();
  renderWorkers();
  e.target.reset();
});

function getWeeklyDots(attendance) {
  const today = new Date();
  const week = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const found = attendance.find(a => a.date === dateStr);
    const status = found ? 'present' : 'absent';
    const pay = found ? found.pay : 0;
    week.push(`<span class='dot ${status}' title='${d.toDateString()} – ${status.toUpperCase()}${pay ? ` (KSH ${pay})` : ''}'></span>`);
  }
  return week.join('');
}

function renderWorkers() {
  const container = document.getElementById('workerTableContainer');
  container.innerHTML = '';
  if (workers.length === 0) return container.innerHTML = '<p>No workers added yet.</p>';
  const table = document.createElement('table');
  table.innerHTML = `<thead><tr><th>Name</th><th>ID</th><th>Phone</th><th>Weekly</th></tr></thead><tbody></tbody>`;
  workers.forEach(w => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${w.name}</td><td>${w.idNumber}</td><td>${w.phone}</td>
                    <td><div class='attendance-dots'>${getWeeklyDots(w.attendance)}</div></td>`;
    table.querySelector('tbody').appendChild(tr);
  });
  container.appendChild(table);
}

function renderDashboard() {
  const totalWorkers = workers.length;
  let totalPay = 0, totalDays = 0, paidCount = 0;
  const today = new Date();
  const currentWeek = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    currentWeek.push(d.toISOString().split('T')[0]);
  }
  workers.forEach(w => {
    w.attendance.forEach(a => {
      if (currentWeek.includes(a.date)) {
        totalPay += a.pay || 0;
        totalDays++;
      }
    });
  });
  const cards = document.getElementById('dashboard-cards');
  cards.innerHTML = `
    <div class='card'><h3>Total Workers</h3><p>${totalWorkers}</p></div>
    <div class='card'><h3>Week's Pay (KSH)</h3><p>${totalPay}</p></div>
    <div class='card'><h3>Days Logged</h3><p>${totalDays}</p></div>`;
}

function openAttendance() {
  const date = document.getElementById('attendanceDate').value;
  if (!date) return alert("Select a date.");
  const sheet = document.getElementById('attendanceSheet');
  sheet.innerHTML = '';
  const table = document.createElement('table');
  table.innerHTML = `<thead><tr><th>Name</th><th>Present</th><th>Pay</th></tr></thead><tbody></tbody>`;
  workers.forEach((w, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${w.name}</td>
      <td><input type='checkbox' id='present_${i}'></td>
      <td><input type='number' id='pay_${i}' min='0' placeholder='Pay' /></td>`;
    table.querySelector('tbody').appendChild(tr);
  });
  sheet.appendChild(table);
  const btn = document.createElement('button');
  btn.innerText = "Save Attendance";
  btn.onclick = () => {
    workers.forEach((w, i) => {
      const isPresent = document.getElementById(`present_${i}`).checked;
      const pay = parseFloat(document.getElementById(`pay_${i}`).value) || 0;
      if (isPresent && !w.attendance.some(a => a.date === date)) {
        w.attendance.push({ date, pay });
      }
    });
    saveData();
    alert("Attendance saved.");
    renderDashboard();
    renderWorkers();
  };
  sheet.appendChild(btn);
}

function exportCSV() {
  const rows = [["Name", "ID", "Phone", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Total"]];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const weekDates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    weekDates.push(d.toISOString().split('T')[0]);
  }
  workers.forEach(w => {
    const record = [w.name, w.idNumber, w.phone];
    let total = 0;
    for (let d of weekDates) {
      const day = w.attendance.find(a => a.date === d);
      const p = day ? day.pay : "";
      record.push(p);
      if (day) total += p;
    }
    record.push(total);
    rows.push(record);
  });
  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "weekly_report.csv";
  a.click();
}
switchView('dashboard');