const API = "/api";
const COLORS = ["#2874f0","#388e3c","#ff9f00","#a855f7","#ef4444","#06b6d4","#eab308","#ec4899"];
const fmt = n => "₹" + Math.round(n).toLocaleString("en-IN");
let allProducts = [], allOrders = [];
const charts = {};

// ── Tabs ──────────────────────────────────────────────────────────────────────
function showTab(name, el) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".admin-nav-item").forEach(n => n.classList.remove("active"));
  document.getElementById("tab-" + name).classList.add("active");
  el.classList.add("active");
}

// ── Charts ────────────────────────────────────────────────────────────────────
function makeChart(id, type, labels, data, horizontal=false) {
  if (charts[id]) charts[id].destroy();
  charts[id] = new Chart(document.getElementById(id), {
    type,
    data: { labels, datasets:[{ data, backgroundColor:COLORS, borderColor:type==="line"?"#2874f0":COLORS, borderWidth:type==="line"?2:0, fill:type==="line", tension:0.4, pointRadius:4 }] },
    options: {
      indexAxis: horizontal?"y":"x",
      plugins:{ legend:{ display:type==="doughnut", position:"bottom" } },
      scales: type==="doughnut"?{}:{ x:{grid:{display:false}}, y:{grid:{color:"#f0f2f5"}} }
    }
  });
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
async function loadDashboard() {
  const s = await fetch(`${API}/stats`).then(r=>r.json());
  document.getElementById("totalSales").textContent     = fmt(s.total_sales);
  document.getElementById("totalProfit").textContent    = fmt(s.total_profit);
  document.getElementById("profitMargin").textContent   = s.profit_margin + "%";
  document.getElementById("totalOrders").textContent    = s.total_orders;
  document.getElementById("totalCustomers").textContent = s.total_customers;
  makeChart("catChart",   "doughnut", s.sales_by_category.map(x=>x.category),  s.sales_by_category.map(x=>x.total));
  makeChart("payChart",   "doughnut", s.payment_mode.map(x=>x.payment_mode),    s.payment_mode.map(x=>x.count));
  makeChart("monthChart", "line",     s.monthly_sales.map(x=>x.month),          s.monthly_sales.map(x=>x.total));
  const top = [...s.top_products].reverse();
  makeChart("topChart",   "bar",      top.map(x=>x.product_name), top.map(x=>x.total), true);
}

// ── Products ──────────────────────────────────────────────────────────────────
async function loadProducts() {
  allProducts = await fetch(`${API}/products`).then(r=>r.json());
  renderProducts(allProducts);
}

function badgeClass(cat) {
  return {Electronics:"b-electronics",Clothing:"b-clothing","Home & Kitchen":"b-home",Books:"b-books",Beauty:"b-beauty"}[cat]||"";
}

function renderProducts(list) {
  document.getElementById("productsBody").innerHTML = list.map((p,i) => `
    <tr>
      <td>${i+1}</td>
      <td><strong>${p.name}</strong></td>
      <td><span class="badge ${badgeClass(p.category)}">${p.category}</span></td>
      <td>${p.sub_category||"—"}</td>
      <td>${fmt(p.price)}</td>
      <td>${p.stock}</td>
      <td>
        <button class="edit-btn" onclick="editProduct(${p.id})">✏️ Edit</button>
        <button class="del-btn"  onclick="deleteProduct(${p.id})">🗑️ Delete</button>
      </td>
    </tr>`).join("");
}

function filterProducts(q) {
  renderProducts(allProducts.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase())
  ));
}

function openProductModal(reset=true) {
  if (reset) {
    document.getElementById("modalTitle").textContent = "Add Product";
    document.getElementById("editId").value = "";
    ["pName","pSub","pPrice","pStock"].forEach(id => document.getElementById(id).value = "");
    // Reset image
    document.getElementById("pImage").value = "";
    document.getElementById("imagePreview").style.display = "none";
    document.getElementById("imagePreview").src = "";
    document.getElementById("uploadPlaceholder").style.display = "block";
    document.getElementById("currentImageNote").style.display = "none";
  }
  document.getElementById("productModal").classList.add("open");
}

