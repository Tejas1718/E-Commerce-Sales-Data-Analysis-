from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import sqlite3
import os
import urllib.request
from werkzeug.utils import secure_filename

app = Flask(__name__, template_folder="templates")
CORS(app)

DB = os.path.join(os.path.dirname(__file__), "ecommerce.db")

# Upload folder setup
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "static", "img")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

DB = os.path.join(os.path.dirname(__file__), "ecommerce.db")

# ── Database Setup ─────────────────────────────────────────────────────────────
def get_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS products (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT NOT NULL,
            category    TEXT NOT NULL,
            sub_category TEXT,
            price       REAL NOT NULL,
            stock       INTEGER DEFAULT 0,
            image_url   TEXT DEFAULT '',
            created_at  TEXT DEFAULT (date('now'))
        );

        CREATE TABLE IF NOT EXISTS orders (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            order_date   TEXT NOT NULL,
            customer_name TEXT NOT NULL,
            customer_id  TEXT,
            product_id   INTEGER,
            product_name TEXT,
            category     TEXT,
            region       TEXT,
            state        TEXT,
            city         TEXT,
            sales        REAL,
            quantity     INTEGER,
            discount     REAL DEFAULT 0,
            profit       REAL,
            payment_mode TEXT,
            FOREIGN KEY (product_id) REFERENCES products(id)
        );
    """)
    # Add image_url column to existing DB if not present
    try:
        conn.execute("ALTER TABLE products ADD COLUMN image_url TEXT DEFAULT ''")
        conn.commit()
    except Exception:
        pass  # Column already exists
    conn.commit()

    # Seed initial data if empty
    if conn.execute("SELECT COUNT(*) FROM products").fetchone()[0] == 0:
        seed_products(conn)
    if conn.execute("SELECT COUNT(*) FROM orders").fetchone()[0] == 0:
        seed_orders(conn)
    conn.close()

def seed_products(conn):
    products = [
        ("Samsung Galaxy A54",   "Electronics",   "Mobile",    25000, 15),
        ("iPhone 14",            "Electronics",   "Mobile",    75000, 8),
        ("OnePlus 11",           "Electronics",   "Mobile",    45000, 12),
        ("Redmi Note 12",        "Electronics",   "Mobile",    18000, 25),
        ("Samsung Galaxy S23",   "Electronics",   "Mobile",    80000, 6),
        ("Motorola Edge 40",     "Electronics",   "Mobile",    28000, 10),
        ("Google Pixel 7",       "Electronics",   "Mobile",    55000, 7),
        ("Vivo V27",             "Electronics",   "Mobile",    22000, 14),
        ("HP Pavilion 15",       "Electronics",   "Laptop",    55000, 10),
        ("Dell Inspiron 15",     "Electronics",   "Laptop",    48000, 8),
        ("Lenovo IdeaPad",       "Electronics",   "Laptop",    42000, 11),
        ("Asus VivoBook",        "Electronics",   "Laptop",    38000, 9),
        ("MacBook Air M2",       "Electronics",   "Laptop",   110000, 5),
        ("HP Spectre x360",      "Electronics",   "Laptop",    95000, 4),
        ("LG 43 inch Smart TV",  "Electronics",   "TV",        32000, 7),
        ("Sony Bravia 55",       "Electronics",   "TV",        65000, 5),
        ("Mi 32 inch HD",        "Electronics",   "TV",        12000, 18),
        ("Samsung 50 inch 4K",   "Electronics",   "TV",        45000, 6),
        ("iPad Air",             "Electronics",   "Tablet",    60000, 6),
        ("Cotton Kurta Set",     "Clothing",      "Kurta",      1200, 50),
        ("Levi's 511 Slim Fit",  "Clothing",      "Jeans",      3500, 30),
        ("Nike Dri-FIT",         "Clothing",      "T-Shirt",    1200, 45),
        ("Silk Saree",           "Clothing",      "Saree",      5500, 20),
        ("Floral Maxi Dress",    "Clothing",      "Dress",      2200, 35),
        ("Nike Air Max",         "Clothing",      "Shoes",      7500, 15),
        ("Anarkali Suit",        "Clothing",      "Kurta",      3800, 22),
        ("Wrangler Regular Fit", "Clothing",      "Jeans",      2800, 28),
        ("Chiffon Saree",        "Clothing",      "Saree",      2800, 18),
        ("Adidas Originals",     "Clothing",      "T-Shirt",    1800, 40),
        ("Ethnic Wear Set",      "Clothing",      "Dress",      4500, 16),
        ("Puma Running Shoes",   "Clothing",      "Shoes",      4500, 20),
        ("Prestige Pressure Cooker","Home & Kitchen","Cookware", 2500, 30),
        ("Hawkins Cooker",       "Home & Kitchen","Cookware",   1800, 35),
        ("Wooden Study Table",   "Home & Kitchen","Furniture",  8500, 10),
        ("Sofa Set 3+1+1",       "Home & Kitchen","Furniture", 35000, 4),
        ("Dining Table 6 Seater","Home & Kitchen","Furniture", 22000, 5),
        ("Philips Air Fryer",    "Home & Kitchen","Appliances", 8000, 12),
        ("Bajaj Mixer Grinder",  "Home & Kitchen","Appliances", 3200, 20),
        ("Butterfly Gas Stove",  "Home & Kitchen","Cookware",   4500, 15),
        ("Wonderchef Cookware Set","Home & Kitchen","Cookware", 6500, 10),
        ("Bookshelf Wooden",     "Home & Kitchen","Furniture",  5500, 8),
        ("Havells Iron",         "Home & Kitchen","Appliances", 1800, 25),
        ("Data Science Handbook","Books",         "Academic",    800, 40),
        ("The Alchemist",        "Books",         "Fiction",     350, 60),
        ("Atomic Habits",        "Books",         "Self-Help",   500, 55),
        ("Machine Learning by Mitchell","Books",  "Academic",   1200, 30),
        ("Harry Potter Set",     "Books",         "Fiction",    2500, 20),
        ("Think and Grow Rich",  "Books",         "Self-Help",   400, 50),
        ("Python Programming",   "Books",         "Academic",    850, 35),
        ("Wings of Fire",        "Books",         "Fiction",     350, 45),
        ("The Power of Now",     "Books",         "Self-Help",   450, 40),
        ("Lakme Face Wash",      "Beauty",        "Skincare",    450, 80),
        ("Neutrogena Moisturizer","Beauty",       "Skincare",    650, 60),
        ("The Ordinary Serum",   "Beauty",        "Skincare",   1500, 40),
        ("Himalaya Face Pack",   "Beauty",        "Skincare",    280, 90),
        ("Dove Shampoo 700ml",   "Beauty",        "Haircare",    380, 70),
        ("Pantene Pro-V",        "Beauty",        "Haircare",    320, 75),
        ("Biotique Bio Kelp",    "Beauty",        "Haircare",    450, 55),
        ("Maybelline Foundation","Beauty",        "Makeup",      750, 50),
        ("Lakme Lipstick Set",   "Beauty",        "Makeup",     1200, 45),
    ]
    conn.executemany(
        "INSERT INTO products (name, category, sub_category, price, stock) VALUES (?,?,?,?,?)",
        products
    )
    conn.commit()

def seed_orders(conn):
    orders = [
        ("2024-01-05","Rahul Sharma","C001",1,"Samsung Galaxy A54","Electronics","West","Maharashtra","Mumbai",25000,1,0.05,4500,"Online"),
        ("2024-01-07","Priya Patil","C002",20,"Cotton Kurta Set","Clothing","West","Maharashtra","Pune",1200,2,0.10,300,"COD"),
        ("2024-01-10","Amit Desai","C003",9,"HP Pavilion 15","Electronics","South","Karnataka","Bangalore",55000,1,0.00,8000,"Online"),
        ("2024-01-12","Sneha Joshi","C004",32,"Prestige Pressure Cooker","Home & Kitchen","North","Delhi","New Delhi",2500,1,0.05,500,"UPI"),
        ("2024-01-15","Vikram Singh","C005",15,"LG 43 inch Smart TV","Electronics","North","Uttar Pradesh","Lucknow",32000,1,0.08,5000,"EMI"),
        ("2024-01-18","Anjali Mehta","C006",43,"Data Science Handbook","Books","East","West Bengal","Kolkata",800,3,0.00,200,"Online"),
        ("2024-01-20","Rohan Kulkarni","C007",21,"Levi's 511 Slim Fit","Clothing","West","Maharashtra","Nashik",3500,1,0.10,700,"COD"),
        ("2024-01-22","Pooja Nair","C008",51,"Lakme Face Wash","Beauty","South","Kerala","Kochi",450,4,0.05,120,"UPI"),
        ("2024-01-25","Suresh Reddy","C009",2,"iPhone 14","Electronics","South","Telangana","Hyderabad",75000,1,0.00,12000,"EMI"),
        ("2024-01-28","Kavita Rao","C010",34,"Wooden Study Table","Home & Kitchen","South","Karnataka","Mysore",8500,1,0.05,1500,"Online"),
        ("2024-02-02","Deepak Verma","C011",10,"Dell Inspiron 15","Electronics","North","Punjab","Chandigarh",48000,1,0.05,7000,"EMI"),
        ("2024-02-05","Meena Iyer","C012",24,"Silk Saree","Clothing","South","Tamil Nadu","Chennai",5500,2,0.10,1100,"COD"),
        ("2024-02-08","Arjun Pandey","C013",44,"The Alchemist","Books","North","Rajasthan","Jaipur",350,2,0.00,80,"Online"),
        ("2024-02-10","Sunita Gupta","C014",55,"Dove Shampoo 700ml","Beauty","North","Delhi","New Delhi",380,5,0.05,90,"UPI"),
        ("2024-02-14","Nikhil Jain","C015",19,"iPad Air","Electronics","West","Gujarat","Ahmedabad",60000,1,0.00,9000,"EMI"),
        ("2024-02-18","Ritu Sharma","C016",33,"Hawkins Cooker","Home & Kitchen","West","Maharashtra","Mumbai",1800,2,0.05,400,"COD"),
        ("2024-02-20","Manish Tiwari","C017",22,"Nike Dri-FIT","Clothing","North","Uttar Pradesh","Agra",1200,3,0.10,300,"Online"),
        ("2024-02-22","Lakshmi Pillai","C018",52,"Neutrogena Moisturizer","Beauty","South","Kerala","Trivandrum",650,2,0.05,150,"UPI"),
        ("2024-02-25","Gaurav Mishra","C019",3,"OnePlus 11","Electronics","East","Bihar","Patna",45000,1,0.05,7500,"Online"),
        ("2024-02-28","Swati Bhatt","C020",45,"Atomic Habits","Books","West","Gujarat","Surat",500,1,0.00,120,"COD"),
        ("2024-03-03","Kiran Naik","C021",16,"Sony Bravia 55","Electronics","West","Goa","Panaji",65000,1,0.05,10000,"EMI"),
        ("2024-03-06","Pallavi Deshpande","C022",25,"Floral Maxi Dress","Clothing","West","Maharashtra","Pune",2200,1,0.10,440,"Online"),
        ("2024-03-10","Rajesh Kumar","C023",35,"Sofa Set 3+1+1","Home & Kitchen","North","Delhi","New Delhi",35000,1,0.00,5000,"EMI"),
        ("2024-03-12","Anita Sinha","C024",58,"Maybelline Foundation","Beauty","East","Jharkhand","Ranchi",750,3,0.05,180,"UPI"),
        ("2024-03-15","Sanjay Pawar","C025",11,"Lenovo IdeaPad","Electronics","West","Maharashtra","Kolhapur",42000,1,0.05,6500,"Online"),
        ("2024-03-18","Divya Menon","C026",46,"Machine Learning by Mitchell","Books","South","Karnataka","Bangalore",1200,1,0.00,300,"Online"),
        ("2024-03-20","Aakash Yadav","C027",26,"Nike Air Max","Clothing","North","Haryana","Gurgaon",7500,1,0.10,1500,"COD"),
        ("2024-03-22","Neha Kulkarni","C028",36,"Philips Air Fryer","Home & Kitchen","West","Maharashtra","Mumbai",8000,1,0.05,1200,"EMI"),
        ("2024-03-25","Tushar Gaikwad","C029",4,"Redmi Note 12","Electronics","West","Maharashtra","Aurangabad",18000,2,0.05,3000,"UPI"),
        ("2024-03-28","Shweta Joshi","C030",53,"The Ordinary Serum","Beauty","West","Maharashtra","Pune",1500,2,0.05,350,"Online"),
        ("2024-04-02","Mahesh Bhosale","C031",8,"Vivo V27","Electronics","West","Maharashtra","Nagpur",22000,1,0.05,3800,"COD"),
        ("2024-04-05","Rekha Pillai","C032",27,"Anarkali Suit","Clothing","South","Kerala","Kochi",3800,1,0.10,760,"Online"),
        ("2024-04-08","Vinod Sharma","C033",39,"Butterfly Gas Stove","Home & Kitchen","North","Delhi","New Delhi",4500,1,0.05,800,"UPI"),
        ("2024-04-10","Priyanka Desai","C034",47,"Harry Potter Set","Books","West","Maharashtra","Mumbai",2500,1,0.00,600,"Online"),
        ("2024-04-14","Sachin Patil","C035",12,"Asus VivoBook","Electronics","West","Maharashtra","Pune",38000,1,0.05,5500,"EMI"),
        ("2024-04-18","Geeta Nair","C036",56,"Pantene Pro-V","Beauty","South","Tamil Nadu","Coimbatore",320,4,0.05,80,"COD"),
        ("2024-04-20","Harish Reddy","C037",28,"Wrangler Regular Fit","Clothing","South","Andhra Pradesh","Vijayawada",2800,2,0.10,560,"UPI"),
        ("2024-04-22","Smita Wagh","C038",37,"Dining Table 6 Seater","Home & Kitchen","West","Maharashtra","Nashik",22000,1,0.00,3500,"EMI"),
        ("2024-04-25","Nilesh Jadhav","C039",17,"Mi 32 inch HD","Electronics","West","Maharashtra","Solapur",12000,1,0.08,2000,"Online"),
        ("2024-04-28","Archana Kulkarni","C040",48,"Think and Grow Rich","Books","West","Maharashtra","Pune",400,2,0.00,100,"COD"),
        ("2024-05-02","Pramod Shinde","C041",5,"Samsung Galaxy S23","Electronics","West","Maharashtra","Mumbai",80000,1,0.00,14000,"EMI"),
        ("2024-05-05","Vaishali Pawar","C042",29,"Chiffon Saree","Clothing","West","Maharashtra","Pune",2800,1,0.10,560,"Online"),
        ("2024-05-08","Santosh Mane","C043",38,"Bajaj Mixer Grinder","Home & Kitchen","West","Maharashtra","Kolhapur",3200,1,0.05,600,"UPI"),
        ("2024-05-10","Rupali Jadhav","C044",59,"Lakme Lipstick Set","Beauty","West","Maharashtra","Aurangabad",1200,3,0.05,280,"COD"),
        ("2024-05-14","Amol Deshmukh","C045",13,"MacBook Air M2","Electronics","West","Maharashtra","Pune",110000,1,0.00,18000,"Online"),
        ("2024-05-18","Sushma Rao","C046",49,"Python Programming","Books","South","Karnataka","Bangalore",850,2,0.00,200,"Online"),
        ("2024-05-20","Rajan Iyer","C047",30,"Adidas Originals","Clothing","South","Tamil Nadu","Chennai",1800,2,0.10,360,"UPI"),
        ("2024-05-22","Madhuri Patil","C048",40,"Wonderchef Cookware Set","Home & Kitchen","West","Maharashtra","Mumbai",6500,1,0.05,1100,"EMI"),
        ("2024-05-25","Sunil Bhatt","C049",7,"Google Pixel 7","Electronics","West","Gujarat","Ahmedabad",55000,1,0.05,9000,"Online"),
        ("2024-05-28","Nandini Sharma","C050",54,"Himalaya Face Pack","Beauty","North","Delhi","New Delhi",280,5,0.05,70,"COD"),
        ("2024-06-02","Anil Wadekar","C051",18,"Samsung 50 inch 4K","Electronics","West","Maharashtra","Pune",45000,1,0.05,7500,"EMI"),
        ("2024-06-05","Sunanda Kulkarni","C052",31,"Ethnic Wear Set","Clothing","West","Maharashtra","Mumbai",4500,1,0.10,900,"Online"),
        ("2024-06-08","Ganesh Pawar","C053",41,"Bookshelf Wooden","Home & Kitchen","West","Maharashtra","Nashik",5500,1,0.05,900,"UPI"),
        ("2024-06-10","Lata Desai","C054",50,"Wings of Fire","Books","West","Maharashtra","Pune",350,3,0.00,90,"COD"),
        ("2024-06-14","Hemant Joshi","C055",14,"HP Spectre x360","Electronics","West","Maharashtra","Mumbai",95000,1,0.00,15000,"EMI"),
        ("2024-06-18","Bharati Naik","C056",57,"Biotique Bio Kelp","Beauty","West","Goa","Panaji",450,3,0.05,110,"Online"),
        ("2024-06-20","Yogesh Shinde","C057",32,"Puma Running Shoes","Clothing","West","Maharashtra","Pune",4500,1,0.10,900,"UPI"),
        ("2024-06-22","Chhaya Mane","C058",42,"Havells Iron","Home & Kitchen","West","Maharashtra","Kolhapur",1800,2,0.05,360,"COD"),
        ("2024-06-25","Dhananjay Rao","C059",6,"Motorola Edge 40","Electronics","West","Maharashtra","Aurangabad",28000,1,0.05,4800,"Online"),
        ("2024-06-28","Ujwala Patil","C060",51,"The Power of Now","Books","West","Maharashtra","Pune",450,1,0.00,110,"EMI"),
    ]
    conn.executemany("""
        INSERT INTO orders
        (order_date,customer_name,customer_id,product_id,product_name,category,
         region,state,city,sales,quantity,discount,profit,payment_mode)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, orders)
    conn.commit()

