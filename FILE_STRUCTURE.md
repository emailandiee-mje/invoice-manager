# 📁 Project Structure Overview

## Current Workspace Structure

```
_BonniesApp/
│
├── 📂 .github/
│   └── agents/
│       └── Doc-Agent.agent.md - Documentation agent configuration
│
├── 📂 docs-archive/
│   ├── CODE_CHANGES_SUMMARY.md - Historical code changes
│   ├── DIAGNOSIS_GUIDE.md - Historical troubleshooting
│   ├── FINAL_FIX.md - Historical bug fix documentation
│   ├── FIX_IMPLEMENTED.md - Historical implementation notes
│   ├── INDEX.md - Archived navigation guide
│   ├── QUICK_FIX.md - Archived quick fix guide
│   ├── QUICK_TEST.md - Archived testing guide
│   ├── REDEPLOY_REQUIRED.md - Archived deployment reminder
│   ├── REDEPLOY_VISUAL_GUIDE.md - Archived visual deployment guide
│   ├── SEARCH_DEBUG_GUIDE.md - Archived debugging documentation
│   ├── SEARCH_STATUS_UPDATE.md - Archived status update
│   ├── SUMMARY.md - Archived project summary
│   ├── TECHNICAL_ANALYSIS.md - Archived technical analysis
│   └── VISUAL_GUIDE.md - Archived visual guide
│
├── 📄 Code.gs (Main Server Logic - Complete Application)
│   ├── doGet() - Serves HTML interface
│   ├── submitInvoice() - Form submission handler
│   ├── searchInvoices() - Search processor
│   ├── updateInvoice() - Invoice update handler
│   ├── getInvoiceById() - Single invoice retrieval
│   ├── validateAllFields() - Form validation
│   ├── calculateTotal() - Total calculation
│   ├── appendInvoice() - Add new invoice
│   ├── updateInvoiceRow() - Update existing invoice
│   ├── searchByInvoiceNumberV2() - Search by number
│   ├── searchByDateRangeV2() - Search by date range
│   ├── getInvoiceDataById() - Get single record
│   ├── getAllActiveInvoices() - Get all records
│   ├── getVendors() - Retrieve all vendors
│   ├── addNewVendor() - Add new vendor
│   ├── getAllVendors() - Get vendor list
│   ├── appendVendor() - Add vendor to sheet
│   └── sanitizeInput() - Input sanitization
│
├── 📄 HTML.gs (Frontend UI)
│   ├── <head> - Meta, Tailwind CDN, custom CSS
│   │   └── Comprehensive CSS styling (glass-effect, gradients, animations)
│   ├── <body>
│   │   ├── Theme toggle button
│   │   ├── Loading overlay
│   │   ├── Main container
│   │   │   ├── Header (Logo, title)
│   │   │   ├── Tabs (New Invoice, Search & Edit)
│   │   │   │   ├── Tab 1: New Invoice Form
│   │   │   │   │   ├── Invoice Number input
│   │   │   │   │   ├── Invoice Date picker
│   │   │   │   │   ├── Cost Breakdown section
│   │   │   │   │   │   ├── Flower Cost
│   │   │   │   │   │   ├── Supplies Cost
│   │   │   │   │   │   ├── Greens Cost
│   │   │   │   │   │   └── Invoice Credits
│   │   │   │   │   ├── Total Due (calculated, read-only)
│   │   │   │   │   └── Buttons (Submit, Clear)
│   │   │   │   │
│   │   │   │   └── Tab 2: Search & Edit
│   │   │   │       ├── Search Options
│   │   │   │       │   ├── Search by Invoice Number
│   │   │   │       │   └── Search by Date Range
│   │   │   │       ├── Search Results Table
│   │   │   │       └── Edit Form (hidden until edit clicked)
│   │   │   │           ├── Read-only Invoice Number
│   │   │   │           ├── Editable Date & Costs
│   │   │   │           ├── Updated Total Display
│   │   │   │           └── Buttons (Update, Cancel)
│   │   │   │
│   │   │   └── Footer
│   │   │
│   │   └── <script> - Client-side JavaScript
│   │       ├── State management
│   │       ├── Theme toggle logic
│   │       ├── Tab switching
│   │       ├── Real-time calculations
│   │       ├── Form submission & validation
│   │       ├── Search functionality
│   │       ├── Edit mode handling
│   │       ├── Toast notifications
│   │       └── Loading state management
│
│
├── 📄 preview.html (Standalone UI Preview)
│   └── Full HTML + CSS + JavaScript (no backend calls)
│       └── Uses mock data for search/edit
│           └── Perfect for: Previewing in VS Code, testing UI, demos
│
├── 📄 README.md (Primary Documentation - START HERE)
│   ├── Feature overview and capabilities
│   ├── Quick start guide
│   ├── Security and reliability information
│   └── FAQ and troubleshooting
│
├── 📄 DEPLOYMENT.md (Deployment Guide)
│   ├── Step-by-step Google Apps Script setup
│   ├── Configuration instructions
│   ├── Testing procedures
│   └── Troubleshooting common issues
│
├── 📄 PROJECT_PLAN.md (Technical Specification)
│   ├── Executive Summary
│   ├── Tech Stack
│   ├── System Architecture (diagrams)
│   ├── Feature Specifications (detailed)
│   ├── Data Schema (13 columns, types, formats)
│   ├── Deployment Guide
│   ├── Implementation Files (breakdown of each .gs file)
│   ├── Testing Checklist
│   ├── Deployment Checklist
│   ├── Future Enhancements
│   ├── Code Quality Standards
│   ├── Security Considerations
│
├── 📄 QUICK_START.md (Quick Reference)
│   ├── Fast preview instructions
│   ├── Deployment checklist
│   ├── Common tasks and tips
│   └── Customization guide
│
├── 📄 TEST_PLAN.md (Testing Documentation)
│   ├── Testing strategy
│   ├── Test cases and scenarios
│   ├── Validation procedures
│   └── Quality assurance checklist
│
└── 📄 FILE_STRUCTURE.md (This File)
    ├── Workspace organization
    ├── File descriptions
    └── Architecture overview
│   ├── Support & Maintenance
│   └── Common Issues & Resolutions
│
├── 📄 DEPLOYMENT.md (Step-by-Step Setup Guide)
│   ├── Quick Start (preview vs full deployment)
│   ├── Option 1: Local Preview
│   ├── Option 2: Full Google Deployment (7 steps)
│   │   ├── Step 1: Prepare Google Sheets
│   │   ├── Step 2: Create Apps Script Project
│   │   ├── Step 3: Copy Code Files (4 files)
│   │   ├── Step 4: Deploy as Web App
│   │   ├── Step 5: Test the App
│   │   ├── Step 6: Verify Data in Sheets
│   │   └── Step 7: Share with Users
│   ├── Features Overview
│   ├── Security & Permissions
│   ├── Looker Studio Integration Guide
│   ├── Troubleshooting (with solutions)
│   ├── Example Test Data
│   ├── Updating the App
│   ├── Mobile Support
│   ├── Advanced Customization Tips
│   └── Full Deployment Checklist
│
├── 📄 README.md (Comprehensive Overview)
│   ├── Features (Core, UX, Security)
│   ├── Quick Start (Preview & Deployment links)
│   ├── Project Structure
│   ├── Technology Stack
│   ├── Data Schema (detailed table)
│   ├── UI/UX Highlights (design system)
│   ├── Form Validation Rules
│   ├── Integrations (Sheets, Looker Studio)
│   ├── Browser Support
│   ├── Security Considerations (detailed)
│   ├── Performance Metrics
│   ├── Deployment Checklist
│   ├── Updates & Maintenance
│   ├── FAQ
│   ├── Troubleshooting Guide
│   ├── Documentation Links
│   ├── Code Organization (file-by-file)
│   ├── Best Practices Used
│   ├── Future Enhancements
│   └── Support Information
│
├── 📄 QUICK_START.md (Quick Reference)
│   ├── Preview the UI (2 options)
│   ├── Full Deployment (5 steps, 15-20 min)
│   ├── File Guide (what to edit)
│   ├── Quick Customizations
│   │   ├── Change Colors
│   │   ├── Add Company Name
│   │   └── Adjust Form Fields
│   ├── Troubleshooting Quick Fixes
│   ├── Getting Help (3 steps)
│   ├── Success Checklist
│   ├── Common Tasks (Submit, Search, Edit, Share)
│   ├── Creating a Dashboard
│   ├── Security Notes
│   ├── Pro Tips
│   ├── Scale Considerations
│   ├── Learning Path (Beginner to Advanced)
│   └── Quick Links
│
└── 📄 FILE_STRUCTURE.md (This file)
    └── Complete hierarchy of all files and contents
```

