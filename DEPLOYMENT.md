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

### Step 2: Set Up Google Apps Script (5 min)
1. **Extensions** → **Apps Script**
2. You'll see a default `Code.gs` file - keep it
3. Copy **4 files** from the project folder:
   - **Code.gs** - Replace default code with project Code.gs
   - **index.html** - Add new file (File → New → HTML file, name: index)
   - **script.html** - Add new file (File → New → HTML file, name: script)
   - **styles.html** - Add new file (File → New → HTML file, name: styles)
4. Save all files (Ctrl+S or Cmd+S for each)

### Step 3: Deploy (5 min)
1. **Deploy** → **New deployment**
2. Type: **Web app**
3. Execute as: **Me (your-email@gmail.com)**
4. Who has access: **Anyone**
5. Click **Deploy**
6. **Important:** If prompted to authorize, click "Authorize access" and follow the prompts
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

### Application Files (Required for Deployment)
- **`Code.gs`** - Server-side logic and functions (1,030 lines)
- **`index.html`** - HTML structure and UI layout
- **`script.html`** - Client-side JavaScript functionality
- **`styles.html`** - CSS styling and themes
- **`preview.html`** - Standalone preview file for local testing (not deployed)

### Documentation
- **`README.md`** - Comprehensive overview and feature list
- **`DEPLOYMENT.md`** - This file - deployment instructions and customization
- **`PROJECT_PLAN.md`** - Technical specifications and architecture
- **`TEST_PLAN.md`** - Testing procedures and validation (190+ tests)
- **`DEFECTS.md`** - Bug tracking and resolutions
- **`ENHANCEMENT_IDEAS.md`** - Future feature ideas and roadmap
- **`CONTRIBUTING.md`** - Contribution guidelines
- **`SECURITY.md`** - Security policy
- **`LICENSE`** - MIT License

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
3. The default `Code.gs` file will be present - keep this file

### Step 3: Add All Application Files

**Copy Code.gs:**
1. In the Apps Script editor, select all default code in `Code.gs` and delete it
2. Open `Code.gs` from this project folder
3. Copy **all contents** and paste into the Apps Script editor
4. Click **Save** (💾)

**Add index.html:**
1. Click **File** → **New** → **HTML file**
2. Name it: `index` (without .html extension)
3. Open `index.html` from the project folder
4. Copy all contents and paste into the editor
5. Click **Save**

**Add script.html:**
1. Click **File** → **New** → **HTML file**
2. Name it: `script` (without .html extension)
3. Open `script.html` from the project folder
4. Copy all contents and paste into the editor
5. Click **Save**

**Add styles.html:**
1. Click **File** → **New** → **HTML file**
2. Name it: `styles` (without .html extension)
3. Open `styles.html` from the project folder
4. Copy all contents and paste into the editor
5. Click **Save**

> **Note:** The application uses a modular architecture with separate files for server logic (Code.gs), HTML structure (index.html), JavaScript (script.html), and CSS (styles.html).

### Step 4: Deploy as Web App

1. In the Apps Script editor, click **Deploy** (top right button)
2. Click **New deployment**
3. Click the gear icon next to "Select type" → choose **Web app**
4. Configure deployment settings:
   - **Description:** "Invoice Management System v1.0" (optional)
   - **Execute as:** **Me (your-email@gmail.com)** ← This runs the app under YOUR account
   - **Who has access:** **Anyone** ← Customers can access without signing in
5. Click **Deploy**
6. **First-time authorization:**
   - Click **Authorize access**
   - Select your Google Account
   - Click **Advanced** (if you see a warning)
   - Click **Go to [Your Project Name] (unsafe)**
   - Click **Allow**
7. You'll see a dialog with a URL - **COPY THIS URL** (this is what you'll share)
8. Click **Done**

> **Important:** By setting "Execute as: Me" and "Who has access: Anyone", the app runs under your Google Account while allowing anyone with the link to use it. Your customers do NOT need to sign into Google - they just need the URL.

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

