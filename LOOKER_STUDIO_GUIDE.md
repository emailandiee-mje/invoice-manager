# 📊 Looker Studio Reporting Suite Guide

## Complete Guide to Creating Profit-Driven Invoice Reports with Margin Analysis

---

## 🎯 Business Questions This Guide Answers

1. **Are we charging enough for our products?** → Margin Analysis Dashboard
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
   - Click **Connect**

#### Connect Markups Sheet
1. In Looker Studio, click **Resource** > **Manage added data sources**
2. Click **Add a Data Source**
3. Select **Google Sheets**
4. Choose the same Invoice Manager spreadsheet
5. Select the **Markups** sheet
6. Click **Connect**

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
| Flowers Markup | Number | None |
| Botanicals Markup | Number | None |
| Supplies Markup | Number | None |
| Greens Markup | Number | None |
| Miscellaneous Markup | Number | None |
| Created Timestamp | Date & Time | None |
| Last Modified Timestamp | Date & Time | None |
| Created By | Text | None |
| Last Modified By | Text | None |

### Step 3: Create a Blended Data Source (CRITICAL for Profit Analysis)

To calculate profits, we need to join Invoices with Markups:

1. In your report, click **Resource** > **Manage added data sources**
2. Click **Blend Data**
3. **Left Table:** Invoices sheet
4. **Right Table:** Markups sheet
5. **Join Configuration:**
   - Join Type: **Left Outer Join** (to get the most recent markup)
   - Join Key: Use a calculated field to always join to the latest markup row
6. Name it: **"Invoices with Markups"**

**Note:** Since Markups sheet likely has one row (current markups), all invoices will use the same markup values. If you want historical markup tracking, you'll need to add a date-based join.

### Step 4: Create Calculated Fields for Profit Analysis

Click **Add a Field** in your blended data source and create these critical metrics:

#### Core Business Metrics

**1. Retail Cost (What We Pay)**
```
Total Due
```

**2. Wholesale - Flowers**
```
Flower Cost * Flowers Markup
```

**3. Wholesale - Botanicals**
```
Botanicals Cost * Botanicals Markup
```

**4. Wholesale - Supplies**
```
Supplies Cost * Supplies Markup
```

**5. Wholesale - Greens**
```
Greens Cost * Greens Markup
```

**6. Wholesale - Miscellaneous**
```
Miscellaneous Cost * Miscellaneous Markup
```

**7. Total Wholesale (What We Should Charge)**
```
(Flower Cost * Flowers Markup) + 
(Botanicals Cost * Botanicals Markup) + 
(Supplies Cost * Supplies Markup) + 
(Greens Cost * Greens Markup) + 
(Miscellaneous Cost * Miscellaneous Markup) - 
Invoice Credits
```

**8. Total Profit/Margin**
```
((Flower Cost * Flowers Markup) + 
(Botanicals Cost * Botanicals Markup) + 
(Supplies Cost * Supplies Markup) + 
(Greens Cost * Greens Markup) + 
(Miscellaneous Cost * Miscellaneous Markup) - 
Invoice Credits) - Total Due
```

**9. Profit Margin %**
```
CASE 
  WHEN Total Due = 0 THEN 0
  ELSE (((Flower Cost * Flowers Markup) + 
         (Botanicals Cost * Botanicals Markup) + 
         (Supplies Cost * Supplies Markup) + 
         (Greens Cost * Greens Markup) + 
         (Miscellaneous Cost * Miscellaneous Markup) - 
         Invoice Credits - Total Due) / 
        ((Flower Cost * Flowers Markup) + 
         (Botanicals Cost * Botanicals Markup) + 
         (Supplies Cost * Supplies Markup) + 
         (Greens Cost * Greens Markup) + 
         (Miscellaneous Cost * Miscellaneous Markup) - 
         Invoice Credits)) * 100
END
```

**10. Month-Year**
```
CONCAT(YEAR(Invoice Date), "-", FORMAT_DATE("%m", Invoice Date), " - ", FORMAT_DATE("%B", Invoice Date))
```

**11. Quarter**
```
CONCAT("Q", CAST(CEIL(MONTH(Invoice Date)/3) AS TEXT), " ", CAST(YEAR(Invoice Date) AS TEXT))
```

**12. Year**
```
YEAR(Invoice Date)
```