---

## Google Sheets Structure (After Deployment)

```
Google Sheets: "Bonnie's Invoice Management"
│
└── Sheet: "Invoices"
    │
    └── Headers (Row 1)
        ├── A: ID (UUID)
        ├── B: Invoice Number (Text)
        ├── C: Invoice Date (Date)
        ├── D: Flower Cost (Currency)
        ├── E: Supplies Cost (Currency)
        ├── F: Greens Cost (Currency)
        ├── G: Invoice Credits (Currency)
        ├── H: Total Due (Currency)
        ├── I: Status (Text: ACTIVE/ARCHIVED)
        ├── J: Created Timestamp (DateTime)
        ├── K: Last Modified Timestamp (DateTime)
        ├── L: Created By (Email)
        └── M: Last Modified By (Email)
    │
    └── Data Rows (2+)
        ├── Row 2: First invoice
        ├── Row 3: Second invoice
        ├── Row N: Last invoice
        └── (More rows as users submit)
```

---

## Google Apps Script Project Structure

```
Apps Script Project: "Invoice Manager Script"
│
├── Code.gs (Main file)
├── HTML.gs (UI rendering)
├── FormValidation.gs (Validation logic)
├── SheetOperations.gs (Data access)
│
├── Deployment
│   └── Web App URL (shared with users)
│       └── Executes doGet() on page load
│       └── RPC calls to other functions via google.script.run
│
└── Logs
    └── Executions (for debugging)
```