### Access Model
- **Owner:** You (your Google Account owns the Sheet and Apps Script)
- **Execution:** App runs under YOUR account ("Execute as: Me")
- **User Access:** "Anyone" with the link can use the app
- **No Google Login Required:** Customers can access without signing in
- **Data Storage:** All data saved to YOUR Google Sheet (you maintain control)

### Security Features
- **HTTPS Encryption:** All data transmitted over secure connections
- **Google-Managed Encryption:** Data encrypted at rest in Google Sheets
- **No External Servers:** Everything stays within Google's infrastructure
- **Audit Trail:** Each submission records timestamp and user information
- **Access Control:** Only people with the deployment URL can access the app

### Important Notes
- Your customers can use the app without a Google Account
- If they ARE signed into Google, their email will be recorded in the audit trail
- If they are NOT signed in, the "Created By" field will show "Anonymous"
- Only YOU can access the Google Sheet and Apps Script (unless you share it)
- You control all data - customers only interact through the app interface

---

## 🙋 Customer Access FAQ

### Q: Do my customers need a Google Account to use this app?
**A:** No! When you deploy with "Who has access: Anyone", customers can use the app without any Google login. They just need the URL.

### Q: What happens if they try to access it without being logged into Google?
**A:** The app will work perfectly. They'll see the interface and can submit invoices normally. The only difference is their submissions will show "Anonymous" instead of their email in the audit trail.

### Q: Can customers see each other's data or access my Google Sheet?
**A:** No. Customers only interact with the web interface. They cannot access:
- Your Google Sheet directly
- The Apps Script code
- Data submitted by other users
- Any Google Drive files

### Q: Who can see the data in the Google Sheet?
**A:** Only you (and anyone you explicitly share the Sheet with using Google's sharing settings). The app runs under your account, so all data is stored in YOUR Google Sheet.

### Q: Will customers see any "permission required" popups?
**A:** No. When you set "Execute as: Me" during deployment, the app runs with YOUR permissions. Customers just use the interface - no authorization needed on their end.

### Q: Can I restrict access to specific people?
**A:** The current deployment allows "Anyone" with the link. If you want to restrict access:
1. Change "Who has access" to "Anyone with Google Account"
2. Users will need to sign in with their Google Account
3. You can also set to "Only myself" for testing

### Q: What if I want to revoke access later?
**A:** You can disable the deployment at any time:
1. Go to Apps Script editor
2. Click **Deploy** → **Manage Deployments**
3. Click the archive icon to disable
4. The URL will immediately stop working

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

### Share with Customers
- Copy deployment URL from Google Apps Script
- Send via email, text, or embed in your website
- Customers click link and start using immediately
- No Google Account required to use the app
- All data saves to YOUR Google Sheet (you control access)

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

### Setup Phase
- [ ] Google Sheet created and named "Bonnie's Invoice Management"
- [ ] First sheet renamed to "Invoices"
- [ ] Apps Script project opened from Extensions menu
- [ ] All 4 files copied to Apps Script editor:
  - [ ] Code.gs (server-side logic)
  - [ ] index.html (HTML structure)
  - [ ] script.html (JavaScript)
  - [ ] styles.html (CSS)
- [ ] All files saved successfully

### Deployment Phase
- [ ] Web app deployment created
- [ ] Execute as: "Me" (your account)
- [ ] Who has access: "Anyone"
- [ ] Authorization completed (if first-time)
- [ ] Deployment URL copied

### Testing Phase
- [ ] Test invoice submitted successfully
- [ ] Data appears in Google Sheets "Invoices" tab
- [ ] Vendors sheet auto-created with default vendors
- [ ] Search by invoice number works
- [ ] Search by date range works
- [ ] Edit invoice functionality works
- [ ] Dark mode toggle works
- [ ] Mobile responsive layout tested
- [ ] Tested without Google login (incognito mode)

### Distribution Phase
- [ ] Deployment URL shared with customers
- [ ] Instructions provided (if needed)
- [ ] Test invoice created by customer successfully

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

**Version:** 1.2  
**Architecture:** Modular (Code.gs + 3 HTML files)  
**Last Updated:** November 18, 2025  
**Status:** Production Ready ✅
