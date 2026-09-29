import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os
import threading
import webbrowser
import http.server
import socketserver

# ── Setup ──────────────────────────────────────────────────────────────────────
df = pd.read_csv("dataset/ecommerce_sales.csv", parse_dates=["Order_Date"])
os.makedirs("analysis/charts", exist_ok=True)
sns.set_theme(style="whitegrid")

# ── Basic Info ─────────────────────────────────────────────────────────────────
print("=" * 55)
print("       E-COMMERCE SALES DATA ANALYSIS REPORT")
print("=" * 55)
print(f"\nTotal Records     : {len(df)}")
print(f"Date Range        : {df['Order_Date'].min().date()} to {df['Order_Date'].max().date()}")
print(f"Total Revenue     : ₹{df['Sales'].sum():,.0f}")
print(f"Total Profit      : ₹{df['Profit'].sum():,.0f}")
print(f"Profit Margin     : {(df['Profit'].sum()/df['Sales'].sum()*100):.2f}%")
print(f"Total Orders      : {df['Order_ID'].nunique()}")
print(f"Unique Customers  : {df['Customer_ID'].nunique()}")

# ── 1. Sales by Category ───────────────────────────────────────────────────────
cat_sales = df.groupby("Category")["Sales"].sum().sort_values(ascending=False)
print("\n--- Sales by Category ---")
print(cat_sales.to_string())

fig, ax = plt.subplots(figsize=(8, 5))
cat_sales.plot(kind="bar", ax=ax, color=sns.color_palette("Set2"))
ax.set_title("Total Sales by Category")
ax.set_xlabel("Category")
ax.set_ylabel("Sales (₹)")
ax.tick_params(axis="x", rotation=30)
plt.tight_layout()
plt.savefig("analysis/charts/01_sales_by_category.png")
plt.close()

# ── 2. Monthly Sales Trend ─────────────────────────────────────────────────────
df["Month"] = df["Order_Date"].dt.to_period("M")
monthly = df.groupby("Month")["Sales"].sum()
print("\n--- Monthly Sales Trend ---")
print(monthly.to_string())

fig, ax = plt.subplots(figsize=(10, 5))
monthly.plot(kind="line", marker="o", ax=ax, color="steelblue")
ax.set_title("Monthly Sales Trend")
ax.set_xlabel("Month")
ax.set_ylabel("Sales (₹)")
plt.tight_layout()
plt.savefig("analysis/charts/02_monthly_sales_trend.png")
plt.close()

# ── 3. Profit by Category ──────────────────────────────────────────────────────
cat_profit = df.groupby("Category")["Profit"].sum().sort_values(ascending=False)
print("\n--- Profit by Category ---")
print(cat_profit.to_string())

fig, ax = plt.subplots(figsize=(8, 5))
cat_profit.plot(kind="bar", ax=ax, color=sns.color_palette("Set1"))
ax.set_title("Total Profit by Category")
ax.set_xlabel("Category")
ax.set_ylabel("Profit (₹)")
ax.tick_params(axis="x", rotation=30)
plt.tight_layout()
plt.savefig("analysis/charts/03_profit_by_category.png")
plt.close()

# ── 4. Sales by Region ─────────────────────────────────────────────────────────
region_sales = df.groupby("Region")["Sales"].sum().sort_values(ascending=False)
print("\n--- Sales by Region ---")
print(region_sales.to_string())

fig, ax = plt.subplots(figsize=(6, 6))
region_sales.plot(kind="pie", ax=ax, autopct="%1.1f%%", startangle=140,
                  colors=sns.color_palette("pastel"))
ax.set_title("Sales Distribution by Region")
ax.set_ylabel("")
plt.tight_layout()
plt.savefig("analysis/charts/04_sales_by_region.png")
plt.close()

# ── 5. Payment Mode Distribution ──────────────────────────────────────────────
pay_counts = df["Payment_Mode"].value_counts()
print("\n--- Payment Mode Distribution ---")
print(pay_counts.to_string())

fig, ax = plt.subplots(figsize=(7, 5))
pay_counts.plot(kind="bar", ax=ax, color=sns.color_palette("muted"))
ax.set_title("Orders by Payment Mode")
ax.set_xlabel("Payment Mode")
ax.set_ylabel("Number of Orders")
ax.tick_params(axis="x", rotation=0)
plt.tight_layout()
plt.savefig("analysis/charts/05_payment_mode.png")
plt.close()

# ── 6. Top 10 Products by Sales ────────────────────────────────────────────────
top_products = df.groupby("Product_Name")["Sales"].sum().nlargest(10)
print("\n--- Top 10 Products by Sales ---")
print(top_products.to_string())

fig, ax = plt.subplots(figsize=(10, 6))
top_products.sort_values().plot(kind="barh", ax=ax, color="teal")
ax.set_title("Top 10 Products by Sales")
ax.set_xlabel("Sales (₹)")
plt.tight_layout()
plt.savefig("analysis/charts/06_top10_products.png")
plt.close()

# ── 7. Sales vs Profit Scatter ─────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(8, 5))
sns.scatterplot(data=df, x="Sales", y="Profit", hue="Category", ax=ax, s=80)
ax.set_title("Sales vs Profit by Category")
plt.tight_layout()
plt.savefig("analysis/charts/07_sales_vs_profit.png")
plt.close()

# ── 8. Discount Impact on Profit ──────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(8, 5))
sns.scatterplot(data=df, x="Discount", y="Profit", hue="Category", ax=ax, s=80)
ax.set_title("Discount vs Profit")
plt.tight_layout()
plt.savefig("analysis/charts/08_discount_vs_profit.png")
plt.close()

print("\n✅ Analysis complete! Charts saved in: analysis/charts/")

# ── Launch Frontend Dashboard in Browser ──────────────────────────────────────
PORT = 8000
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # suppress server logs

def start_server():
    os.chdir(BASE_DIR)
    with socketserver.TCPServer(("", PORT), QuietHandler) as httpd:
        httpd.serve_forever()

print(f"\n🌐 Starting dashboard server on http://localhost:{PORT}/dashboard/")
threading.Thread(target=start_server, daemon=True).start()

import time
time.sleep(1)
webbrowser.open(f"http://localhost:{PORT}/dashboard/")
print("✅ Dashboard opened in browser!")
print("   Press Ctrl+C to stop the server.\n")

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("\n🛑 Server stopped.")
