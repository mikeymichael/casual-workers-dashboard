const STORAGE_KEY = 'casualDashboardWorkers';
let workers = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveWorkers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workers));
}

function renderDashboard() {
  document.getElementById('total-workers').innerText = workers.length;
  const totalPay = workers.reduce((sum, w) => sum + (w.pay || 0), 0);
  const avgPay = workers.length ? totalPay / workers.length : 0;
  document.getElementById('total-pay').innerText = totalPay.toFixed(2);
  document.getElementById('avg-pay').innerText = avgPay.toFixed(2);
  document.getElementById('last-added').innerText = workers.length ? workers[workers.length - 1].name : 'N/A';
}

function renderWorkers(filteredWorkers = null) {
  const tbody = document.querySelector('#workers-table tbody');
  tbody.innerHTML = '';
  const data = filteredWorkers || workers;
  data.forEach((w, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${w.name}</td>
      <td>${w.idNumber}</td>
      <td>${w.residence}</td>
      <td>${w.shaAccount}</td>
      <td>
        <button class="btn btn-small btn-danger" onclick="deleteWorker(${index})">Delete</button>
      </td>`;
    tbody.appendChild(row);
  });
}

function deleteWorker(index) {
  if (confirm('Are you sure you want to delete this worker?')) {
    workers.splice(index, 1);
    saveWorkers();
    renderWorkers();
    renderDashboard();
  }
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

document.getElementById('search').addEventListener('input', e => {
  const keyword = e.target.value.toLowerCase();
  const filtered = workers.filter(w =>
    w.name.toLowerCase().includes(keyword) ||
    w.idNumber.toLowerCase().includes(keyword)
  );
  renderWorkers(filtered);
});

function showSection(id) {
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

renderWorkers();
renderDashboard();