# ── Product Routes ─────────────────────────────────────────────────────────────
@app.route("/api/products", methods=["GET"])
def get_products():
    conn = get_db()
    rows = conn.execute("SELECT * FROM products ORDER BY category, name").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route("/api/products", methods=["POST"])
def add_product():
    data = request.json
    conn = get_db()
    cur = conn.execute(
        "INSERT INTO products (name, category, sub_category, price, stock, image_url) VALUES (?,?,?,?,?,?)",
        (data["name"], data["category"], data.get("sub_category",""), data["price"], data.get("stock", 0), data.get("image_url",""))
    )
    conn.commit()
    new_id = cur.lastrowid
    product = dict(conn.execute("SELECT * FROM products WHERE id=?", (new_id,)).fetchone())
    conn.close()
    return jsonify(product), 201

@app.route("/api/products/<int:pid>", methods=["DELETE"])
def delete_product(pid):
    conn = get_db()
    conn.execute("DELETE FROM products WHERE id=?", (pid,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Product deleted"})

@app.route("/api/products/<int:pid>", methods=["PUT"])
def update_product(pid):
    data = request.json
    conn = get_db()
    conn.execute(
        "UPDATE products SET name=?, category=?, sub_category=?, price=?, stock=?, image_url=? WHERE id=?",
        (data["name"], data["category"], data.get("sub_category",""), data["price"], data.get("stock",0), data.get("image_url",""), pid)
    )
    conn.commit()
    product = dict(conn.execute("SELECT * FROM products WHERE id=?", (pid,)).fetchone())
    conn.close()
    return jsonify(product)

# ── Order Routes ───────────────────────────────────────────────────────────────
@app.route("/api/orders", methods=["GET"])
def get_orders():
    conn = get_db()
    rows = conn.execute("SELECT * FROM orders ORDER BY order_date DESC").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route("/api/orders", methods=["POST"])
def add_order():
    data = request.json
    conn = get_db()
    cur = conn.execute("""
        INSERT INTO orders
        (order_date,customer_name,customer_id,product_id,product_name,
         category,region,state,city,sales,quantity,discount,profit,payment_mode)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, (
        data["order_date"], data["customer_name"], data.get("customer_id",""),
        data.get("product_id"), data["product_name"], data["category"],
        data["region"], data.get("state",""), data.get("city",""),
        data["sales"], data["quantity"], data.get("discount",0),
        data["profit"], data["payment_mode"]
    ))
    conn.commit()
    order = dict(conn.execute("SELECT * FROM orders WHERE id=?", (cur.lastrowid,)).fetchone())
    conn.close()
    return jsonify(order), 201

# ── Dashboard Stats ────────────────────────────────────────────────────────────
@app.route("/api/stats", methods=["GET"])
def get_stats():
    conn = get_db()
    stats = dict(conn.execute("""
        SELECT
            COUNT(*)            AS total_orders,
            COUNT(DISTINCT customer_id) AS total_customers,
            ROUND(SUM(sales),2) AS total_sales,
            ROUND(SUM(profit),2) AS total_profit,
            ROUND(SUM(profit)*100.0/SUM(sales),2) AS profit_margin
        FROM orders
    """).fetchone())

    stats["sales_by_category"] = [dict(r) for r in conn.execute(
        "SELECT category, ROUND(SUM(sales),2) as total FROM orders GROUP BY category ORDER BY total DESC"
    ).fetchall()]

    stats["profit_by_category"] = [dict(r) for r in conn.execute(
        "SELECT category, ROUND(SUM(profit),2) as total FROM orders GROUP BY category ORDER BY total DESC"
    ).fetchall()]

    stats["monthly_sales"] = [dict(r) for r in conn.execute(
        "SELECT strftime('%Y-%m', order_date) as month, ROUND(SUM(sales),2) as total FROM orders GROUP BY month ORDER BY month"
    ).fetchall()]

    stats["sales_by_region"] = [dict(r) for r in conn.execute(
        "SELECT region, ROUND(SUM(sales),2) as total FROM orders GROUP BY region ORDER BY total DESC"
    ).fetchall()]

    stats["payment_mode"] = [dict(r) for r in conn.execute(
        "SELECT payment_mode, COUNT(*) as count FROM orders GROUP BY payment_mode ORDER BY count DESC"
    ).fetchall()]

    stats["top_products"] = [dict(r) for r in conn.execute(
        "SELECT product_name, ROUND(SUM(sales),2) as total FROM orders GROUP BY product_name ORDER BY total DESC LIMIT 10"
    ).fetchall()]

    conn.close()
    return jsonify(stats)

# ── Image Upload ──────────────────────────────────────────────────────────────
@app.route("/api/products/<int:pid>/upload-image", methods=["POST"])
def upload_image(pid):
    if "image" not in request.files:
        return jsonify({"error": "No image file"}), 400
    file = request.files["image"]
    if file.filename == "" or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file"}), 400
    ext = file.filename.rsplit(".", 1)[1].lower()
    filename = f"product_{pid}.{ext}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)
    image_url = f"/static/img/{filename}"
    conn = get_db()
    conn.execute("UPDATE products SET image_url=? WHERE id=?", (image_url, pid))
    conn.commit()
    conn.close()
    return jsonify({"image_url": image_url})

# ── Image Proxy ──────────────────────────────────────────────────────────────
@app.route("/api/image-proxy")
def image_proxy():
    url = request.args.get("url", "")
    if not url:
        return "No URL", 400
    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
        with urllib.request.urlopen(req, timeout=5) as resp:
            content_type = resp.headers.get("Content-Type", "image/jpeg")
            data = resp.read()
        return Response(data, content_type=content_type)
    except Exception:
        return "Image not found", 404

# ── Serve Frontend ────────────────────────────────────────────────────────────
from flask import render_template

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/admin")
def admin():
    return render_template("admin.html")

# ── Run ────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    init_db()
    import threading, webbrowser, time
    def open_browser():
        time.sleep(1)
        webbrowser.open("http://localhost:5000")
    threading.Thread(target=open_browser, daemon=True).start()
    print("\nServer running: http://localhost:5000")
    print("Press Ctrl+C to stop\n")
    app.run(debug=False, port=5000)
