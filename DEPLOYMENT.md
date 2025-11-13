# Bonnie's Invoice Manager - Implementation Guide

## Quick Start Guide

This folder contains a fully-functional, modern invoice management application built with Google Apps Script. The app is ready to be deployed to Google's free infrastructure.

---

## 📁 Files in This Project

### Frontend
- **`HTML.gs`** - Modern responsive UI with Tailwind CSS, dark mode, and smooth animations
- **`preview.html`** - Standalone preview file for testing the UI locally in VS Code

### Backend (Apps Script)
- **`Code.gs`** - Main server logic and HTTP handlers
- **`FormValidation.gs`** - Input validation and calculation engine
- **`SheetOperations.gs`** - Google Sheets API integration and data persistence

### Documentation
- **`PROJECT_PLAN.md`** - Detailed technical specifications and architecture
- **`DEPLOYMENT.md`** - Step-by-step deployment instructions
- **`README.md`** - This file

---

## 🚀 Option 1: Preview in VS Code (Local Testing)

To preview the UI/UX without deploying to Google:

1. **Open the preview file:**
   - Open `preview.html` in VS Code
   - Right-click → "Open with Live Server" (requires Live Server extension)
   - Or use: `python -m http.server 8000` in terminal and navigate to `localhost:8000/preview.html`

2. **Interact with the app:**
   - Test form validation
   - Try real-time calculations
   - Switch between tabs
   - Toggle dark mode
   - Test search functionality (uses mock data)

3. **What you can't do in preview:**
   - Save data (no Google Sheets integration)
   - Search real data
   - Edit invoices (mock data only)

---

## 🔗 Option 2: Full Deployment to Google Apps Script

Follow these steps to deploy the app to your Google Account:

### Step 1: Prepare Google Sheets

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it: **"Bonnie's Invoice Management"**
4. Rename the first sheet to **"Invoices"** (right-click sheet tab → rename)
5. Keep it open - you'll need the URL next

### Step 2: Create Google Apps Script Project

1. With your Sheets open, go to **Extensions** → **Apps Script**
2. You'll be taken to the Apps Script editor in a new tab
3. Delete the default `Code.gs` file (right-click → delete)

### Step 3: Copy the Code Files

Copy the contents of each file below into the Apps Script editor:

#### File 1: Create `Code.gs`
1. Click **+ (New file)** → select **Script**
2. Name it: **Code.gs**
3. Copy all contents from `Code.gs` (from this project folder)
4. Paste into the editor

#### File 2: Create `HTML.gs`
1. Click **+ (New file)** → select **Script**
2. Name it: **HTML.gs**
3. Copy all contents from `HTML.gs` (from this project folder)
4. Paste into the editor

#### File 3: Create `FormValidation.gs`
1. Click **+ (New file)** → select **Script**
2. Name it: **FormValidation.gs**
3. Copy all contents from `FormValidation.gs` (from this project folder)
4. Paste into the editor

#### File 4: Create `SheetOperations.gs`
1. Click **+ (New file)** → select **Script**
2. Name it: **SheetOperations.gs**
3. Copy all contents from `SheetOperations.gs` (from this project folder)
4. Paste into the editor

### Step 4: Deploy as Web App

1. In the Apps Script editor, click **Deploy** (top right button)
2. Click **New deployment**
3. Select the gear icon → choose **Web app**
4. Configure as follows:
   - **Execute as:** Select your Google Account
   - **Who has access:** "Anyone"
5. Click **Deploy**
6. You'll see a dialog with a URL - **COPY THIS URL** (you'll share this with users)
7. Click **Done**

### Step 5: Test the App

1. Open the deployment URL in a new tab
2. You should see the Invoice Manager interface
3. Try creating an invoice:
   - Enter Invoice Number: `INV-2025-001`
   - Select Invoice Date: Today
   - Enter costs (e.g., Flower: 100, Supplies: 50, Greens: 25, Credits: 10)
   - Verify total calculates as $165 (100+50+25-10)
   - Click **Submit Invoice**
4. Success! The invoice is now saved to Google Sheets

### Step 6: Verify Data in Google Sheets

1. Go back to your Google Sheets (the "Bonnie's Invoice Management" sheet)
2. You should see your invoice in the "Invoices" sheet with all columns populated
3. Data should be formatted with proper dates and currency

### Step 7: Share with Users

1. Copy the deployment URL from Step 4
2. Share it via email or in a chat/collaboration tool
3. Users just need to open the URL and log into their Google Account
4. They can all submit to and search the same Sheets file

---

## 🌟 Features Overview

### Tab 1: New Invoice
- **Invoice Number:** Unique identifier (auto-validated for duplicates)
- **Invoice Date:** Date picker (prevents future dates)
- **Cost Fields:** Flower, Supplies, Greens, Credits
- **Real-time Calculation:** Total updates as you type
- **Form Validation:** Clear error messages on submit
- **Success Feedback:** Toast notifications

