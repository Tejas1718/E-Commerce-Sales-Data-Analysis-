# E-Commerce Sales Data Analysis
## MCA II - Semester III Research Project (SPPU) - 2026

---

## Project Structure

```
E-Commerce Sales Data Analysis/
│
├── dataset/
│   └── ecommerce_sales.csv        ← Sales dataset (60 records)
│
├── analysis/
│   ├── ecommerce_analysis.py      ← Python analysis script
│   └── charts/                    ← Auto-generated charts (after running script)
│       ├── 01_sales_by_category.png
│       ├── 02_monthly_sales_trend.png
│       ├── 03_profit_by_category.png
│       ├── 04_sales_by_region.png
│       ├── 05_payment_mode.png
│       ├── 06_top10_products.png
│       ├── 07_sales_vs_profit.png
│       └── 08_discount_vs_profit.png
│
├── synopsis/
│   └── Project_Synopsis.txt       ← Synopsis for guide submission
│
└── README.md
```

---

## Setup Instructions

### Step 1: Install Python Libraries
Open Command Prompt and run:
```
pip install pandas matplotlib seaborn
```

### Step 2: Run the Analysis Script
Navigate to the project folder and run:
```
cd "E-Commerce Sales Data Analysis"
python analysis/ecommerce_analysis.py
```

### Step 3: Power BI Dashboard
1. Open Power BI Desktop
2. Click **Get Data → Text/CSV**
3. Select `dataset/ecommerce_sales.csv`
4. Create visuals:
   - Bar Chart: Sales by Category
   - Line Chart: Monthly Sales Trend
   - Pie Chart: Sales by Region
   - Bar Chart: Top Products
   - Card: Total Sales, Total Profit, Profit Margin

---

## Dataset Columns

| Column        | Description                        |
|---------------|------------------------------------|
| Order_ID      | Unique order identifier            |
| Order_Date    | Date of order                      |
| Customer_ID   | Unique customer identifier         |
| Customer_Name | Customer full name                 |
| Category      | Product category                   |
| Sub_Category  | Product sub-category               |
| Product_Name  | Name of the product                |
| Region        | Geographic region (N/S/E/W)        |
| State         | State of delivery                  |
| City          | City of delivery                   |
| Sales         | Sale amount in ₹                   |
| Quantity      | Number of units ordered            |
| Discount      | Discount applied (0.0 to 1.0)      |
| Profit        | Profit earned in ₹                 |
| Payment_Mode  | Online / COD / UPI / EMI           |

---

## Key Analysis Performed

1. Total Revenue & Profit Summary
2. Sales by Product Category
3. Monthly Sales Trend (Jan–Jun 2024)
4. Profit by Category
5. Regional Sales Distribution
6. Payment Mode Preferences
7. Top 10 Products by Revenue
8. Sales vs Profit Correlation
9. Discount Impact on Profit

---

*Submitted to: Savitribai Phule Pune University (SPPU)*
