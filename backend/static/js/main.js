const API = "/api";
const EMOJIS = {
  "Electronics":"📱","Clothing":"👕","Home & Kitchen":"🏠","Books":"📚","Beauty":"💄"
};
const RATINGS = ["3.8★","4.0★","4.1★","4.2★","4.3★","4.4★","4.5★","4.6★","4.7★"];

// ── Product Images — Unsplash static photo IDs (guaranteed no CORS, always works) ──
// Each product has a unique, relevant Unsplash photo
const PRODUCT_IMAGES = {
  // Electronics · Mobiles
  "Samsung Galaxy A54":   "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=300&fit=crop&auto=format",
  "iPhone 14":            "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=300&h=300&fit=crop&auto=format",
  "OnePlus 11":           "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop&auto=format",
  "Redmi Note 12":        "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&h=300&fit=crop&auto=format",
  "Samsung Galaxy S23":   "https://images.unsplash.com/photo-1662947995647-f3a8c4674d61?w=300&h=300&fit=crop&auto=format",
  "Motorola Edge 40":     "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&h=300&fit=crop&auto=format",
  "Google Pixel 7":       "https://images.unsplash.com/photo-1667372636117-bf60b5c34e90?w=300&h=300&fit=crop&auto=format",
  "Vivo V27":             "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop&auto=format",

  // Electronics · Laptops
  "HP Pavilion 15":       "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop&auto=format",
  "Dell Inspiron 15":     "https://images.unsplash.com/photo-1588872657578-7efd81c9be80?w=300&h=300&fit=crop&auto=format",
  "Lenovo IdeaPad":       "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=300&h=300&fit=crop&auto=format",
  "Asus VivoBook":        "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=300&h=300&fit=crop&auto=format",
  "MacBook Air M2":       "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop&auto=format",
  "HP Spectre x360":      "https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=300&h=300&fit=crop&auto=format",

  // Electronics · TVs
  "LG 43 inch Smart TV":  "https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=300&h=300&fit=crop&auto=format",
  "Sony Bravia 55":       "https://images.unsplash.com/photo-1558888401-3cc1de77652d?w=300&h=300&fit=crop&auto=format",
  "Mi 32 inch HD":        "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=300&h=300&fit=crop&auto=format",
  "Samsung 50 inch 4K":   "https://images.unsplash.com/photo-1571415060716-baff5f717c37?w=300&h=300&fit=crop&auto=format",

  // Electronics · Tablet
  "iPad Air":             "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop&auto=format",

  // Clothing
  "Cotton Kurta Set":     "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=300&h=300&fit=crop&auto=format",
  "Levi's 511 Slim Fit":  "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop&auto=format",
  "Nike Dri-FIT":         "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&auto=format",
  "Silk Saree":           "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop&auto=format",
  "Floral Maxi Dress":    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop&auto=format",
  "Nike Air Max":         "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&auto=format",
  "Anarkali Suit":        "https://images.unsplash.com/photo-1571513800374-df1bbe650e56?w=300&h=300&fit=crop&auto=format",
  "Wrangler Regular Fit": "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=300&h=300&fit=crop&auto=format",
  "Chiffon Saree":        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=300&h=300&fit=crop&auto=format",
  "Adidas Originals":     "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=300&h=300&fit=crop&auto=format",
  "Ethnic Wear Set":      "https://images.unsplash.com/photo-1550639525-c97d455acf70?w=300&h=300&fit=crop&auto=format",
  "Puma Running Shoes":   "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&h=300&fit=crop&auto=format",

  // Home & Kitchen · Cookware
  "Prestige Pressure Cooker": "https://images.unsplash.com/photo-1585515320310-259814833e62?w=300&h=300&fit=crop&auto=format",
  "Hawkins Cooker":            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format",
  "Butterfly Gas Stove":       "https://images.unsplash.com/photo-1556909045-f3af5e3dedc9?w=300&h=300&fit=crop&auto=format",
  "Wonderchef Cookware Set":   "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&h=300&fit=crop&auto=format",

  // Home & Kitchen · Furniture
  "Wooden Study Table":    "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300&h=300&fit=crop&auto=format",
  "Sofa Set 3+1+1":        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop&auto=format",
  "Dining Table 6 Seater": "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=300&h=300&fit=crop&auto=format",
  "Bookshelf Wooden":      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=300&h=300&fit=crop&auto=format",

  // Home & Kitchen · Appliances
  "Philips Air Fryer":   "https://images.unsplash.com/photo-1585515320310-259814833e62?w=300&h=300&fit=crop&auto=format",
  "Bajaj Mixer Grinder": "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=300&h=300&fit=crop&auto=format",
  "Havells Iron":        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&auto=format",

  // Books — Open Library actual covers (CORS-free, verified)
  "Data Science Handbook":        "https://covers.openlibrary.org/b/id/8091016-L.jpg",
  "The Alchemist":                "https://covers.openlibrary.org/b/id/8392058-L.jpg",
  "Atomic Habits":                "https://covers.openlibrary.org/b/id/10295050-L.jpg",
  "Machine Learning by Mitchell": "https://covers.openlibrary.org/b/id/360753-L.jpg",
  "Harry Potter Set":             "https://covers.openlibrary.org/b/id/10110415-L.jpg",
  "Think and Grow Rich":          "https://covers.openlibrary.org/b/id/7960941-L.jpg",
  "Python Programming":           "https://covers.openlibrary.org/b/id/12998978-L.jpg",
  "Wings of Fire":                "https://covers.openlibrary.org/b/id/8739161-L.jpg",
  "The Power of Now":             "https://covers.openlibrary.org/b/id/8090985-L.jpg",

  // Beauty · Skincare — each a different skincare/beauty product photo
  "Lakme Face Wash":        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop&auto=format",
  "Neutrogena Moisturizer": "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop&auto=format",
  "The Ordinary Serum":     "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop&auto=format",
  "Himalaya Face Pack":     "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&h=300&fit=crop&auto=format",

  // Beauty · Haircare — shampoo bottle photos (different ones per product)
  "Dove Shampoo 700ml": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=300&h=300&fit=crop&auto=format",
  "Pantene Pro-V":       "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop&auto=format",
  "Biotique Bio Kelp":   "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=300&h=300&fit=crop&auto=format",

  // Beauty · Makeup — different makeup photos
  "Maybelline Foundation": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop&auto=format",
  "Lakme Lipstick Set":    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop&auto=format",
};