**13. Month Name**
```
FORMAT_DATE("%B", Invoice Date)
```

**14. Week of Year**
```
WEEK(Invoice Date)
```

**15. Day of Week**
```
FORMAT_DATE("%A", Invoice Date)
```

**16. Average Invoice Value (Retail)**
```
AVG(Total Due)
```

**17. Average Profit per Invoice**
```
AVG(Total Profit/Margin)
```

**18. Invoice Count**
```
COUNT(Invoice Number)
```

**19. Vendor Price Change Indicator** (Requires historical data)
```
(AVG(Total Due) - LAG(AVG(Total Due), 1)) / LAG(AVG(Total Due), 1) * 100
```

**20. Category Cost %**
```
(Flower Cost / Total Due) * 100
```

---

## 📈 Report #1: Executive Performance Dashboard

**Purpose:** How is our business doing overall?

### Layout Structure

**Report Title:** Business Performance - Executive Dashboard

#### Top Row: Financial Health Scorecards
1. **Total Retail Costs (What We Pay)** 
   - Metric: Sum of Total Due
   - Period: YTD
   - Comparison: vs. Previous Year

2. **Total Wholesale Value (What We Should Charge)**
   - Metric: Sum of Total Wholesale
   - Period: YTD
   - Comparison: vs. Previous Year

3. **Total Profit/Margin**
   - Metric: Sum of Total Profit/Margin
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

6. **Average Invoice Value (Retail)**
   - Metric: AVG of Total Due
   - Period: YTD

7. **Average Profit per Invoice**
   - Metric: AVG of Total Profit/Margin
   - Comparison: vs. Previous Period

8. **Active Vendors**
   - Metric: COUNT_DISTINCT of Vendor
   - Period: Current Month

#### Third Row: Profit & Cost Trends
9. **Monthly Profit Trend (Dual-Axis Line Chart)**
   - Dimension: Invoice Date (Month)
   - Left Y-Axis: Sum of Total Profit/Margin (Line)
   - Right Y-Axis: Profit Margin % (Line)
   - Date Range: Last 12 months
   - Add trend lines
   - **Key Question:** Is margin shrinking?

10. **Retail vs Wholesale Comparison (Stacked Area Chart)**
    - Dimension: Invoice Date (Month)
    - Metrics:
      - Retail Costs (Bottom)
      - Profit (Stacked on top)
    - Shows gap between what we pay and what we should charge

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
    - Metric: Sum of Total Profit/Margin
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
     - Retail Cost
     - Wholesale Value
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
1. **Vendors with Price Increases**
   - Count of vendors with avg cost increase > 5% vs. last period

2. **Highest Price Increase**
   - Vendor with largest % increase
   - Show % change

3. **Total Cost Impact**
   - Dollar amount of all price increases

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
   - Metric: % Change in Avg Invoice Cost
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
     - 3-Month Trend (↑↓→)
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

8. **Vendor Cost Volatility Analysis (Scatter Plot)**
   - X-Axis: Average Invoice Cost
   - Y-Axis: Standard Deviation of Invoice Cost
   - Bubble Size: Number of Invoices
   - Color: Vendor
   - **Shows which vendors have inconsistent pricing**

9. **Price Increase Timeline (Gantt-style)**
   - Shows when each vendor had significant price changes
   - Helps identify market-wide price trends

10. **Vendor Price Detail Table (Drill-Down Ready)**
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
     - Total Retail Cost
     - Total Wholesale Value
     - Total Profit
     - Profit Margin %
   - **Botanicals:**
     - Total Retail Cost
     - Total Wholesale Value
     - Total Profit
     - Profit Margin %
   - (Repeat for Supplies, Greens, Misc, Credits)

2. **Category Comparison Table**
   - Rows: Cost Category
   - Columns:
     - Retail Cost (What We Pay)
     - Wholesale Value (What We Should Charge)
     - Profit
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
   - X-Axis: Retail Cost (Volume)
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
   - Left Y-Axis: Retail Cost (6 lines for each category)
   - Right Y-Axis: Profit Margin % (6 lines for each category)
   - **Shows volume and profitability trends**

