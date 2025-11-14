# Bonnie's Invoice Management App - Project Plan

**Project Status:** Ready for Development  
**Platform:** Google Suite (Google Apps Script + Google Sheets + Looker Studio)  
**Last Updated:** November 11, 2025  
**Target User:** Invoice data entry and management for flower-related business

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Tech Stack](#tech-stack)
3. [System Architecture](#system-architecture)
4. [Feature Specifications](#feature-specifications)
5. [Data Schema](#data-schema)
6. [Deployment Guide](#deployment-guide)
7. [Testing Checklist](#testing-checklist)

---

## Executive Summary

This project delivers a web-based invoice management application leveraging the free tier of Google Suite products. The application provides a user-friendly interface for:
- Creating and submitting invoice data
- Real-time calculation of net invoice amounts
- Searching and retrieving previously submitted invoices
- Editing existing invoice records
- Automated persistence to Google Sheets
- Seamless integration with Looker Studio for reporting and analytics

**Key Benefits:**
- Zero infrastructure costs (Google free tier)
- No authentication complexity (Google Account-based)
- Built-in data persistence and versioning
- Professional reporting capabilities
- Mobile-responsive interface

---

## Tech Stack

### Primary Technologies
| Component | Technology | Justification |
|-----------|-----------|----------------|
| **Frontend UI** | Google Apps Script HTML Service (HTML5 + CSS3 + JavaScript) | Native Google integration, no external servers required |
| **Backend Logic** | Google Apps Script (Server-side JS) | Seamless Sheets integration, built-in authentication |
| **Data Storage** | Google Sheets | Free, reliable, version control, easy reporting |
| **Reporting** | Looker Studio (Data Studio) | Free professional dashboards, automated data refresh |
| **Hosting** | Google Apps Script Web App | Free tier, no server management |

### Dependencies
- **Google Account:** (Free - required for all users)
- **Google Sheets:** (Free tier sufficient)
- **Google Looker Studio:** (Free tier sufficient)

---

## System Architecture

### High-Level Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User's Web Browser                        │
│              (HTML Form UI via Apps Script)                  │
└────────────────┬──────────────────────────────────────────┘
                 │ (Form Submission / Search Query)
                 ▼
┌─────────────────────────────────────────────────────────────┐
│         Google Apps Script (Server-side Code)               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ - Form Submission Handler                            │  │
│  │ - Invoice Search Logic                               │  │
│  │ - Data Validation & Transformation                   │  │
│  │ - Google Sheets API Integration                       │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────┬──────────────────────────────────────────┘
                 │ (Read/Write Operations)
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              Google Sheets (Data Storage)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Invoices Sheet:                                      │  │
│  │ [ID | Date | Invoice# | Flower$ | Supplies$ |       │  │
│  │  Greens$ | Credits$ | Total$ | Status | Timestamp] │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────┬──────────────────────────────────────────┘
                 │ (Data Connection)
                 ▼
┌─────────────────────────────────────────────────────────────┐
│           Looker Studio (Business Intelligence)             │
│     (Dashboards, Reports, Analytics - Read-only)            │
└─────────────────────────────────────────────────────────────┘
```

### Component Breakdown

#### 1. Frontend Layer (HTML/CSS/JavaScript)
- Responsive HTML form with client-side validation
- Real-time calculation display
- Search and results interface
- Edit mode for existing invoices

#### 2. Apps Script Backend
- **Submission Handler:** Validates and persists form data
- **Search Engine:** Queries Sheets data based on invoice number or date range
- **Update Handler:** Modifies existing invoice records
- **Calculation Engine:** Computes totals (client-side for UX, server-side for validation)

#### 3. Data Layer (Google Sheets)
- Structured table with proper headers and data types
- Audit trail capability (timestamps, status fields)
- Indexed on Invoice Number for search performance

---

## Feature Specifications

### Feature 1: Invoice Data Entry Form

#### UI Components
```
┌─────────────────────────────────────────────┐
│    Bonnie's Invoice Management System       │
├─────────────────────────────────────────────┤
│                                             │
│ Invoice Number: [____________] (text)      │
│                                             │
│ Invoice Date:   [DD/MM/YYYY picker]        │
│                                             │
│ COST BREAKDOWN:                             │
│ ├─ Flower Cost:       $ [_________] (number)  │
│ ├─ Supplies Cost:     $ [_________] (number)  │
│ ├─ Greens Cost:       $ [_________] (number)  │
│ ├─ Miscellaneous Cost:$ [_________] (number)  │
│ └─ Invoice Credits:   $ [_________] (number)  │
│                                             │
│ TOTAL DUE: $ [CALCULATED] (read-only)      │
│ (Calculation: F + S + G + M - C)            │
│                                             │
│ [SUBMIT] [CLEAR FORM]                      │
│                                             │
└─────────────────────────────────────────────┘
```

#### Validation Rules
| Field | Validation |
|-------|-----------|
| Invoice Number | Required, unique, alphanumeric (max 50 chars) |
| Invoice Date | Required, not future-dated |
| Flower Cost | Optional, non-negative number, max 2 decimals |
| Supplies Cost | Optional, non-negative number, max 2 decimals |
| Greens Cost | Optional, non-negative number, max 2 decimals |
| Invoice Credits | Optional, non-negative number, max 2 decimals |

#### Submit Behavior
- Display success/error toast notification
- Clear form on successful submission
- Log submission timestamp server-side
- Return assigned Invoice ID to user

---

### Feature 2: Invoice Search & Retrieval

#### UI Components
```
┌─────────────────────────────────────────────┐
│         SEARCH PRIOR INVOICES               │
├─────────────────────────────────────────────┤
│                                             │
│ Search by Invoice Number:                   │
│ [____________] [SEARCH]                    │
│                                             │
│ OR search by Date Range:                    │
│ From: [DD/MM/YYYY picker]                  │
│ To:   [DD/MM/YYYY picker]                  │
│       [SEARCH]                             │
│                                             │
│ ─── SEARCH RESULTS ───                      │
│ (Results displayed in table format)         │
│                                             │
└─────────────────────────────────────────────┘
```

#### Search Capabilities
- **By Invoice Number:** Exact or partial match (LIKE query)
- **By Date Range:** Returns all invoices between dates (inclusive)
- **Result Display:** Table with columns:
  - Invoice Number
  - Invoice Date
  - Total Amount
  - Created Timestamp
  - [Edit Button]

#### Result Interactions
- Click [Edit] button to load invoice into edit form
- Populate form with existing data
- Change form mode to "Edit" (visual indicator)
- Hide invoice number field (read-only in edit mode)
- Show [UPDATE] and [CANCEL] buttons instead of [SUBMIT]

---

### Feature 3: Invoice Editing

#### Edit Mode Specifications
- **Trigger:** Click [Edit] button in search results
- **Visual State Change:** 
  - Form title changes to "EDIT INVOICE"
  - Invoice Number field displays but is disabled
  - Submit button changes to [UPDATE] and [CANCEL]
- **Behavior:**
  - All cost fields become editable
  - Date field becomes editable
  - Invoice Number cannot be changed
  - On [UPDATE]: Validate, update Sheets row, show success message
  - On [CANCEL]: Clear form, return to search mode

---

### Feature 4: Calculation Engine

#### Total Due Calculation
```
TOTAL DUE = (Flower Cost + Supplies Cost + Greens Cost + Miscellaneous Cost) - Invoice Credits
```

#### Implementation
- **Client-side:** Real-time display as user types (JavaScript)
- **Server-side:** Validation and recalculation on submit (Apps Script)
- **Display Format:** Currency (USD) with 2 decimal places
- **Edge Cases:**
  - If result is negative, display "Negative Balance: -$XX.XX"
  - If no costs entered, display "$0.00"
  - Handle floating-point precision with proper rounding

---

### Feature 5: Data Persistence & Audit Trail

#### Sheets Table Structure
| Column | Data Type | Purpose |
|--------|-----------|---------|
| A: ID | Auto-increment | Unique identifier (GUID or sequential) |
| B: Invoice Number | String | User-provided invoice identifier |
| C: Invoice Date | Date | User-selected invoice date |
| D: Flower Cost | Currency | Cost input |
| E: Supplies Cost | Currency | Cost input |
| F: Greens Cost | Currency | Cost input |
| G: Invoice Credits | Currency | Credit amount |
| H: Total Due | Currency | Calculated amount |
| I: Status | String | "ACTIVE" or "ARCHIVED" |
| J: Created Timestamp | DateTime | Automatic on creation |
| K: Last Modified Timestamp | DateTime | Updated on edit |
| L: Created By | String | User email |
| M: Last Modified By | String | User email |

#### Data Integrity
- **No Duplicates:** Invoice Number + Invoice Date composite must be unique
- **Immutable Audit Trail:** Never delete rows, only archive (Status = "ARCHIVED")
- **Read-only Columns:** ID, Timestamps, Created By should not be manually edited
- **Validation:** Server-side validation before any write operation

---

## Data Schema

### Google Sheets Configuration

#### Sheet Name: "Invoices"

**Headers (Row 1):**
```
A1: ID
B1: Invoice Number
C1: Invoice Date
D1: Vendor
E1: Flower Cost
F1: Supplies Cost
G1: Greens Cost
H1: Miscellaneous Cost
I1: Invoice Credits
J1: Total Due
K1: Status
L1: Created Timestamp
M1: Last Modified Timestamp
N1: Created By
O1: Last Modified By
```

#### Data Types & Formatting
```
Column A (ID):                   Text (GUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
Column B (Invoice Number):       Text, max 50 chars
Column C (Invoice Date):         Date (YYYY-MM-DD format)
Column D (Vendor):               Text, max 100 chars
Column E-H (Currency Amounts):   Number, Currency format, 2 decimal places
Column I (Invoice Credits):      Number, Currency format, 2 decimal places
Column J (Total Due):            Formula: =E+F+G+H-I (then format as currency)
Column K (Status):               Text (ACTIVE|ARCHIVED)
Column L-M (Timestamps):         DateTime (YYYY-MM-DD HH:MM:SS)
Column N-O (User Email):         Text
```

#### Example Row
```
| ID                                   | Invoice #    | Date       | Vendor      | Flower | Supplies | Greens | Misc   | Credits | Total  | Status | Created             | Modified            | Created By     | Modified By    |
|--------------------------------------|--------------|------------|-------------|--------|----------|--------|--------|---------|--------|--------|---------------------|---------------------|----------------|----------------|
| 550e8400-e29b-41d4-a716-446655440000 | INV-2025-001 | 2025-11-01 | DV Flora    | 150.00 | 45.50    | 32.00  | 15.00  | 10.00   | 232.50 | ACTIVE | 2025-11-01 10:30:00 | 2025-11-01 10:30:00 | user@gmail.com | user@gmail.com |
```

---

## Deployment Guide

### Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Create" > "Blank spreadsheet"
3. Name it: `Bonnie's Invoice Management`
4. Rename the first sheet to `Invoices`
5. Create headers as specified in [Data Schema](#data-schema)

### Step 2: Create Google Apps Script Project

1. Open your Google Sheet
2. Click "Extensions" > "Apps Script"
3. The default `Code.gs` file will already be present
4. Delete all default code in Code.gs
5. Copy all contents from the project's `Code.gs` file
6. Paste into the Apps Script editor
7. Save the file (Ctrl+S or Cmd+S)

### Step 3: Deploy as Web App

1. In Apps Script editor, click "Deploy" > "New deployment"
2. Select type: "Web app"
3. Execute as: [Your Google Account]
4. Who has access: "Anyone"
5. Click "Deploy"
6. Copy the deployed URL and share with users

### Step 4: Set Up Looker Studio (Optional but Recommended)

1. Go to [Looker Studio](https://lookerstudio.google.com)
2. Create new report
3. Add data source: Google Sheets
4. Select your `Invoices` sheet
5. Create visualizations:
   - Table of all invoices
   - Total Revenue by Month (chart)
   - Average Invoice Amount (metric)
   - Invoice Count by Status (pie chart)

---

## Implementation Files

### File 1: `Code.gs` (Main Server Logic)

**Responsibilities:**
- Handle form submissions
- Process search queries
- Manage invoice updates
- Serve the HTML interface

**Key Functions:**
```javascript
function doGet(e) 
  // Returns the HTML form UI

function submitInvoice(invoiceData)
  // Validates and saves new invoice
  // Returns: {success: bool, message: string, invoiceId: string}

function searchInvoices(searchType, searchValue)
  // searchType: 'number' | 'dateRange'
  // Returns: Array of invoice objects

function updateInvoice(invoiceId, updatedData)
  // Validates and updates existing invoice
  // Returns: {success: bool, message: string}

function getInvoiceById(invoiceId)
  // Returns single invoice object for editing
```

**Dependencies:**
- All functionality is self-contained in Code.gs

---

### Code.gs Structure

The single `Code.gs` file contains:

**1. Server-Side Functions:**
```javascript
function doGet(e)
  // Serves HTML interface with embedded template

function submitInvoice(invoiceData)
  // Validates and saves new invoice

function updateInvoice(updatedData)
  // Updates existing invoice

function searchInvoices(searchParams)
  // Searches by number or date range

function getInvoiceById(invoiceId)
  // Returns single invoice object for editing

function validateAllFields(data)
  // Server-side validation

function calculateTotal(costs)
  // Total calculation

function appendInvoice(data)
  // Adds new invoice to sheet

function updateInvoiceRow(id, data)
  // Updates existing sheet row

function getVendors()
  // Returns vendor list

function addNewVendor(vendor)
  // Adds new vendor to Vendors sheet
```

**2. Embedded HTML/CSS/JavaScript Template:**
- Responsive HTML form with Tailwind CSS
- Client-side JavaScript for interactivity
- Dark mode toggle
- Real-time calculations
- Form validation
- Search functionality
- Edit mode management
- Toast notifications

---

## Testing Checklist

### Unit Tests (Apps Script)

- [ ] Invoice number validation (valid/invalid formats)
- [ ] Date validation (past, present, future dates)
- [ ] Currency validation (positive, negative, decimals)
- [ ] Total calculation (various cost combinations)
- [ ] Duplicate invoice detection
- [ ] Timezone handling

### Integration Tests

- [ ] Form submission saves to Sheets
- [ ] Search by invoice number returns correct results
- [ ] Search by date range returns correct results
- [ ] Edit invoice updates Sheets correctly
- [ ] Timestamps update on edit
- [ ] User email captured correctly

### UI/UX Tests

- [ ] Form displays on desktop and mobile
- [ ] Real-time calculation updates as user types
- [ ] Search results populate correctly
- [ ] Edit mode loads existing data properly
- [ ] Success/error messages display clearly
- [ ] Form resets after successful submission
- [ ] Date picker works across browsers

### Data Integrity Tests

- [ ] No duplicate invoice numbers + dates
- [ ] Audit trail fields update appropriately
- [ ] Currency fields maintain 2 decimal precision
- [ ] Archived invoices don't appear in search (unless explicitly included)
- [ ] Calculation matches manual verification

### Performance Tests

- [ ] Search completes in < 2 seconds
- [ ] Form submission completes in < 3 seconds
- [ ] Real-time calculation is instant (< 100ms)
- [ ] Page load time < 2 seconds

---

## Deployment Checklist

### Pre-Deployment
- [ ] All files created and tested locally
- [ ] Error handling implemented for all functions
- [ ] User-facing error messages are clear and helpful
- [ ] No hardcoded values or test data
- [ ] Comments added to complex logic
- [ ] Sheets headers created manually

### Deployment
- [ ] Apps Script project deployed as Web App
- [ ] Deployment URL copied and tested
- [ ] Initial test submission verified in Sheets
- [ ] Looker Studio report created (optional)
- [ ] Shared with end users

### Post-Deployment
- [ ] Monitor for errors (Apps Script Executions)
- [ ] Verify Sheets data formatting
- [ ] Check Looker Studio data refresh
- [ ] Gather user feedback
- [ ] Document any customizations

---

## Future Enhancements (Out of Scope for MVP)

- [ ] Email notifications on submission
- [ ] PDF invoice generation
- [ ] Bulk upload from CSV
- [ ] Multi-user permissions management
- [ ] Invoice line items (detailed cost breakdown)
- [ ] Recurring invoices
- [ ] Export to accounting software
- [ ] Mobile app (progressive web app)

---

## Code Quality Standards

### Naming Conventions
- **Functions:** camelCase (e.g., `submitInvoice`, `calculateTotal`)
- **Variables:** camelCase (e.g., `invoiceNumber`, `totalDue`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_INVOICE_LENGTH`)
- **Class/Object names:** PascalCase (if used)

### Documentation Requirements
- JSDoc comments for all functions
- Inline comments for complex logic
- Parameter and return type documentation
- Error handling documentation

### Error Handling
- Try-catch blocks around Sheets operations
- User-friendly error messages
- Server-side logging of errors
- No sensitive data in error messages

---

## Security Considerations

### Authentication
- Relies on Google Account authentication (built-in)
- Users must be logged into Google account to access
- App deployed with "Anyone" access assumes trusted user group

### Data Protection
- All data in Google Sheets (encrypted at rest)
- HTTPS enforced by Google
- No data stored outside Google ecosystem
- User email captured automatically (no sensitive data input)

### Input Validation
- Server-side validation required for all submissions
- HTML sanitization recommended
- Maximum length enforced for text fields
- Type validation for numeric fields

---

## Support & Maintenance

### Common Issues & Resolutions

**Issue: "Permission Denied" error**
- **Cause:** User not logged into Google
- **Resolution:** Log out and log back in with appropriate Google account

**Issue: Search returns no results**
- **Cause:** Data not in expected format in Sheets
- **Resolution:** Verify invoice numbers match exactly (case-sensitive)

**Issue: Calculation shows incorrect total**
- **Cause:** Floating-point precision error
- **Resolution:** Verify rounding is set to 2 decimal places

**Issue: Timestamp shows wrong time**
- **Cause:** Timezone mismatch
- **Resolution:** Set spreadsheet timezone in sheet settings

### Maintenance Tasks
- Monthly review of Sheets data for integrity
- Quarterly backup of data to external source
- Update Looker Studio refresh schedule if needed
- Monitor Apps Script quotas and usage

---

## Contact & Support

For questions or issues with deployment:
1. Check the [Testing Checklist](#testing-checklist)
2. Review [Common Issues](#support--maintenance)
3. Consult the [Code Quality Standards](#code-quality-standards)
4. Refer to [Google Apps Script Documentation](https://developers.google.com/apps-script/guides)

---

**Document Version:** 1.0  
**Last Updated:** November 11, 2025  
**Ready for Development:** ✅ YES
