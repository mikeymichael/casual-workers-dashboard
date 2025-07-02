const STORAGE_KEY = 'casualDashboardWorkers';
let workers = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveWorkers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workers));
}

function renderDashboard() {
  document.getElementById('total-workers').innerText = workers.length;
  const totalPay = workers.reduce((sum, w) => sum + (w.pay || 0), 0);
  document.getElementById('total-pay').innerText = totalPay.toFixed(2);
}

function renderWorkers() {
  const tbody = document.querySelector('#workers-table tbody');
  tbody.innerHTML = '';
  workers.forEach(w => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${w.name}</td><td>${w.idNumber}</td><td>${w.residence}</td><td>${w.shaAccount}</td>`;
    tbody.appendChild(row);
  });
}

document.getElementById('worker-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const idNumber = document.getElementById('idNumber').value.trim();
  const residence = document.getElementById('residence').value.trim();
  const shaAccount = document.getElementById('shaAccount').value.trim();
  if (!name || !idNumber || !residence || !shaAccount) return alert('Please fill all fields.');
  workers.push({ name, idNumber, residence, shaAccount, pay: 0 });
  saveWorkers();
  renderWorkers();
  renderDashboard();
  e.target.reset();
});

function showSection(id) {
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

renderWorkers();
renderDashboard();