function editProduct(id) {
  const p = allProducts.find(x => x.id === id);
  document.getElementById("modalTitle").textContent = "Edit Product";
  document.getElementById("editId").value  = id;
  document.getElementById("pName").value   = p.name;
  document.getElementById("pCat").value    = p.category;
  document.getElementById("pSub").value    = p.sub_category || "";
  document.getElementById("pPrice").value  = p.price;
  document.getElementById("pStock").value  = p.stock;
  // Reset image fields
  document.getElementById("pImage").value = "";
  document.getElementById("imagePreview").style.display = "none";
  document.getElementById("uploadPlaceholder").style.display = "block";
  // Show note if image already exists
  const note = document.getElementById("currentImageNote");
  if (p.image_url) {
    document.getElementById("imagePreview").src = p.image_url;
    document.getElementById("imagePreview").style.display = "block";
    document.getElementById("uploadPlaceholder").style.display = "none";
    note.style.display = "block";
  } else {
    note.style.display = "none";
  }
  openProductModal(false);
}

function previewImage(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      const preview = document.getElementById("imagePreview");
      preview.src = e.target.result;
      preview.style.display = "block";
      document.getElementById("uploadPlaceholder").style.display = "none";
    };
    reader.readAsDataURL(input.files[0]);
  }
}

async function saveProduct() {
  const id   = document.getElementById("editId").value;
  const body = {
    name:         document.getElementById("pName").value.trim(),
    category:     document.getElementById("pCat").value,
    sub_category: document.getElementById("pSub").value.trim(),
    price:        parseFloat(document.getElementById("pPrice").value),
    stock:        parseInt(document.getElementById("pStock").value) || 0,
    image_url:    ""
  };
  if (!body.name || !body.price) return alert("Name and Price required!");

  // Step 1: Save product details
  const resp = await fetch(id ? `${API}/products/${id}` : `${API}/products`, {
    method: id ? "PUT" : "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(body)
  });
  const savedProduct = await resp.json();
  const productId = savedProduct.id;

  // Step 2: Upload image if selected
  const imageFile = document.getElementById("pImage").files[0];
  if (imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);
    await fetch(`${API}/products/${productId}/upload-image`, {
      method: "POST",
      body: formData
    });
  }

  closeModal();
  loadProducts();
  loadDashboard();
}

async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;
  await fetch(`${API}/products/${id}`, {method:"DELETE"});
  loadProducts();
}

function closeModal() { document.getElementById("productModal").classList.remove("open"); }

// ── Orders ────────────────────────────────────────────────────────────────────
async function loadOrders() {
  allOrders = await fetch(`${API}/orders`).then(r=>r.json());
  renderOrders(allOrders);
}

function renderOrders(list) {
  document.getElementById("ordersBody").innerHTML = list.map((o,i) => `
    <tr>
      <td>${i+1}</td>
      <td>${o.order_date}</td>
      <td>${o.customer_name}</td>
      <td>${o.product_name}</td>
      <td><span class="badge ${badgeClass(o.category)}">${o.category}</span></td>
      <td>${o.region}</td>
      <td>${fmt(o.sales)}</td>
      <td class="${o.profit>=0?'profit-pos':'profit-neg'}">${fmt(o.profit)}</td>
      <td>${o.payment_mode}</td>
    </tr>`).join("");
}

function filterOrders(q) {
  renderOrders(allOrders.filter(o =>
    o.customer_name.toLowerCase().includes(q.toLowerCase()) ||
    o.product_name.toLowerCase().includes(q.toLowerCase())
  ));
}

loadDashboard();
loadProducts();
loadOrders();
