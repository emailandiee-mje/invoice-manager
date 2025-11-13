# Search Function Debug Guide

## Problem
Test 3.1 is failing: Search function returns no results even though invoices were created in Section 2.

## Root Cause Analysis

The issue is likely one of two things:

### 1. **Deployment Caching (MOST LIKELY)**
- After making code changes in the Apps Script editor, you must **REDEPLOY** the web app
- The deployed version you're accessing via URL is a frozen snapshot from when you last deployed
- Recent code changes (search function improvements) won't be reflected until you redeploy

### 2. **Empty Invoices Sheet**  
- The Invoices sheet might be empty or in a different Google Sheet than where you're testing
- Test data created in Section 2 might not have been persisted

## How to Fix

### Option A: Redeploy the Web App (RECOMMENDED)

1. Go to **Apps Script Editor** tab
2. Click **Deploy** button (top right)
3. Click **Manage deployments** (gear icon)
4. Click **Edit** next to your deployment
5. Click **Deploy** (bottom right)
6. Click **Done**
7. Go back to your deployment URL and **refresh the page (Ctrl+F5 for hard refresh)**
8. Try searching again

### Option B: Diagnose the Problem

If redeployment doesn't work, run diagnostic functions:

1. In the Apps Script Editor, click **Editor** (left sidebar)
2. Click on `Code.gs`
3. Scroll to the bottom and find the `getDiagnostics()` function
4. Click anywhere in that function
5. Click **Run** button (top toolbar)
6. Check the **Execution log** (bottom panel)
7. Look for output showing:
   - Spreadsheet name
   - Sheet names
   - Row counts
   - Sample data from Invoices sheet

**Example output should show:**
```
Invoices sheet found with 5 rows (1 header + 4 invoices)
Header: [ID, Invoice Number, Invoice Date, Vendor, ...]
First invoice: [uuid, TEST-001, 2025-01-15, ...]
```

If the output shows 0 rows or data is missing, the invoices weren't actually saved to this sheet.

### Option C: Manually Test Search Function

1. In Apps Script Editor, find the `testSearchDirect()` function at the bottom
2. Click anywhere in that function
3. Click **Run** button
4. Check the **Execution log** for detailed logs showing:
   - Whether Invoices sheet exists
   - Total rows in sheet
   - Search results found

## Expected Behavior After Fix

After fixing, searching should:
1. Find invoices by partial invoice number match (e.g., "INV" finds all starting with INV)
2. Be case-insensitive (e.g., "test" finds "TEST-001")
3. Return empty results for non-matching searches
4. Return results immediately with no timeout

## Code Changes Made

The following improvements were added to ensure search works:

### Enhanced `searchInvoices()` function:
- Added logging at the very start to verify function is being called
- Added logging for search parameters
- Added logging for results count
- Improved error handling

### Enhanced `searchByInvoiceNumber()` function:
- Added detailed logging for each row checked
- Added logging when matches are found
- Better error messages
- Verified correct sheet and column indices

### New diagnostic functions:
- `getDiagnostics()` - Returns spreadsheet and sheet information
- `testSearchDirect()` - Tests search directly with logging

## Next Steps

1. **Redeploy** the web app (Option A above)
2. **Hard refresh** your deployment URL (Ctrl+F5 or Cmd+Shift+R)
3. **Test search** by looking for an invoice created in Section 2
4. **Check logs** if it still doesn't work (Option B above)

## Questions?

If search still doesn't work after these steps:
1. Verify invoices were actually created (check Google Sheets directly)
2. Ensure you're testing with the same Google Sheet where Section 2 created invoices
3. Check that the sheet names are exactly "Invoices" and "Vendors" (case-sensitive)
