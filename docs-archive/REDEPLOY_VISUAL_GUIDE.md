# Redeploy - Visual Guide

## The Problem in Plain English

**What you changed:** The code files in your Google Drive  
**What runs your app:** The deployed version on Google's servers  
**Why it's broken:** The deployed version hasn't been updated with your code changes yet

## The Fix: Redeploy

Think of it like this:
- Editing Code.gs = Writing new instructions
- Deploying = Publishing those instructions so they're actually used

You wrote the new instructions, but haven't published them yet!

## Step 1: Open Apps Script Editor

**In your Google Sheet ("Bonnie's Invoice Management"):**

```
Extensions (top menu)
    ↓
Apps Script
    ↓
(New tab opens with code editor)
```

## Step 2: Deploy New Version

**In the Apps Script editor (the code window):**

Look at the TOP RIGHT of the screen:

```
┌─────────────────────────────┐
│      [Deploy]  [Executions] │  ← Click Deploy button here
└─────────────────────────────┘
```

Click it → A dropdown menu appears

## Step 3: Manage Deployments

From the dropdown menu:

```
Manage deployments (or just click the gear ⚙️ icon)
    ↓
A panel opens showing your existing deployment
```

## Step 4: Edit & Deploy

In the deployments panel:

```
Your deployment
    ↓
[Pencil icon ✎] Click this to edit
    ↓
[Deploy] Button appears at bottom - Click it
    ↓
Confirmation dialog → Click [Deploy] again
    ↓
Success message appears
```

## Step 5: Hard Refresh

Go back to your app URL:

Press **Ctrl+F5** (Windows) or **Cmd+Shift+R** (Mac)

This clears the browser cache and loads the new code

## Step 6: Test Search

```
Search & Edit tab
    ↓
Type: TEST
    ↓
Click: Search
    ↓
Expected: Table with 2 invoices appears ✅
```

## What You'll Know Worked

Look at the Apps Script **Executions** tab - you should see these logs in order:

```
✅ About to return response: {"success":true,"count":2,"data":[...
✅ Plain results: [{"id":"...","invoiceNumber":"TEST-001"...  ← THIS IS THE NEW LOG!
```

If you see "Plain results:" - the fix is working!

## Troubleshooting

**Q: I don't see "Plain results:" in the logs**
A: The redeploy didn't work. Try the Deploy steps again.

**Q: I see "Plain results:" but table still doesn't show**
A: The backend is working. The problem is on the frontend. Open browser console (F12) and test again, then share the console logs.

**Q: I'm not sure if I did it right**
A: No worries! Just:
1. Go to your Google Sheet
2. Extensions → Apps Script
3. Look at the top right - if there's a big "Deploy" button, click it
4. Follow the steps above
5. You'll get a confirmation when it's done

---

**After redeploying + hard refresh, test 3.1 should PASS!**