// Category fallback
const CATEGORY_FALLBACK = {
  "Electronics":    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&fit=crop&auto=format",
  "Clothing":       "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&h=300&fit=crop&auto=format",
  "Home & Kitchen": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format",
  "Books":          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop&auto=format",
  "Beauty":         "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop&auto=format",
};

function getProductImage(name, category) {
  return PRODUCT_IMAGES[name] || CATEGORY_FALLBACK[category] || CATEGORY_FALLBACK["Electronics"];
}

let allProducts = [], cart = JSON.parse(localStorage.getItem("cart")||"[]");

// ── Load Products ─────────────────────────────────────────────────────────────
async function loadProducts() {
  allProducts = await fetch(`${API}/products`).then(r=>r.json());
  renderProducts(allProducts);
  updateCartCount();
}

function renderProducts(list) {
  const grid = document.getElementById("productsGrid");
  if (!list.length) { grid.innerHTML = '<div class="loading">No products found.</div>'; return; }
  grid.innerHTML = list.map(p => {
    const discount = Math.floor(Math.random()*30)+5;
    const original = Math.round(p.price * (100/(100-discount)));
    const rating   = RATINGS[p.id % RATINGS.length];
    const imgUrl   = p.image_url && p.image_url.trim()
                     ? p.image_url
                     : getProductImage(p.name, p.category);
    const cartItem = cart.find(c => c.id === p.id);
    const qty      = cartItem ? cartItem.qty : 0;
    const btnHtml  = qty > 0
      ? `<div class="qty-control">
           <button class="qty-ctrl-btn" onclick="event.stopPropagation();cartDecrement(${p.id})">−</button>
           <span class="qty-ctrl-count">${qty}</span>
           <button class="qty-ctrl-btn" onclick="event.stopPropagation();cartIncrement(${p.id})">+</button>
         </div>`
      : `<button class="add-to-cart-btn" onclick="event.stopPropagation();addToCart(${p.id})">Add to Cart 🛒</button>`;
    return `
    <div class="product-card" id="pcard-${p.id}">
      <div class="product-img-wrapper" onclick="addToCart(${p.id})" style="cursor:pointer">
        <img
          src="${imgUrl}"
          alt="${p.name}"
          class="product-img"
          onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'product-img-placeholder\\'>${EMOJIS[p.category]||"🛍️"}</div>'"
        />
      </div>
      <div class="product-info">
        <div class="product-rating">${rating}</div>
        <div class="product-name" title="${p.name}">${p.name}</div>
        <div class="product-category">${p.category} · ${p.sub_category||""}</div>
        <div>
          <span class="product-price">₹${p.price.toLocaleString("en-IN")}</span>
          <span class="product-original">₹${original.toLocaleString("en-IN")}</span>
          <span class="product-discount">${discount}% off</span>
        </div>
        <div id="btn-${p.id}">${btnHtml}</div>
      </div>
    </div>`;
  }).join("");
}

// Update only the button area of a single product card
function updateProductBtn(id) {
  const el = document.getElementById(`btn-${id}`);
  if (!el) return;
  const cartItem = cart.find(c => c.id === id);
  const qty = cartItem ? cartItem.qty : 0;
  el.innerHTML = qty > 0
    ? `<div class="qty-control">
         <button class="qty-ctrl-btn" onclick="event.stopPropagation();cartDecrement(${id})">−</button>
         <span class="qty-ctrl-count">${qty}</span>
         <button class="qty-ctrl-btn" onclick="event.stopPropagation();cartIncrement(${id})">+</button>
       </div>`
    : `<button class="add-to-cart-btn" onclick="event.stopPropagation();addToCart(${id})">Add to Cart 🛒</button>`;
}