6. **Category by Vendor Matrix (Pivot Table)**
   - Rows: Vendor
   - Columns: Cost Categories
   - Values: Sum of Retail Cost
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
  - Flower Cost (Retail)
  - Botanicals Cost (Retail)
  - Supplies Cost (Retail)
  - Greens Cost (Retail)
  - Misc Cost (Retail)
  - Credits
  - **Total Retail**
  - **Total Wholesale**
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
- Retail vs. Wholesale comparison (bar chart)
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
   - Count of vendors with avg cost increase > 10%
   - Color: Yellow if > 0

3. **Low Activity Alert**
   - Shows if current month invoices < 50% of average
   - Color: Yellow if triggered

4. **Outlier Invoice Count**
   - Invoices with Z-score > 2 (unusually high/low costs)

#### Anomaly Visualizations

5. **Cost Anomaly Detection (Z-Score Analysis)**
   - Create calculated field: `(Total Due - AVG(Total Due)) / STDDEV(Total Due)`
   - Table showing invoices where abs(Z-Score) > 2
   - Columns:
     - Invoice Number
     - Vendor
     - Total Due
     - Z-Score
     - Expected Range
   - **Automatically flags unusual invoices**

6. **Margin Degradation Tracking (Time Series with Alerts)**
   - Dimension: Invoice Date (Week)
   - Metric: Profit Margin %
   - Reference Line: 30% (warning threshold)
   - Reference Line: 20% (critical threshold)
   - Alert annotations when margin crosses thresholds

7. **Vendor Price Spike Detection**
   - Shows vendors where current avg cost > 2 standard deviations above historical avg
   - Table with vendor, amount, % increase, investigation notes

8. **Daily Spend Anomalies (Heatmap)**
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
Retail Costs: #3b82f6 (Blue)
Wholesale Revenue: #10b981 (Green)
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
1. Use **2-3 column grid** for desktop
2. **Mobile responsive:** Stack components vertically
3. **White space:** Minimum 16px padding between elements
4. **Filter controls:** Always at top, sticky if possible
5. **Alert scorecards:** Prominent placement (top of page)
6. **Logo placement:** Top left corner

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
- [ ] Add Markups sheet to your Google Sheet
- [ ] Enter current markup multipliers
- [ ] Connect Invoices sheet to Looker Studio
- [ ] Connect Markups sheet to Looker Studio
- [ ] Create blended data source (Invoices + Markups)
- [ ] Create all calculated fields (profit, margin, wholesale)
- [ ] Test calculations with sample invoices
- [ ] Build Executive Performance Dashboard
- [ ] Build Margin Analysis Dashboard
- [ ] **Validate:** Ensure profit calculations are accurate

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
- [ ] Update markup multipliers in Markups sheet (triggers automatic recalculation)
- [ ] Add historical markup tracking (if needed)
- [ ] Optimize slow-loading charts
- [ ] Add new metrics based on business needs
- [ ] Archive unused reports

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
1. **Validate markups** - Ensure markups in Markups sheet are correct (>1.0 for profit)
2. **Filter active invoices** - Exclude ARCHIVED status if needed
3. **Handle nulls** - Use IFNULL() and COALESCE() in calculated fields
4. **Verify calculations** - Spot-check profit calculations against manual calculations
5. **Document assumptions** - Add "About" page explaining how profit is calculated

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
- ✅ "Our overall margin is 35%, but Flowers category is only 28%. We need to increase Flowers markup from 2.0x to 2.3x."
- ✅ "Margin dropped from 38% to 32% in the last 2 months. Investigation shows Vendor ABC raised prices by 15%."
- ✅ "We're charging enough on Supplies (45% margin) but not enough on Greens (22% margin)."

### Vendor Intelligence
- ✅ "Vendor XYZ increased prices 12% in March. Time to negotiate or find alternatives."
- ✅ "We're spending 40% of our budget with one vendor - too much concentration risk."
- ✅ "Vendor ABC has the most volatile pricing (high std. deviation) - unreliable for planning."

### Seasonality Insights
- ✅ "May and December are consistently our busiest months (wedding + holiday season)."
- ✅ "January is always slow - consider promotional pricing to drive volume."
- ✅ "Last year we had an outlier spike in June due to a corporate event - that's not repeating this year."

### Category Performance
- ✅ "Flowers represent 60% of our costs but only 50% of our profit - we're over-reliant on this low-margin category."
- ✅ "Botanicals have the highest margin (48%) - we should promote these products more."
- ✅ "Miscellaneous costs are growing as % of total - need to understand what's driving this."

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
