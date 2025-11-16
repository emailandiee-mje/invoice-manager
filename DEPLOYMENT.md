# Bonnie's Invoice Manager - Deployment Guide

Complete guide for deploying and using the Invoice Management System.

---

## ⚡ Quick Start (15 Minutes)

**Total time:** 15-20 minutes from start to fully deployed app

### Step 1: Create Google Sheet (2 min)
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create blank spreadsheet
3. Name it: **"Bonnie's Invoice Management"**
4. Rename sheet to: **"Invoices"**
5. Leave open

### Step 2: Set Up Google Apps Script (3 min)
1. **Extensions** → **Apps Script**
2. Select all code in default Code.gs and delete
3. Copy all contents from **`Code.gs`** (from project folder)
4. Paste into the Apps Script editor
5. Save (Ctrl+S or Cmd+S)

### Step 3: Deploy (5 min)
1. **Deploy** → **New deployment**
2. Type: **Web app**
3. Execute as: **Your Account**
4. Access: **Anyone**
5. Click **Deploy**
6. Copy the URL shown

### Step 4: Test (3 min)
1. Open the deployment URL
2. Submit a test invoice
3. Check Google Sheets - data should appear
4. Search by invoice number to test
5. Edit an invoice to verify updates work

### Step 5: Share (1 min)
Send deployment URL to team members - they can start using immediately!

---

## 📁 Project Files

### Application Files
- **`Code.gs`** - Complete application with all backend logic and embedded HTML/CSS/JavaScript UI
- **`preview.html`** - Standalone preview file for testing the UI locally in VS Code

### Documentation
- **`README.md`** - Comprehensive overview and feature list
- **`DEPLOYMENT.md`** - This file - deployment instructions and customization
- **`PROJECT_PLAN.md`** - Technical specifications and architecture
- **`TEST_PLAN.md`** - Testing procedures and validation
- **`DEFECTS.md`** - Bug tracking and resolutions
- **`ENHANCEMENT_IDEAS.md`** - Future feature ideas and roadmap

---

## 🚀 Option 1: Preview UI Locally (No Deployment)

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

### Step 3: Copy the Code

1. The default `Code.gs` file should already be present in the Apps Script editor
2. Select all the default code and delete it
3. Open `Code.gs` from this project folder
4. Copy **all contents** from `Code.gs`
5. Paste into the Apps Script editor
6. Click the **Save** icon (💾) or press `Ctrl+S` (Windows) / `Cmd+S` (Mac)

> **Note:** The application uses a single `Code.gs` file that contains all backend logic and embedded HTML/CSS/JavaScript. No additional files are needed.

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
- **Vendor:** Dropdown with autocomplete (add new vendors on the fly)
- **Invoice Number:** Unique identifier (auto-validated for duplicates)
- **Invoice Date:** Date picker (prevents future dates)
- **Cost Fields:** Flower, Supplies, Greens, Miscellaneous, Credits
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

## 🎨 Customization Guide

### Change Primary Color

In `Code.gs`, find the CSS section (around line 70):
```css
:root {
    --primary: #ec4899;      /* Change this (currently pink) */
    --secondary: #8b5cf6;    /* Purple */
    --accent: #06b6d4;       /* Cyan */
    --success: #10b981;      /* Green */
    --error: #ef4444;        /* Red */
}
```

**Popular color options:**
- `#3b82f6` = Blue
- `#f97316` = Orange
- `#d946ef` = Purple
- `#10b981` = Green

### Customize Company Name

In `Code.gs`, find line ~350:
```html
<h1 class="gradient-text text-5xl font-bold mb-4">
    <i class="fas fa-receipt"></i> Bonnie's Invoice Manager
</h1>
```

Change "Bonnie's Invoice Manager" to your company name.

### Adjust Validation Rules

In `Code.gs`, find the `validateAllFields()` function:
```javascript
if (data.invoiceNumber.length > 50) {
    errors.push('Invoice number must be 50 characters or less');
    isValid = false;
}
```

Change `50` to your desired maximum length.

---

## 🛠️ Troubleshooting

### "Permission Denied" Error
**Solution:** User must be logged into a Google Account. Have them log out completely and log back in.

### Form submission fails silently
**Solution:** 
1. Go to Apps Script editor
2. Click **Executions** (left sidebar)
3. Look for errors in the execution log
4. Check that Code.gs is copied correctly

### "I don't see my submitted data"
**Solution:**
1. Open Google Sheets in a new tab
2. Check if "Invoices" sheet exists
3. Verify data is there
4. Refresh the app page

### Sheets not updating
**Solution:**
1. Verify the sheet is named exactly "Invoices"
2. Check Apps Script has permission to access the Sheet
3. Try a test submission and check Apps Script logs

### "Search doesn't work"
**Solution:**
- Check invoice number spelling (case-sensitive)
- Try date range search instead
- Verify at least 1 invoice exists in Sheets

### Dark mode not saving
**Solution:** Browser might be in private mode. Test in regular browsing mode.

### "App looks broken on mobile"
**Solution:**
- Clear browser cache and reload
- Try a different browser
- Check for JavaScript errors (F12 → Console)

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
2. Edit Code.gs
3. Click **Save**
4. Click **Deploy** → **Manage Deployments**
5. Click the pencil icon (edit) on existing deployment
6. Click **Deploy**
7. The URL remains the same - no need to share a new one

---

## 🎯 Common Tasks

### Submit an Invoice
1. Open app URL
2. Tab: "New Invoice"
3. Enter Invoice Number (e.g., INV-2025-001)
4. Select Invoice Date
5. Enter costs
6. Click "Submit Invoice"

✅ **Done!** Check Sheets to verify

### Find an Invoice
1. Tab: "Search & Edit"
2. Enter partial invoice number
3. Click "Search"
4. Click "Edit" to modify

### Edit an Invoice
1. Search for the invoice
2. Click "Edit" button
3. Modify costs or date
4. Click "Update Invoice"

✅ **Done!** Data updated in Sheets

### Toggle Dark Mode
- Click moon/sun icon (top right)
- Preference saves automatically

### Share with Team
- Copy deployment URL from Google Apps Script
- Send via email or Slack
- Team members click link and start using
- All share same Google Sheets

---

## 📱 Mobile Support

The app is fully responsive and works on:
- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablets (iPad, Android tablets)
- ✅ Mobile phones (responsive layout adapts)

---

## 💡 Pro Tips

1. **Backup data regularly** - Download as CSV from Sheets
2. **Use Looker Studio** - Create professional reports
3. **Set timezone** - Sheets → Settings → set your timezone
4. **Test with sample data** - Try the preview first
5. **Mobile users** - Works great on phones with responsive layout

---

## 📞 Support

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review the **PROJECT_PLAN.md** for technical details
3. Check Apps Script Executions log for error messages
4. Test with `preview.html` to isolate UI vs. backend issues

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