### Tab 2: Search & Edit
- **Search by Invoice Number:** Partial match (case-insensitive)
- **Search by Date Range:** Find invoices between two dates
- **Search Results:** Table with sortable data
- **Edit Invoices:** Click "Edit" to modify costs and dates
- **Update Validation:** Same validation on updates

### Dark Mode
- Click the moon/sun icon (top right) to toggle
- Preference saved in browser storage

---

## 🔒 Security & Permissions

- **Authentication:** Relies on Google Account login (built-in)
- **Access Control:** "Anyone" means users with the link can access
- **Data Storage:** All data encrypted in Google Sheets (Google-managed)
- **No External Servers:** Everything stays within Google's infrastructure
- **User Tracking:** Each submission records the user's email automatically

---

## 📊 Next Steps: Looker Studio Integration

To create a dashboard for reporting:

1. Go to [Looker Studio](https://lookerstudio.google.com)
2. Create **New Report**
3. Click **Create New Data Source**
4. Select **Google Sheets**
5. Choose your "Bonnie's Invoice Management" spreadsheet
6. Select the "Invoices" sheet
7. Connect
8. Create visualizations:
   - **Table:** All invoice data
   - **Bar Chart:** Total by month
   - **Scorecard:** Total revenue
   - **Pie Chart:** Invoice count by status

---

## 🛠️ Troubleshooting

### "Permission Denied" Error
**Solution:** User must be logged into a Google Account. Have them log out completely and log back in.

### Form submission fails silently
**Solution:** 
1. Go to Apps Script editor
2. Click **Executions** (left sidebar)
3. Look for errors in the execution log
4. Check that all 4 .gs files are copied correctly

### Sheets not updating
**Solution:**
1. Verify the sheet is named exactly "Invoices"
2. Check Apps Script has permission to access the Sheet
3. Try a test submission and check Apps Script logs

### Dark mode not saving
**Solution:** Browser might be in private mode. Test in regular browsing mode.

### Search returns no results
**Solution:** 
1. Verify data exists in the "Invoices" sheet
2. Invoice numbers are case-sensitive for exact matches
3. Try date range search instead

---

## 📝 Example Data for Testing

Try submitting these invoices to test the system:

```
Invoice #: INV-2025-001
Date: 2025-11-01
Flower: $150.00
Supplies: $45.50
Greens: $32.00
Credits: $10.00
Expected Total: $217.50
```

```
Invoice #: INV-2025-002
Date: 2025-11-05
Flower: $200.00
Supplies: $50.00
Greens: $40.00
Credits: $0.00
Expected Total: $290.00
```

---

## 🔄 Updating the App

If you need to modify the code:

1. Go to Apps Script editor
2. Edit the relevant .gs file
3. Click **Save**
4. Click **Deploy** → **Manage Deployments**
5. Click the existing deployment (trash icon)
6. Create new deployment following Step 4 above
7. Share the new URL

---

## 📱 Mobile Support

The app is fully responsive and works on:
- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablets (iPad, Android tablets)
- ✅ Mobile phones (responsive layout adapts)

---

## 💡 Advanced Customization

All code is well-commented and modular:

- **Styling:** Edit CSS in `HTML.gs` (lines with `<style>`)
- **Validation Rules:** Edit `FormValidation.gs`
- **Colors:** Change `--primary`, `--secondary`, `--accent` in CSS variables
- **Columns:** Edit `COLUMN_HEADERS` in `SheetOperations.gs`

---

## 📞 Support

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review the **PROJECT_PLAN.md** for technical details
3. Check Apps Script Executions log for error messages
4. Ensure all 4 code files are present in Apps Script

---

## 📋 Checklist for Full Deployment

- [ ] Google Sheet created and named "Bonnie's Invoice Management"
- [ ] Sheet has an "Invoices" tab
- [ ] All 4 .gs files copied to Apps Script editor
- [ ] App deployed as Web App
- [ ] Deployment URL copied
- [ ] Test invoice submitted successfully
- [ ] Data verified in Google Sheets
- [ ] Dark mode toggle tested
- [ ] Search functionality tested
- [ ] URL shared with team members

---

## 🎉 You're Ready!

Your invoice management system is now live. Users can:
- ✅ Submit invoices with automatic validation
- ✅ Search prior invoices by number or date
- ✅ Edit and update existing invoices
- ✅ View real-time calculations
- ✅ Access from any device with Google Account

All data is securely stored in Google Sheets and ready for business intelligence dashboards via Looker Studio.

---

**Version:** 1.0  
**Last Updated:** November 11, 2025  
**Status:** Production Ready ✅