function cartIncrement(id) {
  const product = allProducts.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...product, qty: 1 });
  saveCart();
  updateProductBtn(id);
  showToast(`✅ ${product.name} added!`);
}

function cartDecrement(id) {
  const existing = cart.find(c => c.id === id);
  if (!existing) return;
  existing.qty--;
  if (existing.qty <= 0) cart = cart.filter(c => c.id !== id);
  saveCart();
  updateProductBtn(id);
}

// ── Filter / Search ───────────────────────────────────────────────────────────
function filterCategory(cat, btn) {
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderProducts(cat === "All" ? allProducts : allProducts.filter(p => p.category === cat));
}

function searchProducts(q) {
  renderProducts(allProducts.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.category.toLowerCase().includes(q.toLowerCase())
  ));
}

// ── Cart ──────────────────────────────────────────────────────────────────────
function addToCart(id) {
  cartIncrement(id);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); renderCart(); }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function updateCartCount() {
  const total = cart.reduce((s,c) => s + c.qty, 0);
  document.getElementById("cartCount").textContent = total;
}

function renderCart() {
  const el = document.getElementById("cartItems");
  if (!cart.length) {
    el.innerHTML = '<div class="cart-empty"><p>🛒</p><p>Your cart is empty</p></div>';
    document.getElementById("cartTotal").textContent = "₹0";
    return;
  }
  el.innerHTML = cart.map(c => {
    const product = allProducts.find(p => p.id === c.id);
    const imgUrl  = product
      ? (product.image_url && product.image_url.trim()
          ? product.image_url
          : getProductImage(product.name, product.category))
      : "";
    return `
    <div class="cart-item">
      <div class="cart-item-img">
        ${imgUrl
          ? `<img src="${imgUrl}" alt="${c.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="cart-item-emoji" style="display:none">${EMOJIS[c.category]||"🛍️"}</div>`
          : `<div class="cart-item-emoji">${EMOJIS[c.category]||"🛍️"}</div>`
        }
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${c.name}</div>
        <div class="cart-item-price">₹${c.price.toLocaleString("en-IN")}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${c.id},-1)">−</button>
          <span>${c.qty}</span>
          <button class="qty-btn" onclick="changeQty(${c.id},1)">+</button>
          <span class="remove-btn" onclick="removeFromCart(${c.id})">Remove</span>
        </div>
      </div>
    </div>`;
  }).join("");
  const total = cart.reduce((s,c) => s + c.price * c.qty, 0);
  document.getElementById("cartTotal").textContent = "₹" + total.toLocaleString("en-IN");
}

function toggleCart() {
  document.getElementById("cartSidebar").classList.toggle("open");
  document.getElementById("cartOverlay").classList.toggle("open");
  renderCart();
}

document.querySelector(".cart-btn").addEventListener("click", (e) => {
  e.preventDefault();
  toggleCart();
});

// ── Place Order ───────────────────────────────────────────────────────────────
function placeOrder() {
  if (!cart.length) return showToast("❌ Cart is empty!");
  // Fill order summary
  const summaryEl = document.getElementById("orderSummary");
  let rows = cart.map(c => `
    <div class="order-summary-item">
      <span>${c.name} × ${c.qty}</span>
      <span>₹${(c.price * c.qty).toLocaleString("en-IN")}</span>
    </div>`).join("");
  const total = cart.reduce((s,c) => s + c.price * c.qty, 0);
  rows += `<div class="order-summary-item"><span>Total</span><span>₹${total.toLocaleString("en-IN")}</span></div>`;
  summaryEl.innerHTML = rows;
  // Clear previous input
  document.getElementById("orderName").value = "";
  document.getElementById("orderRegion").value = "West";
  // Show modal
  document.getElementById("orderModal").classList.add("open");
}

function closeOrderModal() {
  document.getElementById("orderModal").classList.remove("open");
}

async function confirmOrder() {
  const name = document.getElementById("orderName").value.trim();
  if (!name) {
    document.getElementById("orderName").focus();
    document.getElementById("orderName").style.borderColor = "#ef4444";
    return;
  }
  document.getElementById("orderName").style.borderColor = "";
  const region = document.getElementById("orderRegion").value;

  for (const item of cart) {
    await fetch(`${API}/orders`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        order_date:    new Date().toISOString().split("T")[0],
        customer_name: name,
        customer_id:   "C" + Date.now(),
        product_id:    item.id,
        product_name:  item.name,
        category:      item.category,
        region,
        sales:         item.price * item.qty,
        quantity:      item.qty,
        discount:      0,
        profit:        Math.round(item.price * item.qty * 0.15),
        payment_mode:  "Online"
      })
    });
  }
  // Clear cart & close modals
  const clearedIds = cart.map(c => c.id);
  cart = [];
  saveCart();
  clearedIds.forEach(id => updateProductBtn(id));
  closeOrderModal();
  toggleCart();
  showToast("🎉 Order placed successfully!");
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

loadProducts();
