const CSV_PATH = "../dataset/ecommerce_sales.csv";

const COLORS = [
  "#3b82f6","#22c55e","#f97316","#a855f7",
  "#ef4444","#06b6d4","#eab308","#ec4899"
];

Papa.parse(CSV_PATH, {
  download: true,
  header: true,
  dynamicTyping: true,
  complete: ({ data }) => {
    const rows = data.filter(r => r.Order_ID);
    renderCards(rows);
    renderCatSales(rows);
    renderCatProfit(rows);
    renderMonthly(rows);
    renderRegion(rows);
    renderPayment(rows);
    renderTopProducts(rows);
    renderTable(rows);
  }
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function groupSum(rows, key, val) {
  return rows.reduce((acc, r) => {
    acc[r[key]] = (acc[r[key]] || 0) + r[val];
    return acc;
  }, {});
}

function sortedEntries(obj, desc = true) {
  return Object.entries(obj).sort((a, b) => desc ? b[1] - a[1] : a[1] - b[1]);
}

function fmt(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

// ── Summary Cards ─────────────────────────────────────────────────────────────
function renderCards(rows) {
  const sales  = rows.reduce((s, r) => s + r.Sales, 0);
  const profit = rows.reduce((s, r) => s + r.Profit, 0);
  document.getElementById("totalSales").textContent     = fmt(sales);
  document.getElementById("totalProfit").textContent    = fmt(profit);
  document.getElementById("profitMargin").textContent   = (profit / sales * 100).toFixed(2) + "%";
  document.getElementById("totalOrders").textContent    = rows.length;
  document.getElementById("totalCustomers").textContent = new Set(rows.map(r => r.Customer_ID)).size;
}

// ── Chart Factory ─────────────────────────────────────────────────────────────
function makeBar(id, labels, data, horizontal = false) {
  new Chart(document.getElementById(id), {
    type: "bar",
    data: {
      labels,
      datasets: [{ data, backgroundColor: COLORS, borderRadius: 6 }]
    },
    options: {
      indexAxis: horizontal ? "y" : "x",
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { grid: { color: "#f0f2f5" } } }
    }
  });
}

function makePie(id, labels, data) {
  new Chart(document.getElementById(id), {
    type: "doughnut",
    data: {
      labels,
      datasets: [{ data, backgroundColor: COLORS, borderWidth: 2 }]
    },
    options: {
      plugins: { legend: { position: "bottom" } }
    }
  });
}

// ── Charts ────────────────────────────────────────────────────────────────────
function renderCatSales(rows) {
  const entries = sortedEntries(groupSum(rows, "Category", "Sales"));
  makeBar("catSalesChart", entries.map(e => e[0]), entries.map(e => e[1]));
}

function renderCatProfit(rows) {
  const entries = sortedEntries(groupSum(rows, "Category", "Profit"));
  makeBar("catProfitChart", entries.map(e => e[0]), entries.map(e => e[1]));
}

function renderMonthly(rows) {
  const monthly = {};
  rows.forEach(r => {
    const m = r.Order_Date.slice(0, 7);
    monthly[m] = (monthly[m] || 0) + r.Sales;
  });
  const sorted = Object.entries(monthly).sort((a, b) => a[0].localeCompare(b[0]));
  new Chart(document.getElementById("monthlyChart"), {
    type: "line",
    data: {
      labels: sorted.map(e => e[0]),
      datasets: [{
        label: "Sales (₹)",
        data: sorted.map(e => e[1]),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 5
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { grid: { color: "#f0f2f5" } } }
    }
  });
}

function renderRegion(rows) {
  const entries = sortedEntries(groupSum(rows, "Region", "Sales"));
  makePie("regionChart", entries.map(e => e[0]), entries.map(e => e[1]));
}

function renderPayment(rows) {
  const entries = sortedEntries(groupSum(rows, "Payment_Mode", "Sales"));
  makePie("paymentChart", entries.map(e => e[0]), entries.map(e => e[1]));
}

function renderTopProducts(rows) {
  const entries = sortedEntries(groupSum(rows, "Product_Name", "Sales")).slice(0, 10).reverse();
  makeBar("topProductsChart", entries.map(e => e[0]), entries.map(e => e[1]), true);
}

// ── Table ─────────────────────────────────────────────────────────────────────
function renderTable(rows) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = rows.map(r => `
    <tr>
      <td>${r.Order_ID}</td>
      <td>${r.Order_Date}</td>
      <td>${r.Customer_Name}</td>
      <td>${r.Category}</td>
      <td>${r.Product_Name}</td>
      <td>${r.Region}</td>
      <td>${fmt(r.Sales)}</td>
      <td class="${r.Profit >= 0 ? 'profit-positive' : 'profit-negative'}">${fmt(r.Profit)}</td>
      <td>${(r.Discount * 100).toFixed(0)}%</td>
      <td>${r.Payment_Mode}</td>
    </tr>
  `).join("");
}
