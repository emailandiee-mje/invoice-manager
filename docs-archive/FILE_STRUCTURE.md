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
│   ├── FormValidation.gs - Archived modular validation file
│   ├── HTML.gs - Archived separate HTML template file
│   ├── INDEX.md - Archived navigation guide
│   ├── QUICK_FIX.md - Archived quick fix guide
│   ├── QUICK_TEST.md - Archived testing guide
│   ├── README.md - Archived README
│   ├── REDEPLOY_REQUIRED.md - Archived deployment reminder
│   ├── REDEPLOY_VISUAL_GUIDE.md - Archived visual deployment guide
│   ├── SEARCH_DEBUG_GUIDE.md - Archived debugging documentation
│   ├── SEARCH_STATUS_UPDATE.md - Archived status update
│   ├── SheetOperations.gs - Archived modular sheet operations file
│   ├── SUMMARY.md - Archived project summary
│   ├── TECHNICAL_ANALYSIS.md - Archived technical analysis
│   ├── VISUAL_GUIDE.md - Archived visual guide
│   └── WORKSPACE_CLEANUP.md - Archived cleanup documentation
│
├── 📄 Code.gs (Complete Application - Single Deployment File)
│   ├── doGet() - Serves HTML interface (embedded template)
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
│   ├── sanitizeInput() - Input sanitization
│   └── Embedded HTML/CSS/JavaScript
│       ├── <head> - Meta, Tailwind CDN, custom CSS
│       ├── <body> - Complete UI with tabs, forms, search
│       └── <script> - Client-side logic and event handlers
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
│   ├── Single-file deployment instructions
│   ├── Testing procedures
│   └── Troubleshooting common issues
│
├── 📄 PROJECT_PLAN.md (Technical Specification)
│   ├── Executive Summary
│   ├── Tech Stack
│   ├── System Architecture (diagrams)
│   ├── Feature Specifications (detailed)
│   ├── Data Schema (15 columns, types, formats)
│   ├── Deployment Guide
│   ├── Testing Checklist
│   ├── Code Quality Standards
│   └── Security Considerations
│
├── 📄 QUICK_START.md (Quick Reference)
│   ├── Fast preview instructions
│   ├── Simplified deployment checklist
│   ├── Common tasks and tips
│   └── Customization guide
│
├── 📄 TEST_PLAN.md (Testing Documentation)
│   ├── Testing strategy
│   ├── Test cases and scenarios
│   ├── Validation procedures
│   └── Quality assurance checklist
│
├── 📄 DEFECTS.md (Bug Tracking)
│   ├── Active defects
│   ├── Resolved defects with fix details
│   └── Bug reporting guidelines
│
├── 📄 ENHANCEMENT_IDEAS.md (Future Features)
│   ├── Proposed enhancements
│   ├── Feature requests
│   └── Improvement suggestions
│
└── 📄 FILE_STRUCTURE.md (This File)
    ├── Workspace organization
    ├── File descriptions
    └── Architecture overview
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
├── Code.gs (Single complete application file)
│   ├── Server-side functions (handlers, validation, sheet operations)
│   └── Embedded HTML/CSS/JavaScript (complete UI)
│
├── Deployment
│   └── Web App URL (shared with users)
│       └── Executes doGet() on page load
│       └── RPC calls to handler functions via google.script.run
│
└── Logs
    └── Executions (for debugging)
```

---

## File Sizes & Complexity

| File | Lines | Complexity | Purpose |
|------|-------|-----------|---------|
| Code.gs | ~2,700 | High | Complete application (backend + embedded UI) |
| preview.html | ~1,000 | Medium | Standalone UI preview |
| Documentation | ~3,000 | Low | Guides and specifications |

**Archived Files (in docs-archive/):**
| File | Lines | Status |
|------|-------|--------|
| HTML.gs | ~1,800 | Archived - now embedded in Code.gs |
| FormValidation.gs | ~200 | Archived - now inline in Code.gs |
| SheetOperations.gs | ~300 | Archived - now inline in Code.gs |

---

## Deployment Flow

```
User Action
    ↓
JavaScript in browser (embedded in Code.gs)
    ↓
google.script.run (RPC call)
    ↓
Code.gs handler function
    ↓
Validation (within Code.gs)
    ↓
Sheet operations (within Code.gs)
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
    Code.gs doGet() serves HTML
        ↓
   Browser displays form
        ↓
  User fills form & clicks submit
        ↓
Code.gs validates input
        ↓
Code.gs saves to Google Sheets
        ↓
Google Sheets stores data
        ↓
Toast notification shows success
```

### Developer Perspective
```
Code.gs                        ← Single file containing:
    ↓                           - doGet() function with embedded HTML
    ├─ Validation logic         - Form validation functions
    ├─ Sheet operations         - Google Sheets API calls
    └─ Response handling        - Success/error responses
        ↓
Returns JSON response to browser
        ↓
Client-side JavaScript handles response  ← Shows feedback
```

---

## Key Features by Component

| Feature | Component in Code.gs | Location |
|---------|---------------------|----------|
| Form Display | Embedded HTML template | doGet() function |
| Real-time Calculation | Client-side JavaScript | <script> section |
| Input Validation | Server-side functions | validateAllFields() |
| Data Persistence | Sheet operations | appendInvoice(), updateInvoiceRow() |
| Search | Search functions | searchByInvoiceNumberV2(), searchByDateRangeV2() |
| Edit/Update | Update handler | updateInvoice() |
| Dark Mode | Client-side JavaScript | <script> section |
| Duplicate Check | Validation function | submitInvoice() |
| Timestamp Recording | Sheet operations | appendInvoice(), updateInvoiceRow() |

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
Client-side validation (JavaScript in Code.gs)
    ↓
Submission to Code.gs submitInvoice()
    ↓
Server-side validation (validateAllFields in Code.gs)
    ↓
Duplicate check (in submitInvoice function)
    ↓
Total calculation (calculateTotal in Code.gs)
    ↓
Generate ID (Utilities.getUuid())
    ↓
Get current timestamp (new Date())
    ↓
Append to Sheets (appendInvoice in Code.gs)
    ↓
Format currency & dates in Sheets
    ↓
Return success response to browser
    ↓
Show toast notification (JavaScript in embedded HTML)
    ↓
Clear form (JavaScript in embedded HTML)
    ↓
Data now in Google Sheets! ✅
```

---

## Customization Points

| Aspect | Location in Code.gs |
|--------|---------------------|
| Colors | CSS :root variables in embedded HTML |
| Form fields | HTML form section in doGet() |
| Validation rules | validateAllFields() function |
| Column structure | Column indices in sheet operations |
| Sheet names | 'Invoices' and 'Vendors' strings |
| Business logic | Handler functions (submitInvoice, updateInvoice, etc.) |

---

## Testing Coverage

- Manual test procedures in TEST_PLAN.md
- Test scenarios in DEPLOYMENT.md
- Mock data in preview.html
- Form validation in Code.gs

---

## Documentation Cross-References

```
README.md ──────────→ DEPLOYMENT.md (how to deploy)
            ──────→ PROJECT_PLAN.md (technical specs)
            ──────→ QUICK_START.md (quick reference)
            ──────→ DEFECTS.md (bug tracking)

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

DEFECTS.md ─────────→ Known issues
          ─────────→ Bug fixes implemented

ENHANCEMENT_IDEAS.md → Future features
                    → Feature requests
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
**Last Updated:** November 13, 2025  
**Status:** ✅ Complete and Ready for Deployment  
**Version:** 0.97
**Core Files:** 1 (Code.gs - complete application)
