
function renderWorkers() {
  const container = document.getElementById('workerTableContainer');
  container.innerHTML = '';
  if (workers.length === 0) return container.innerHTML = '<p>No workers added yet.</p>';

  const table = document.createElement('table');
  table.innerHTML = `<thead><tr><th>Avatar</th><th>Name</th><th>ID</th><th>Phone</th><th>Weekly</th></tr></thead><tbody></tbody>`;

  workers.forEach(w => {
    const tr = document.createElement('tr');
    const avatarURL = `https://i.pravatar.cc/150?u=${w.idNumber}`;
    tr.innerHTML = \`
      <td><img class='avatar' src='\${avatarURL}' alt='Avatar'></td>
      <td><div class='worker-name'>\${w.name}</div></td>
      <td>\${w.idNumber}</td>
      <td>\${w.phone}</td>
      <td><div class='attendance-dots'>\${getWeeklyDots(w.attendance)}</div></td>
    \`;
    table.querySelector('tbody').appendChild(tr);
  });

  container.appendChild(table);
}

function renderDashboard() {
  const totalWorkers = workers.length;
  let totalPay = 0, totalDays = 0;
  const today = new Date();
  const currentWeek = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    currentWeek.push(d.toISOString().split('T')[0]);
  }

  const payPerDay = Array(7).fill(0);
  workers.forEach(w => {
    w.attendance.forEach(a => {
      const index = currentWeek.indexOf(a.date);
      if (index !== -1) {
        totalPay += a.pay || 0;
        totalDays++;
        payPerDay[index] += a.pay || 0;
      }
    });
  });

  const cards = document.getElementById('dashboard-cards');
  cards.innerHTML = \`
    <div class='card'><h3>Total Workers</h3><p>\${totalWorkers}</p></div>
    <div class='card'><h3>Week's Pay (KSH)</h3><p>\${totalPay}</p></div>
    <div class='card'><h3>Days Logged</h3><p>\${totalDays}</p></div>\`;

  const labels = currentWeek.map(date => {
    const d = new Date(date);
    return d.toLocaleDateString(undefined, { weekday: 'short' });
  });
  renderChart(payPerDay, labels);
}
