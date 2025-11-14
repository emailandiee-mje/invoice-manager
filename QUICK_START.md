# ⚡ Quick Reference Guide

## 🎯 I just want to preview the UI

**In VS Code:**
1. Right-click `preview.html` → "Open with Live Server" 
2. Or: `python -m http.server 8000` → visit `localhost:8000/preview.html`

**What you'll see:**
- Full, interactive UI with dark mode
- Form validation examples
- Real-time calculations
- Mock search results

**Note:** Search and save functions won't work (no Google integration in preview mode)

---

## 🚀 I want to deploy and use it with real data

**Time needed:** 15-20 minutes

### Step 1: Create Google Sheet (2 min)
```
1. sheets.google.com
2. Create blank spreadsheet
3. Name it: "Bonnie's Invoice Management"
4. Rename sheet to: "Invoices"
5. Leave open
```

### Step 2: Set Up Google Apps Script (3 min)
```
1. Extensions → Apps Script
2. Select all code in default Code.gs and delete
3. Copy all contents from Code.gs (from project folder)
4. Paste into the Apps Script editor
5. Save (Ctrl+S or Cmd+S)
```

### Step 3: Deploy (5 min)
```
1. Deploy → New deployment
2. Type: Web app
3. Execute as: Your Account
4. Access: Anyone
5. Click Deploy
6. Copy the URL shown
```

### Step 4: Test (3 min)
```
1. Open the deployment URL
2. Submit a test invoice
3. Check Google Sheets - data should appear
4. Search by invoice number to test
5. Edit an invoice to verify updates work
```

### Step 5: Share (1 min)
```
Send deployment URL to team members
They can start using immediately!
```

---

## 📋 File Guide

| File | Purpose | Edit? |
|------|---------|-------|
| `Code.gs` | Server logic & HTTP | Advanced users only |
| `HTML.gs` | UI + Styling + JavaScript | Change colors here |
| `FormValidation.gs` | Validation rules | Customize validations |
| `SheetOperations.gs` | Sheets integration | Advanced customization |
| `preview.html` | Standalone preview | Don't edit |
| `PROJECT_PLAN.md` | Technical details | Reference |
| `DEPLOYMENT.md` | Detailed guide | Follow step-by-step |
| `README.md` | Full documentation | Reference |

---

## 🎨 Quick Customizations

### Change Primary Color
**In HTML.gs**, find this section (line ~70):
```css
:root {
    --primary: #ec4899;      /* Change this (currently pink) */
    --secondary: #8b5cf6;    /* Purple */
    --accent: #06b6d4;       /* Cyan */
    --success: #10b981;      /* Green */
    --error: #ef4444;        /* Red */
}
```

Replace `#ec4899` with your color hex code. Examples:
- `#3b82f6` = Blue
- #f97316` = Orange
- `#d946ef` = Purple

### Add Your Company Name
**In HTML.gs**, find line ~350:
```html
<h1 class="gradient-text text-5xl font-bold mb-4">
    <i class="fas fa-receipt"></i> Invoice Manager
</h1>
```

Change "Invoice Manager" to your company name.

### Adjust Form Fields
**For custom validation:**

In `Code.gs`, find the `validateAllFields()` function. For example:
```javascript
function validateInvoiceNumber(invoiceNumber) {
  // Edit validation rules here
  if (invoiceNumber.length > 50) {  // Change 50 to your limit
    return 'Invoice number must be 50 characters or less';
  }
}
```

---

## 🔍 Troubleshooting Quick Fixes

### "I don't see my submitted data"
1. Open Google Sheets in a new tab
2. Check if "Invoices" sheet exists
3. Verify data is there
4. Refresh the app page

### "Search doesn't work"
- Check invoice number spelling (case-sensitive)
- Try date range search instead
- Verify at least 1 invoice exists in Sheets

### "Form won't submit"
1. Check all required fields (marked with *)
2. Verify invoice date isn't in future
3. Check browser console for errors (F12)

### "Dark mode doesn't stay on"
- You're in incognito/private mode
- Use regular browsing mode to save preference

### "App looks broken on mobile"
- Clear browser cache and reload
- Try a different browser
- Check for JavaScript errors (F12 → Console)

---

## 📞 Getting Help

1. **Read:** [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete step-by-step guide
2. **Reference:** [PROJECT_PLAN.md](./PROJECT_PLAN.md) - Technical specifications
3. **Preview:** Open `preview.html` to see UI without setup
4. **Check:** Apps Script Executions tab for error messages

---

## ✅ Success Checklist

After deployment:
- [ ] Google Sheet created with "Invoices" sheet
- [ ] All 4 .gs files in Apps Script editor
- [ ] App deployed as Web App
- [ ] Can submit a test invoice
- [ ] Data appears in Google Sheets
- [ ] Can search by invoice number
- [ ] Can edit an invoice
- [ ] Dark mode toggles
- [ ] Mobile layout works
- [ ] URL shared with team

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
- Send via email or slack
- Team members click link and start using
- All share same Google Sheets

---

## 📊 Creating a Dashboard

Once you have data:
1. Go to [lookerstudio.google.com](https://lookerstudio.google.com)
2. Create new report
3. Add data source → Google Sheets
4. Select "Bonnie's Invoice Management" → "Invoices" sheet
5. Create charts:
   - Table of invoices
   - Total revenue trend
   - Breakdown by cost type
   - Monthly summary

---

## 🔐 Security Notes

✅ **What's secure:**
- Google Account authentication
- HTTPS encryption
- Data encrypted at rest
- Audit trail (who created/edited)

⚠️ **Keep in mind:**
- Anyone with the URL can access
- No password protection beyond Google login
- Treat deployment URL like a password
- Monitor who has access

---

## 💡 Pro Tips

1. **Backup data regularly** - Download as CSV from Sheets
2. **Use Looker Studio** - Create professional reports
3. **Archive old invoices** - Mark status as ARCHIVED in Sheets
4. **Set timezone** - Sheets → Settings → set your timezone
5. **Test with sample data** - Try the preview first
6. **Mobile users** - Works great on phones with responsive layout
7. **Multiple sheets** - Create additional sheets for analysis (won't affect app)

---

## 📈 Scale Considerations

**Free tier limits:**
- Google Sheets: Up to 10M cells per sheet
- Apps Script: 1M requests/day, 6m execution time/day
- Should handle 10,000+ invoices easily

If you outgrow free tier, just upgrade Google account.

---

## 🎓 Learning Path

**Beginner:**
1. Preview the UI (`preview.html`)
2. Follow DEPLOYMENT.md step-by-step
3. Submit test invoices
4. Share with team

**Intermediate:**
1. Read PROJECT_PLAN.md
2. Customize colors in HTML.gs
3. Change company name
4. Create Looker Studio dashboard

**Advanced:**
1. Review Code.gs logic
2. Modify validation rules
3. Add custom columns to Sheets
4. Create custom calculations

---

**Need help?** → Check [DEPLOYMENT.md](./DEPLOYMENT.md)  
**Want details?** → See [PROJECT_PLAN.md](./PROJECT_PLAN.md)  
**Just exploring?** → Open `preview.html`

---

**Happy invoicing!** 🎉