---

## File Sizes & Complexity

| File | Lines | Complexity | Purpose |
|------|-------|-----------|---------|
| HTML.gs | ~1,100 | High | UI, styling, client-side logic |
| Code.gs | ~120 | Low | Simple request handlers |
| FormValidation.gs | ~200 | Medium | Validation rules |
| SheetOperations.gs | ~300 | Medium | CRUD operations |
| preview.html | ~1,000 | High | Standalone preview |
| Documentation | ~2,000 | Low | Guides and specs |

---

## Deployment Flow

```
User Action
    ↓
JavaScript in browser (HTML.gs)
    ↓
google.script.run (RPC call)
    ↓
Code.gs (handler function)
    ↓
FormValidation.gs (if needed)
    ↓
SheetOperations.gs (if needed)
    ↓
Google Sheets API
    ↓
Google Sheets data storage
    ↓
Return response
    ↓
Toast notification in browser
```

---

## Documentation Hierarchy

```
User needs help?
│
├─ Just want to preview?
│  └─ → preview.html
│
├─ Want quick overview?
│  └─ → QUICK_START.md
│
├─ Want to deploy?
│  └─ → DEPLOYMENT.md (step-by-step)
│
├─ Want technical details?
│  └─ → PROJECT_PLAN.md
│
├─ Want complete info?
│  └─ → README.md
│
└─ Want code reference?
   └─ → Read the .gs files directly
```

---

## What Each File Does

