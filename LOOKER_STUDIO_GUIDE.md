# 📊 Looker Studio Reporting Suite Guide

## Complete Guide to Creating Profit-Driven Invoice Reports with Margin Analysis

---

## 🎯 Business Questions This Guide Answers

1. **Are we charging customers enough for our products?** → Margin Analysis Dashboard
2. **How can we know when our margin is shrinking?** → Profit Trend Monitoring
3. **Can we monitor costs by Vendor to see who is raising prices?** → Vendor Price Intelligence
4. **How is our business doing?** → Executive Performance Dashboard
5. **What are our busiest/slowest times of year?** → Seasonality & Trend Analysis

---

## 🚀 Quick Start: Connecting Your Data

### Step 1: Connect BOTH Sheets to Looker Studio

#### Connect Invoices Sheet
1. **Open Your Google Sheet** with the invoice data
2. **Click** `Extensions` > `Looker Studio` > `Create`
3. Looker Studio will automatically open with your sheet as the data source
4. **Alternative Method:**
   - Go to [lookerstudio.google.com](https://lookerstudio.google.com)
   - Click **Create** > **Data Source**
   - Select **Google Sheets**
   - Choose your Invoice Manager spreadsheet
   - Select the **Invoices** sheet
   - **Ensure "Use first row as headers" is checked.**
   - Click **Connect**

#### Connect Markups Sheet
1. In Looker Studio, click **Resource** > **Manage added data sources**
2. Click **Add a Data Source**
3. Select **Google Sheets**
4. Choose the same Invoice Manager spreadsheet
5. Select the **Markups** sheet
6. **Ensure "Use first row as headers" is checked.**
7. Click **Connect**

### Step 2: Configure Data Source Settings

#### Invoices Sheet - Field Configuration
| Field Name | Type | Aggregation |
|------------|------|-------------|
| ID | Text | None |
| Invoice Number | Text | None |
| Invoice Date | Date (YYYYMMDD) | None |
| Vendor | Text | None |
| Flower Cost | Currency (USD) | Sum |
| Botanicals Cost | Currency (USD) | Sum |
| Supplies Cost | Currency (USD) | Sum |
| Greens Cost | Currency (USD) | Sum |
| Miscellaneous Cost | Currency (USD) | Sum |
| Invoice Credits | Currency (USD) | Sum |
| Total Due | Currency (USD) | Sum |
| Status | Text | None |
| Created Timestamp | Date & Time | None |
| Last Modified Timestamp | Date & Time | None |
| Created By | Text | None |
| Last Modified By | Text | None |

#### Markups Sheet - Field Configuration
| Field Name | Type | Aggregation |
|------------|------|-------------|
| ID | Text | None |
| Effective Date | Date (YYYYMMDD) | None |
| Flowers Markup | Number | None |
| Botanicals Markup | Number | None |
| Supplies Markup | Number | None |
| Greens Markup | Number | None |
| Miscellaneous Markup | Number | None |
| Created Timestamp | Date & Time | None |
| Last Modified Timestamp | Date & Time | None |
| Created By | Text | None |
| Last Modified By | Text | None |

**CRITICAL:** The **Effective Date** field indicates when each set of markups became active. This allows historical markup tracking so invoices use the correct markup values that were in effect at the time.

### Step 3: Create a Blended Data Source with Dynamic Date Matching

Looker Studio doesn't support complex SQL-style joins with inequality operators (like "find the most recent date ≤ invoice date") directly in the blend interface. However, we can use a **workaround with Google Sheets formulas** to handle this dynamically.

#### Option A: Dynamic Approach Using Google Sheets (RECOMMENDED)

This approach requires no manual updates to Looker Studio when markups change - everything updates automatically!

**In Your Google Sheets - Add Columns to Invoices Sheet:**

1. **Open your Invoices sheet** in Google Sheets
2. **Add a new column** called `Applicable Markup Date` (next to your existing columns)
3. **In the first data row** (assuming headers are in row 1, this would be row 2), enter this formula:

```
=MAXIFS(Markups!$B$2:$B$1000, Markups!$B$2:$B$1000, "<="&A2)
```

**Where:**
- `Markups!$B$2:$B$1000` is the Effective Date column in your Markups sheet. Using a specific range like `$B$2:$B$1000` is more efficient than searching the entire column (`$B:$B`). Adjust `1000` as needed to ensure it's larger than your expected number of markup entries.
- `A2` is the Invoice Date in the current row.
- This formula finds the most recent markup effective date that is on or before the invoice date.

**💡 Pro Tip for Robustness:** If an invoice is dated *before* your first effective date, the formula will return `0` (which appears as `12/30/1899`) and the invoice won't be matched correctly. To prevent this, ensure your first `Effective Date` in the `Markups` sheet is earlier than your oldest invoice.

4. **Drag the formula down** to fill all rows in your Invoices sheet
5. **Format the column** as a Date (Format → Number → Date)

**Example:**
```
Row 2: Invoice Date = 2025-03-15
       Formula finds: MAX(2025-01-01) where dates ≤ 2025-03-15
       Result: 2025-01-01

Row 3: Invoice Date = 2025-12-01
       Formula finds: MAX(2025-01-01, 2025-11-01) where dates ≤ 2025-12-01
       Result: 2025-11-01
```

**Benefits of This Approach:**
- ✅ **Fully automatic** - When you add a new markup row with a new effective date, the formulas automatically recalculate
- ✅ **No Looker Studio updates needed** - The Applicable Markup Date column updates in Google Sheets, and Looker Studio just reads it
- ✅ **Works for all invoices** - Past, present, and future invoices automatically get the correct markup date
- ✅ **Easy to verify** - You can see the applied markup date right in your spreadsheet

6. **Verify it's working**: Add a test row to your Markups sheet with a future effective date and watch the Applicable Markup Date column update for future invoices

**In Looker Studio:**

1. **Refresh your Invoices data source** (Resource → Manage added data sources → Invoices → Refresh fields)
2. The new `Applicable Markup Date` column will now be available as a field
3. Ensure it's set as **Date** type

Now proceed to Step 4 to create the blend using this dynamic field!

---

#### Option B: Manual Calculated Field in Looker Studio (Not Recommended)

If you prefer to keep everything in Looker Studio without modifying your Google Sheet, you can create a calculated field, but it **requires manual updates** each time markups change:

**In Looker Studio - Invoices Data Source:**

1. Go to **Resource** > **Manage added data sources**
2. Click on your **Invoices** data source
3. Click **Add a Field**
4. **Field Name:** `Applicable Markup Date`
5. **Formula:**

```
CASE
  WHEN Invoice Date >= DATE(2025, 11, 1) THEN DATE(2025, 11, 1)
  WHEN Invoice Date >= DATE(2025, 1, 1) THEN DATE(2025, 1, 1)
  -- Fallback for any invoices dated before the first known markup period.
  -- This should be your earliest effective date.
  ELSE DATE(2025, 1, 1)
END
```

6. Click **Save**

**⚠️ Limitation:** You must manually update this formula each time you add a new markup effective date to your Markups sheet.

---

**We strongly recommend Option A (Google Sheets formula)** for a fully automated, hands-off solution.

### Step 4: Create a Blended Data Source (CRITICAL for Profit Analysis with Historical Markup Tracking)

Now we'll create a blend that joins invoices to the correct markup row based on date.

#### Detailed Step-by-Step Instructions:

1. **Open or Create a Report** in Looker Studio
   - Go to [lookerstudio.google.com](https://lookerstudio.google.com)
   - Either open an existing report or create a new blank report

2. **Access the Blend Data Function**
   - Method 1: In the toolbar, click **Resource** > **Manage added data sources** > **Blend Data** (bottom of the modal)
   - Method 2: While editing a chart, click the **Blend Data** button in the data panel
   - Method 3: From the main report menu, click **Add Data** > **Blend Data**

3. **Configure the Left Table (Invoices)**
   - In the blend editor, you'll see two tables side-by-side
   - **Left Table:** Select your **Invoices** data source from the dropdown
   - **Dimensions to Include:** All fields from the Invoices sheet are automatically available. You only need to add the join key.
   - **Join Key:** Click **Add a join key** and select **Applicable Markup Date**.

4. **Configure the Right Table (Markups)**
   - **Right Table:** Select your **Markups** data source from the dropdown
   - **Dimensions to Include:**
     - Effective Date
     - Flowers Markup
     - Botanicals Markup
     - Supplies Markup
     - Greens Markup
     - Miscellaneous Markup
   - **Join Key:** Click **Add a join key** and select **Effective Date**

5. **Set the Join Type**
   - In the middle between the two tables, you'll see the join configuration
   - Click on the join diagram
   - Select **Left Outer Join**
   - This ensures all invoices are included, even if there's no matching markup row (though there should always be one)

6. **Verify the Join Keys Match**
   - You should see a line connecting **Applicable Markup Date** (from Invoices) to **Effective Date** (from Markups)
   - This ensures each invoice gets the markup values from the row with a matching effective date

7. **Name Your Blended Data Source**
   - At the top of the blend editor, click on the default name (e.g., "Blend 1")
   - Rename it to: **"Invoices with Markups"**

8. **Save the Blend**
   - Click **Save** (top right)
   - You now have a blended data source that correctly matches each invoice to its historical markup values!

#### Visual Reference for Join Configuration:

```
┌─────────────────────────┐         ┌─────────────────────────┐
│   INVOICES (Left)       │         │   MARKUPS (Right)       │
├─────────────────────────┤         ├─────────────────────────┤
│ Invoice Date            │         │ Effective Date          │
│ Invoice Number          │         │ Flowers Markup          │
│ Vendor                  │         │ Botanicals Markup       │
│ Flower Cost             │         │ Supplies Markup         │
│ Total Due               │         │ Greens Markup           │
│ Applicable Markup Date ─┼────────▶│ Miscellaneous Markup    │
│   (calculated)          │  JOIN   │                         │
└─────────────────────────┘         └─────────────────────────┘
        LEFT OUTER JOIN
   (All invoices included, matched to correct markup by date)
```

#### How the Date-Based Join Works:

**Example Scenario:**
- Markups Sheet Row 1: Effective Date = Jan 1, 2025, Flowers Markup = 2.0x
- Markups Sheet Row 2: Effective Date = Nov 1, 2025, Flowers Markup = 2.5x

**Invoice Matching:**
- Invoice dated **March 15, 2025** → Applicable Markup Date = Jan 1, 2025 → Joins to Row 1 → Uses 2.0x markup
- Invoice dated **December 1, 2025** → Applicable Markup Date = Nov 1, 2025 → Joins to Row 2 → Uses 2.5x markup

This ensures **historical accuracy** - old invoices use old markups, new invoices use new markups!

### Step 5: Create Calculated Fields for Profit Analysis

Now you need to create calculated fields that will use the markup values from your blend. For a robust and scalable report, you should **always add calculated fields to the data source itself**, not to individual charts. This ensures they can be reused across all charts and reports.

**How to Add Calculated Fields (Recommended Method):**

1.  Go to **Resource** > **Manage added data sources**.
2.  Find your **"Invoices with Markups"** blended data source and click **Edit**.
3.  In the data source editor, click **Add a Field** (top right).
4.  Enter the field name and formula from the list below.
5.  Repeat for all the calculated fields. Fields created this way are available to all charts using this blend.

Adding fields to a single chart is possible but **not recommended** as it prevents reuse and makes maintenance difficult. Use the chart-level method only for quick, temporary tests.

**💡 Pro Tip: Naming Convention**
> As a best practice, consider prefixing your calculated fields with `c_` (e.g., `c_Total Profit`, `c_Profit Margin %`). This makes them easy to find and identify in the field list, distinguishing them from fields that come directly from your Google Sheet.

Below are the critical calculated field formulas you'll need. Create these in the **blended data source editor**:

#### Core Business Metrics

**1. Wholesale Cost (What We Pay Vendors)**
*This is simply the total amount from the invoice.*
```
Total Due
```

**2. Retail Price - Flowers**
*Calculates the retail price based on the markup.*
```
Flower Cost * Flowers Markup
```

**3. Retail Price - Botanicals**
```
Botanicals Cost * Botanicals Markup
```

**4. Retail Price - Supplies**
```
Supplies Cost * Supplies Markup
```

**5. Retail Price - Greens**
```
Greens Cost * Greens Markup
```

**6. Retail Price - Miscellaneous**
```
Miscellaneous Cost * Miscellaneous Markup
```

**7. Total Retail Price (What Customers Should Pay)**
*The total price after all markups are applied, before credits.*
```
(Retail Price - Flowers) + 
(Retail Price - Botanicals) + 
(Retail Price - Supplies) + 
(Retail Price - Greens) + 
(Retail Price - Miscellaneous)
```

**8. Final Retail Price**
*The final price after invoice-level credits are applied.*
```
Total Retail Price - Invoice Credits
```

**9. Total Profit**
*The difference between the final retail price and the wholesale cost.*
```
Final Retail Price - Total Due
```

**10. Profit Margin %**
*The percentage of profit relative to the final retail price. Set the field's type to `Numeric` > `Percent`.*
```
CASE
  WHEN Final Retail Price = 0 THEN 0
  ELSE Total Profit / Final Retail Price
END
```

**11. Year**
```
YEAR(Invoice Date)
```

**12. Quarter**
*Uses the native Looker Studio function for simplicity.*
```
QUARTER(Invoice Date)
```

**13. Month-Year**
*For sorting and displaying trends over time.*
```
FORMAT_DATE("%Y-%m", Invoice Date)
```

**14. Month Name**
```
FORMAT_DATE("%B", Invoice Date)
```

**15. Week of Year**
```
WEEK(Invoice Date)
```

**16. Day of Week**
```
FORMAT_DATE("%A", Invoice Date)
```

**17. Invoice Count**
```
COUNT(Invoice Number)
```

**18. Category Cost % - Flowers**
*Calculates the percentage of total cost for a specific category. Create one for each category.*
```
Flower Cost / Total Due
```

---

## 📈 Report #1: Executive Performance Dashboard

**Purpose:** How is our business doing overall?

### Layout Structure

**Report Title:** Business Performance - Executive Dashboard

#### Top Row: Financial Health Scorecards
1. **Total Wholesale Costs (What We Pay Vendors)** 
   - Metric: Sum of Total Due
   - Period: YTD
   - Comparison: vs. Previous Year

2. **Total Final Retail Price (What Customers Should Pay)**
   - Metric: Sum of Final Retail Price
   - Period: YTD
   - Comparison: vs. Previous Year

3. **Total Profit**
   - Metric: Sum of Total Profit
   - Period: YTD
   - Comparison: vs. Previous Year
   - Color: Green if positive, Red if negative

4. **Average Profit Margin %**
   - Metric: AVG of Profit Margin %
   - Period: YTD
   - Comparison: vs. Target (e.g., 40%)
   - **Alert if < 30%**

#### Second Row: Volume & Activity Metrics
5. **Total Invoices**
   - Metric: COUNT of Invoice Number
   - Period: YTD

6. **Average Invoice Value (Wholesale)**
   - Metric: AVG of Total Due
   - Period: YTD

7. **Average Profit per Invoice**
   - Metric: AVG of Total Profit
   - Comparison: vs. Previous Period

8. **Active Vendors**
   - Metric: COUNT_DISTINCT of Vendor
   - Period: Current Month

#### Third Row: Profit & Cost Trends
9. **Monthly Profit Trend (Dual-Axis Line Chart)**
   - Dimension: Invoice Date (Month)
   - Left Y-Axis: Sum of Total Profit (Line)
   - Right Y-Axis: Profit Margin % (Line)
   - Date Range: Last 12 months
   - Add trend lines
   - **Key Question:** Is margin shrinking?

10. **Wholesale vs Retail Comparison (Stacked Area Chart)**
    - Dimension: Invoice Date (Month)
    - Metrics:
      - Wholesale Costs (Bottom)
      - Profit (Stacked on top)
    - Shows gap between what we pay vendors and what customers should pay

#### Fourth Row: Category Performance
11. **Profit by Category (Waterfall Chart)**
    - Shows profit contribution by:
      - Flowers Profit
      - Botanicals Profit
      - Supplies Profit
      - Greens Profit
      - Miscellaneous Profit
      - Less: Credits
    - **Key Question:** Which categories are most profitable?

12. **Category Margin % Comparison (Bullet Chart)**
    - Dimension: Cost Category
    - Metric: Profit Margin % by category
    - Target Line: Overall average margin
    - **Key Question:** Are we charging enough for each category?

#### Bottom Row: Vendor Insights
13. **Top 10 Vendors by Spend (Horizontal Bar)**
    - Dimension: Vendor
    - Metric: Sum of Total Due
    - Sort: Descending
    - Color-coded by spend level

14. **Vendor Profit Contribution (Donut Chart)**
    - Dimension: Vendor (Top 5 + Others)
    - Metric: Sum of Total Profit
    - Shows which vendors drive the most profit

---

## 💰 Report #2: Margin Analysis Dashboard

**Purpose:** Are we charging enough? Is our margin shrinking?

### Layout Structure

**Report Title:** Profit Margin Deep Dive

#### Filter Controls (Top)
- Date Range Control
- Vendor Multi-Select Dropdown
- Category Dropdown

#### Alert Scorecards (Critical Metrics)
1. **Current Month Margin %**
   - Metric: Profit Margin %
   - Comparison: vs. Last Month
   - **Alert Red if declining**

2. **Margin Trend (3-Month Moving Average)**
   - Shows if margin is trending up or down
   - **Alert if downward trend detected**

3. **Invoices Below Target Margin**
   - Count of invoices where Profit Margin % < 30%
   - **Alert if increasing**

4. **Best Performing Category**
   - Category with highest Profit Margin %

#### Main Visualizations

5. **Margin Over Time (Combo Chart with Trendline)**
   - Dimension: Invoice Date (Week or Month)
   - Metrics:
     - Profit Margin % (Line)
     - 3-Month Moving Average (Smoothed Line)
   - Trendline: Shows if margin is improving or declining
   - **CRITICAL for detecting margin shrinkage**

6. **Margin Distribution (Histogram)**
   - X-Axis: Profit Margin % (Bins)
   - Y-Axis: Count of Invoices
   - Shows normal distribution
   - Highlights low-margin invoices
   - **Key Question:** How many invoices are below target?

7. **Margin by Category Over Time (Multi-Line Chart)**
   - Dimension: Invoice Date (Month)
   - Metrics (6 lines):
     - Flowers Margin %
     - Botanicals Margin %
     - Supplies Margin %
     - Greens Margin %
     - Miscellaneous Margin %
     - Overall Margin %
   - **Key Question:** Which categories are losing margin?

8. **Margin by Vendor (Heatmap Table)**
   - Rows: Vendor
   - Columns:
     - Current Month Margin %
     - Last Month Margin %
     - Change (%)
     - Trend Indicator (↑↓)
   - Conditional Formatting:
     - Green: Improving margin
     - Yellow: Stable margin
     - Red: Declining margin
   - Sort: By margin change (ascending)
   - **Key Question:** Which vendors are impacting our margins?

9. **Low Margin Invoices Table (Bottom 20)**
   - Dimension: Invoice Number, Vendor, Invoice Date
   - Metrics:
     - Wholesale Cost
     - Retail Value
     - Profit Margin %
   - Filter: Show only invoices with margin < 30%
   - Sort: Ascending by margin
   - **Action Item:** Investigate these invoices

10. **Markup Effectiveness Scorecard Grid**
    - Show current markup multipliers from Markups sheet
    - For each category, show:
      - Current Markup
      - Average Margin % Achieved
      - Recommended Markup (to achieve target margin)

---

## 🏷️ Report #3: Vendor Price Intelligence

**Purpose:** Monitor costs by Vendor to see who is raising prices

### Layout Structure

**Report Title:** Vendor Cost & Price Tracking

#### Filter Controls
- Vendor Multi-Select
- Date Range
- Category Dropdown

#### Alert Scorecards
1. **Vendors with Price Increases (vs. Prior Period)**
   - Manually compare current vs. previous period average costs.
   - Count vendors with an average cost increase > 5%.

2. **Highest Price Increase**
   - Identify the vendor with the largest % increase from the main table.

3. **Total Cost Impact**
   - Manually calculate the dollar amount impact of key price increases.

#### Price Trend Analysis

4. **Vendor Average Invoice Cost Over Time (Multi-Line Chart)**
   - Dimension: Invoice Date (Month)
   - Breakdown: Vendor (Top 10)
   - Metric: AVG of Total Due
   - Multiple lines for each vendor
   - **Key Question:** Which vendors are raising prices?

5. **Vendor Price Change Heatmap (Calendar View)**
   - Rows: Vendor
   - Columns: Month
   - Metric: % Change in Avg Invoice Cost (Requires manual calculation or advanced data prep)
   - Color Scale:
     - Deep Red: >10% increase
     - Red: 5-10% increase
     - Yellow: 0-5% increase
     - Green: Price decrease
   - **Quick visual identification of price increases**

6. **Month-over-Month Price Change Table**
   - Dimension: Vendor
   - Metrics:
     - Current Month Avg Cost
     - Last Month Avg Cost
     - $ Change
     - % Change
     - # of Invoices (to validate sample size)
   - Sort: By % change (descending)
   - Conditional Formatting: Red for increases > 5%

7. **Category Cost Trends by Vendor (Stacked Bar)**
   - Dimension: Vendor (Top 10)
   - Metrics (Stacked):
     - Flowers Cost Trend
     - Botanicals Cost Trend
     - Supplies Cost Trend
     - Greens Cost Trend
     - Misc Cost Trend
   - **Key Question:** What categories are driving vendor price increases?

8. **Price Increase Timeline (Gantt-style)**
   - Shows when each vendor had significant price changes
   - Helps identify market-wide price trends

9. **Vendor Price Detail Table (Drill-Down Ready)**
    - Dimension: Vendor
    - Metrics:
      - Current Avg Cost
      - 3-Month Avg Cost
      - 6-Month Avg Cost
      - YTD Avg Cost
      - % Change (3mo vs. 6mo)
      - % Change (YTD vs. Last Year)
      - First Invoice Date
      - Last Invoice Date
      - Total Invoices
    - Enable drill-down to invoice-level detail

---

## 📅 Report #4: Seasonality & Business Trends

**Purpose:** What are our busiest and slowest times? Are they consistent?

### Layout Structure

**Report Title:** Seasonal Patterns & Business Cycles

#### Filter Controls
- Year Selector (Multi-Select for comparison)
- Vendor Filter
- Category Filter

#### Business Activity Overview

1. **Annual Activity Heatmap (Calendar)**
   - Rows: Day of Week
   - Columns: Week of Year
   - Metric: Sum of Total Due (or Invoice Count)
   - Color Intensity: Darker = Busier
   - **Visual pattern recognition for busy/slow periods**

2. **Monthly Spend Pattern (Box & Whisker Plot)**
   - Dimension: Month Name
   - Metric: Total Due
   - Shows median, quartiles, and outliers by month
   - Compare multiple years if available
   - **Key Question:** Is seasonality consistent year-over-year?

3. **Quarter-over-Quarter Comparison (Grouped Column)**
   - Dimension: Quarter
   - Breakdown: Year
   - Metric: Sum of Total Due
   - Side-by-side bars for each year
   - **Shows quarter performance trends**

4. **Day of Week Analysis (Polar Chart)**
   - Dimension: Day of Week
   - Metric: AVG Invoice Count
   - Circular chart showing weekly patterns
   - **Identifies preferred ordering days**

#### Seasonality Deep Dive

5. **Year-over-Year Monthly Comparison (Multi-Line Chart)**
   - Dimension: Month (1-12)
   - Breakdown: Year
   - Metric: Sum of Total Due
   - Multiple lines for each year
   - **Shows if seasonal patterns repeat**

6. **Cumulative Spend by Day of Year (Running Total)**
   - Dimension: Day of Year (1-365)
   - Breakdown: Year
   - Metric: Running Total of Total Due
   - **Shows pacing and growth year-over-year**

7. **Busy vs. Slow Periods Table**
   - Calculate top 5 busiest months and top 5 slowest months
   - Columns:
     - Month-Year
     - Total Spend
     - Invoice Count
     - Avg Invoice Value
     - vs. Annual Average (%)
   - **Clearly identifies peaks and valleys**

8. **Outlier Analysis (Scatter + Annotation)**
   - X-Axis: Week of Year
   - Y-Axis: Total Spend
   - Points: Individual weeks
   - Annotations: Label significant outliers
   - **Key Question:** Do we understand the outliers?
   - Click to drill into outlier weeks

9. **Vendor Seasonality Matrix (Pivot Table)**
   - Rows: Vendor
   - Columns: Month or Quarter
   - Values: Sum of Total Due
   - Conditional Formatting: Heatmap
   - **Shows if specific vendors have seasonal patterns**

10. **Predictive Forecast (Time Series with Forecast)**
    - Dimension: Invoice Date (Month)
    - Metric: Sum of Total Due
    - Enable Looker Studio's forecasting feature
    - Shows expected future spend based on historical patterns
    - **Helps with budgeting and planning**

---

## 📊 Report #5: Category Performance Analysis

**Purpose:** Which product categories drive profit and growth?

### Layout Structure

**Report Title:** Cost Category Breakdown & Profitability

#### Interactive Filters
- Date Range
- Vendor Selection
- Category Selection

#### Category Financial Overview

1. **Category Profit Scorecards** (6 Cards in Grid)
   - **Flowers:**
     - Total Wholesale Cost
     - Final Retail Price
     - Total Profit
     - Profit Margin %
   - **Botanicals:**
     - Total Wholesale Cost
     - Final Retail Price
     - Total Profit
     - Profit Margin %
   - (Repeat for Supplies, Greens, Misc, Credits)

2. **Category Comparison Table**
   - Rows: Cost Category
   - Columns:
     - Wholesale Cost (What We Pay Vendors)
     - Final Retail Price (What Customers Should Pay)
     - Total Profit
     - Profit Margin %
     - % of Total Business
     - Current Markup
     - Recommended Markup (to achieve 40% margin)
   - Sort: By Profit (descending)
   - **Key Question:** Which categories need markup adjustments?

3. **Category Mix Over Time (100% Stacked Area)**
   - Dimension: Invoice Date (Month)
   - Metrics: All categories as %
   - Shows changing product mix
   - **Identifies shifting business focus**

4. **Category Profitability Quadrant (Bubble Chart)**
   - X-Axis: Wholesale Cost (Volume)
   - Y-Axis: Profit Margin %
   - Bubble Size: Total Profit
   - Color: Category
   - **Quadrants:**
     - High Volume + High Margin = Stars ⭐
     - High Volume + Low Margin = Cash Cows 🐄
     - Low Volume + High Margin = Question Marks ❓
     - Low Volume + Low Margin = Dogs 🐕

5. **Category Trends (Multi-Line Chart with Dual Y-Axis)**
   - Dimension: Month
   - Left Y-Axis: Wholesale Cost (6 lines for each category)
   - Right Y-Axis: Profit Margin % (6 lines for each category)
   - **Shows volume and profitability trends**

6. **Category by Vendor Matrix (Pivot Table)**
   - Rows: Vendor
   - Columns: Cost Categories
   - Values: Sum of Wholesale Cost
   - Conditional Formatting: Heatmap
   - **Shows vendor specialization and dependencies**

---

## 🔍 Report #6: Invoice-Level Detail Explorer

**Purpose:** Drill-down investigation tool for specific invoices

### Layout Structure

**Report Title:** Invoice Detail & Investigation

#### Search & Filter Controls
- Invoice Number Search
- Vendor Multi-Select
- Date Range
- Cost Range Slider
- Margin Range Slider

#### Detailed Invoice Table (Master View)
- Dimensions: Invoice Number, Vendor, Invoice Date
- Metrics:
  - Flower Cost (Wholesale)
  - Botanicals Cost (Wholesale)
  - Supplies Cost (Wholesale)
  - Greens Cost (Wholesale)
  - Misc Cost (Wholesale)
  - Credits
  - **Total Due (Wholesale Cost)**
  - **Final Retail Price**
  - **Total Profit**
  - **Profit Margin %**
  - Created Timestamp
  - Last Modified Timestamp
- Features:
  - Sortable columns
  - Conditional formatting on Margin %
  - Row-level drill-down to invoice detail
  - Export to CSV

#### Invoice Detail Panel (Click to View)
When an invoice is selected:
- Full invoice information
- Wholesale vs. Retail comparison (bar chart)
- Category breakdown (pie chart)
- Margin calculation breakdown
- Edit link (to app if permissions allow)

---

## 🚨 Report #7: Alerts & Anomaly Detection

**Purpose:** Automated monitoring for business issues

### Layout Structure

**Report Title:** Business Health Alerts & Anomalies

#### Critical Alert Scorecards
1. **Margin Alert**
   - Shows if overall margin dropped > 5% vs. last period
   - Color: Red if triggered

2. **Price Increase Alert**
   - Count of vendors with avg cost increase > 10% (manual check)
   - Color: Yellow if > 0

3. **Low Activity Alert**
   - Shows if current month invoices < 50% of average
   - Color: Yellow if triggered

#### Anomaly Visualizations

5. **Margin Degradation Tracking (Time Series with Alerts)**
   - Dimension: Invoice Date (Week)
   - Metric: Profit Margin %
   - Reference Line: 30% (warning threshold)
   - Reference Line: 20% (critical threshold)
   - Alert annotations when margin crosses thresholds

6. **Daily Spend Anomalies (Heatmap)**
   - Rows: Day of Week
   - Columns: Week of Year
   - Metric: Total Spend
   - Highlight cells > 150% of average daily spend
   - **Visual detection of unusual activity**

---

## 🎨 Design Best Practices

### Color Scheme (Brand Aligned)
```css
Primary: #ec4899 (Pink)
Secondary: #8b5cf6 (Purple)
Success/Profit: #10b981 (Green)
Warning: #f59e0b (Amber)
Danger/Loss: #ef4444 (Red)
Neutral: #6b7280 (Gray)
Wholesale Costs: #3b82f6 (Blue)
Retail Revenue: #10b981 (Green)
```

### Margin Health Color Coding
- **> 40%:** Dark Green (Excellent)
- **30-40%:** Green (Good)
- **20-30%:** Yellow (Warning)
- **10-20%:** Orange (Concern)
- **< 10%:** Red (Critical)

### Typography
- **Headers:** 24-32px, Bold
- **Subheaders:** 18-20px, Semi-bold
- **Body Text:** 12-14px, Regular
- **Scorecards:** 36-48px, Bold
- **Alert Text:** 14px, Bold, Red/Yellow

### Layout Guidelines
1. **Use a Report Theme** - To apply your color scheme and fonts consistently across all reports, create and apply a **Report Theme**. This is far more efficient than styling each chart manually.
2. Use **2-3 column grid** for desktop
3. **Mobile responsive:** Stack components vertically
4. **White space:** Minimum 16px padding between elements
5. **Filter controls:** Always at top, sticky if possible
6. **Alert scorecards:** Prominent placement (top of page)
7. **Logo placement:** Top left corner

---

## 📋 Report Usage Matrix

| Report | Primary Audience | Frequency | Key Questions Answered |
|--------|-----------------|-----------|------------------------|
| Executive Performance | Owners, C-Suite | Daily/Weekly | How is the business doing? |
| Margin Analysis | Finance, Owners | Weekly | Are we charging enough? Is margin shrinking? |
| Vendor Price Intelligence | Procurement, Finance | Weekly | Who is raising prices? |
| Seasonality & Trends | Operations, Strategy | Monthly | When are we busiest/slowest? |
| Category Performance | Operations, Finance | Monthly | Which categories drive profit? |
| Invoice Detail Explorer | Operations, Finance | As Needed | Investigate specific transactions |
| Alerts & Anomalies | All Teams | Daily | What needs immediate attention? |

---

## 🎓 Implementation Checklist

### Week 1: Data Foundation & Critical Reports
- [ ] Add Markups sheet to your Google Sheet (if not already present)
- [ ] Add "Effective Date" column to Markups sheet
- [ ] Enter effective dates for each markup row (e.g., Jan 1, 2025, Nov 1, 2025)
- [ ] Ensure all historical markup changes have rows with effective dates
- [ ] **CRITICAL:** Add "Applicable Markup Date" column to Invoices sheet with MAXIFS formula (see Step 3, Option A)
- [ ] Verify the formula is working: Check that invoices show correct effective dates
- [ ] Connect Invoices sheet to Looker Studio
- [ ] Connect Markups sheet to Looker Studio
- [ ] Refresh Invoices data source in Looker Studio to include new "Applicable Markup Date" field
- [ ] Create blended data source (Invoices + Markups) with date-based join
- [ ] Verify join is working: check a few invoices to ensure they're using correct markup values
- [ ] Create all calculated fields (profit, margin, wholesale) in blended data source
- [ ] Test calculations with sample invoices from different date ranges
- [ ] Build Executive Performance Dashboard
- [ ] Build Margin Analysis Dashboard
- [ ] **Validate:** Ensure profit calculations are accurate and use correct historical markups

### Week 2: Business Intelligence Reports
- [ ] Build Vendor Price Intelligence Report
- [ ] Build Seasonality & Business Trends Report
- [ ] Build Category Performance Analysis
- [ ] Configure all filter controls
- [ ] Add comparison periods (MoM, YoY)
- [ ] Apply brand colors and formatting
- [ ] Test mobile responsiveness

### Week 3: Advanced Features & Deployment
- [ ] Build Invoice Detail Explorer
- [ ] Build Alerts & Anomaly Detection
- [ ] Set up email scheduled reports:
  - Daily: Alert summary
  - Weekly: Margin analysis
  - Monthly: Full business review
- [ ] Create PDF export templates
- [ ] Add data freshness indicators
- [ ] User acceptance testing
- [ ] Train team on how to use reports
- [ ] Share with stakeholders

### Ongoing: Optimization & Expansion
- [ ] Monitor report usage analytics
- [ ] Gather user feedback
- [ ] When markups change: Add new row to Markups sheet with new Effective Date and new markup values
- [ ] Verify new invoices are automatically using updated markup values (Google Sheets formula handles this!)
- [ ] Optimize slow-loading charts
- [ ] Add new metrics based on business needs
- [ ] Archive unused reports

### When Markups Change - Maintenance Checklist (Fully Automated!)

Every time you update your markup multipliers:

#### If Using Option A (Google Sheets Formula - RECOMMENDED):

1. **Add New Row to Markups Sheet**
   - Add a new row to your Markups sheet with:
     - **Effective Date:** The date the new markups take effect (e.g., 2026-02-01)
     - **Markup values:** New multipliers for each category
   - Example:
     ```
     | Effective Date | Flowers Markup | Botanicals Markup | ... |
     | 2026-02-01     | 2.6           | 2.5              | ... |
     ```

2. **That's It! Everything Else Is Automatic**
   - ✅ The MAXIFS formula in the Invoices sheet automatically recalculates
   - ✅ New invoices on/after Feb 1, 2026 automatically use the new markups
   - ✅ Historical invoices continue using their original markups
   - ✅ Looker Studio reports automatically reflect the correct values
   - ✅ **No Looker Studio changes needed!**

3. **Verify (Optional but Recommended)**
   - Create a test invoice with today's date in Google Sheets
   - Check that the `Applicable Markup Date` column shows the correct effective date
   - View the invoice in your Looker Studio report
   - Verify it's using the new markup values in profit calculations

#### If Using Option B (Manual Looker Studio Calculated Field - NOT RECOMMENDED):

1. **Add New Row to Markups Sheet**
   - Add a new row with the new effective date and markup values

2. **Update the Looker Studio Calculated Field** ⚠️ (Manual Step Required)
   - In Looker Studio, go to **Resource** > **Manage added data sources**
   - Click on **Invoices** data source
   - Edit the **Applicable Markup Date** calculated field
   - Add a new CASE condition for the new effective date:
   ```
   CASE
     WHEN Invoice Date >= DATE(2026, 2, 1) THEN DATE(2026, 2, 1)
     WHEN Invoice Date >= DATE(2025, 11, 1) THEN DATE(2025, 11, 1)
     WHEN Invoice Date >= DATE(2025, 1, 1) THEN DATE(2025, 1, 1)
     ELSE DATE(2025, 1, 1)
   END
   ```
   - Always add new dates at the TOP of the CASE statement
   - Save the field

3. **Test the Update**
   - Create a test invoice with today's date
   - View it in your Looker Studio report
   - Verify it's using the new markup values

---

**💡 Pro Tip:** If you're currently using Option B and want to switch to the fully automated Option A:

1. Add the `Applicable Markup Date` column with the MAXIFS formula to your Invoices sheet
2. In Looker Studio, refresh your Invoices data source (Resource → Manage added data sources → Invoices → Refresh fields)
3. Edit your blend to use the new field from Google Sheets instead of the calculated field
4. Delete the old calculated field from Looker Studio
5. You're now fully automated!

---

## 💡 Pro Tips

### Profit Analysis Best Practices
1. **Regular Markup Review** - Update Markups sheet monthly based on market conditions
2. **Historical Markup Tracking** - Consider adding "Effective Date" to Markups sheet for historical analysis
3. **Category-Specific Targets** - Set different margin targets for different categories
4. **Vendor Negotiation Tool** - Use price intelligence report before vendor negotiations
5. **Seasonal Markup Adjustment** - Consider different markups for busy vs. slow seasons

### Performance Optimization
1. **Use date range controls** - Default to last 12 months for fast loading
2. **Pre-aggregate data** - Create summary tables for large datasets
3. **Limit chart data** - Use TOP N filters (Top 10 vendors, etc.)
4. **Cached data** - Use data freshness of 1-4 hours (not real-time)
5. **Incremental refresh** - Only refresh new/changed data

### User Experience
1. **Add context** - Tooltips explaining what "good" looks like (e.g., "Target margin: 40%")
2. **Use comparisons** - Always show vs. previous period and vs. target
3. **Highlight insights** - Add text annotations explaining unusual patterns
4. **Mobile-first** - Test on phone/tablet before sharing
5. **Consistent navigation** - Add menu/tabs for easy report switching
6. **Color consistency** - Always use green for profit, red for loss

### Data Quality
1. **Prevent Bad Data Entry** - In your `Markups` sheet, use **Data > Data validation** to ensure markup columns only accept numbers greater than 1. This prevents errors like typing "2x" instead of "2".
2. **Validate markups** - Ensure markups in Markups sheet are correct (>1.0 for profit)
3. **Filter active invoices** - Exclude ARCHIVED status if needed
4. **Handle nulls** - Use IFNULL() and COALESCE() in calculated fields
5. **Verify calculations** - Spot-check profit calculations against manual calculations
6. **Document assumptions** - Add "About" page explaining how profit is calculated

---

## 🔧 Advanced Features to Implement

### 1. **Markup Optimization Recommendations**
- Calculate recommended markup to achieve target margin
- Show "What-if" scenarios (e.g., "If we increased flowers markup to 2.5x, margin would be...")
- Compare current markup vs. industry benchmarks

### 2. **Predictive Analytics**
- Forecast future costs based on vendor price trends
- Predict seasonal demand
- Alert when projected margin will fall below target

### 3. **Goal Tracking**
- Set annual profit targets
- Track progress with visual indicators (gauges, progress bars)
- Show on-track/off-track status

### 4. **Drill-Down Capabilities**
- Click vendor → See all invoices
- Click month → See daily breakdown
- Click category → See vendor breakdown
- Click invoice → See full detail

### 5. **Interactive Date Controls**
- Quick filters: "Last 30 Days", "This Quarter", "YTD", "Last Year"
- Custom date range picker
- Fiscal year option (if different from calendar year)

### 6. **Email Scheduled Reports**
- **Daily (8 AM):** Alert summary with margin status
- **Monday Morning:** Weekly vendor price changes
- **Monthly:** Full business review with profit analysis
- **Quarterly:** Seasonality trends and forecasts

### 7. **Embed & Share**
- Embed in internal company portal
- Create view-only public links for investors/stakeholders
- Restrict sensitive profit data to authorized users only

---

## 📊 Sample Business Insights You'll Discover

With these reports in place, you'll be able to answer:

### Profitability Questions
- ✅ "Our overall margin is 35%, but Flowers category is only 28%. We need to increase Flowers markup from 2.0x to 2.3x to charge customers more."
- ✅ "Margin dropped from 38% to 32% in the last 2 months. Investigation shows Vendor ABC raised wholesale prices by 15%."
- ✅ "We're charging customers enough on Supplies (45% margin) but not enough on Greens (22% margin)."

### Vendor Intelligence
- ✅ "Vendor XYZ increased prices 12% in March. Time to negotiate or find alternatives."
- ✅ "We're spending 40% of our budget with one vendor - too much concentration risk."

### Seasonality Insights
- ✅ "May and December are consistently our busiest months (wedding + holiday season)."
- ✅ "January is always slow - consider promotional pricing to drive volume."
- ✅ "Last year we had an outlier spike in June due to a corporate event - that's not repeating this year."

### Category Performance
- ✅ "Flowers represent 60% of our wholesale costs but only 50% of our profit - we're over-reliant on this low-margin category."
- ✅ "Botanicals have the highest margin (48%) - we should promote these products more to customers."
- ✅ "Miscellaneous wholesale costs are growing as % of total - need to understand what's driving this."

---

## 🔗 Additional Resources

### Looker Studio Learning
- [Looker Studio Help Center](https://support.google.com/looker-studio/)
- [Calculated Fields Guide](https://support.google.com/looker-studio/topic/6379407)
- [Blending Data Tutorial](https://support.google.com/looker-studio/answer/6299685)
- YouTube: "Looker Studio Calculated Fields Tutorial"
- YouTube: "Looker Studio Blended Data Tutorial"

### Business Analytics Best Practices
- Search: "Profit margin analysis dashboards"
- Search: "Vendor price monitoring best practices"
- Search: "Seasonality analysis for small business"

### Community & Support
- [Looker Studio Community Forum](https://www.en.advertisercommunity.com/t5/Data-Studio/bd-p/Data_Studio)
- Reddit: r/DataStudio
- LinkedIn: Looker Studio User Groups

---

## 🚨 Important Notes for Small Datasets

Since you mentioned not having significant data yet:

### Initial Setup (< 3 months data)
- ✅ Set up all reports now - they'll improve as data accumulates
- ✅ Focus on Executive Dashboard and Margin Analysis first
- ⚠️ Vendor price trends need at least 3-6 months to be meaningful
- ⚠️ Seasonality analysis requires at least 12 months (ideally 2+ years)
- ✅ Use this time to validate that calculations are correct

### Data Building Phase (3-6 months data)
- ✅ Month-over-month trends become meaningful
- ✅ Vendor price tracking starts to show patterns
- ✅ Category performance comparisons are reliable
- ⚠️ Seasonality still requires more data

### Mature Analytics (12+ months data)
- ✅ Year-over-year comparisons available
- ✅ Seasonality patterns clearly visible
- ✅ Predictive forecasting becomes accurate
- ✅ All reports fully functional

### What to Do NOW with Limited Data
1. **Set up the infrastructure** - Reports, calculated fields, dashboards
2. **Validate calculations** - Manually verify profit calculations are correct
3. **Monitor margin in real-time** - Even with little data, you can track if you're charging enough
4. **Use for invoice entry** - Review each new invoice against target margin
5. **Plan for the future** - Dashboards will auto-populate as you add data

---

## 📞 Next Steps

### This Week
1. ✅ Add Markups sheet to Google Sheet with current multipliers
2. ✅ Connect both sheets to Looker Studio
3. ✅ Create blended data source
4. ✅ Build calculated fields for profit/margin
5. ✅ Create Executive Performance Dashboard
6. ✅ Verify profit calculations are accurate

### Next Week  
1. ✅ Build Margin Analysis Dashboard
2. ✅ Build Vendor Price Intelligence
3. ✅ Set up email alerts for margin drops
4. ✅ Share with business owner for feedback

### Next Month
1. ✅ Build remaining dashboards
2. ✅ Analyze first month of margin data
3. ✅ Adjust markups based on insights
4. ✅ Train team on using reports
5. ✅ Establish regular review cadence

### Quarterly
1. ✅ Review and update markups in Markups sheet
2. ✅ Analyze vendor price trends (once data is available)
3. ✅ Assess seasonal patterns (after 12 months)
4. ✅ Optimize underperforming categories

---

**Version:** 2.0 - Profit & Margin Analysis Edition  
**Last Updated:** November 14, 2025  
**Created for:** Bonnie's Invoice Manager with Markup Tracking

🎉 **Ready to maximize your profit margins!**