### User Perspective
```
Opens deployment URL
        ↓
    HTML.gs renders
        ↓
   Browser displays form
        ↓
  User fills form & clicks submit
        ↓
FormValidation.gs checks input
        ↓
SheetOperations.gs saves to Sheets
        ↓
Google Sheets stores data
        ↓
Toast notification shows success
```

### Developer Perspective
```
Code.gs            ← Orchestrates everything
    ↓
Calls FormValidation.gs    ← Validates data
    ↓
Calls SheetOperations.gs   ← Saves to Sheets
    ↓
Returns JSON response to browser
    ↓
HTML.gs handles response      ← Shows feedback
```

---

## Key Features by File

| Feature | Primary File | Supporting Files |
|---------|-------------|------------------|
| Form Display | HTML.gs | - |
| Real-time Calculation | HTML.gs | FormValidation.gs |
| Input Validation | FormValidation.gs | HTML.gs (client-side) |
| Data Persistence | SheetOperations.gs | Code.gs |
| Search | Code.gs | SheetOperations.gs |
| Edit/Update | Code.gs | SheetOperations.gs, FormValidation.gs |
| Dark Mode | HTML.gs | - |
| Duplicate Check | SheetOperations.gs | Code.gs |
| Timestamp Recording | SheetOperations.gs | FormValidation.gs |

---

## How Data Flows

```
New Invoice Form
├─ Invoice Number (entered by user)
├─ Invoice Date (date picker)
├─ Flower Cost (number input)
├─ Supplies Cost (number input)
├─ Greens Cost (number input)
└─ Invoice Credits (number input)
    ↓
Client-side validation (HTML.gs)
    ↓
Submission to Code.gs
    ↓
Server-side validation (FormValidation.gs)
    ↓
Duplicate check (SheetOperations.gs)
    ↓
Total calculation (FormValidation.gs)
    ↓
Generate ID (FormValidation.gs)
    ↓
Get current timestamp (FormValidation.gs)
    ↓
Append to Sheets (SheetOperations.gs)
    ↓
Format currency & dates in Sheets
    ↓
Return success response to browser
    ↓
Show toast notification (HTML.gs)
    ↓
Clear form (HTML.gs)
    ↓
Data now in Google Sheets! ✅
```

---

## Customization Points

| Aspect | File | Location |
|--------|------|----------|
| Colors | HTML.gs | CSS :root variables |
| Form fields | HTML.gs | <form> section |
| Validation rules | FormValidation.gs | Validate functions |
| Column structure | SheetOperations.gs | COLUMN_HEADERS constant |
| Sheet name | SheetOperations.gs | SHEET_NAME constant |
| Business logic | Code.gs | Handler functions |

---

## Testing Coverage

- Unit tests available via Apps Script Executions
- Manual test data in DEPLOYMENT.md
- Mock data in preview.html
- Form validation tests in FormValidation.gs

---

## Documentation Cross-References

```
README.md ──────────→ DEPLOYMENT.md (how to deploy)
            ──────→ PROJECT_PLAN.md (technical specs)
            ──────→ QUICK_START.md (quick reference)

DEPLOYMENT.md ──────→ Step-by-step guide
             ──────→ Troubleshooting section

PROJECT_PLAN.md ────→ Architecture diagrams
               ────→ Feature specifications
               ────→ Testing checklists

QUICK_START.md ─────→ Common tasks
              ─────→ Pro tips
              ─────→ Troubleshooting quick fixes

preview.html ────────→ Interactive UI demo
            ────────→ No backend needed
```

---

## Ready to Use!

All files are complete and production-ready. Choose your next step:

1. **Preview the UI** → Open `preview.html` in VS Code
2. **Deploy to Google** → Follow `DEPLOYMENT.md`
3. **Understand the tech** → Read `PROJECT_PLAN.md`
4. **Get started quickly** → Follow `QUICK_START.md`

---

**Created:** November 11, 2025  
**Status:** ✅ Complete and Ready for Deployment  
**Total Files:** 8 (4 code files + 4 documentation files)
