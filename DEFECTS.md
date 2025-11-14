# Defects & Known Issues

**Created:** November 13, 2025  
**Purpose:** Track bugs, defects, and known issues in the Invoice Management System

---

## Overview
This document tracks confirmed defects and known issues in the application. These are distinct from enhancement ideas (see ENHANCEMENT_IDEAS.md) as they represent actual problems with current functionality.

---

## Active Defects

_No active defects_

---

## Resolved Defects

### 1. Title Text Clipping Issue
- **Description:** The bottom of the letter 'g' in "Bonnie's Invoice Manager" appears clipped in the GUI
- **Location:** Application title/header
- **Severity:** Low
- **Impact:** Visual polish issue - does not affect functionality
- **Status:** Resolved
- **Priority:** Low
- **Reported:** November 13, 2025
- **Resolved:** November 13, 2025
- **Fix:** Added CSS properties to `.gradient-text` class: `line-height: 1.5`, `display: inline-block`, `padding-bottom: 8px`, `overflow: visible`. Also added `h1.gradient-text` rule with `padding: 8px 0 12px 0` for additional bottom spacing
- **Version:** Fixed in v0.94
- **Notes:** CSS fix ensures descenders (g, y, p, etc.) display properly without clipping

### 2. Miscellaneous Cost Field Not Saving
- **Description:** Miscellaneous Cost field value not being captured from form submission, resulting in missing data in the sheet and #NUM! error in Total Due column
- **Location:** Create Invoice form submission handler and Edit Invoice form submission handler
- **Severity:** High
- **Impact:** Complete data loss for miscellaneous costs, incorrect total calculations
- **Status:** Resolved
- **Priority:** Critical
- **Reported:** November 13, 2025
- **Resolved:** November 13, 2025
- **Fix:** 
  - Create form: Added `miscellaneousCost` to invoiceData object in `handleFormSubmit()`, added parseFloat() conversion, and added validation function for the field
  - Edit form: Added `miscellaneousCost` to updatedData object in `handleEditSubmit()`, added parseFloat() conversion, and added validation for negative values
- **Version:** Create form fixed in v0.96, Edit form fixed in v0.97
- **Notes:** Field was added to GUI in v0.95 but form submission logic was incomplete in both Create and Edit forms, causing undefined values to be passed to calculation and storage functions

### 3. Botanicals Cost Field Implementation Defects
- **Description:** Three defects introduced when adding Botanicals Cost field: (1) Search results showing $0.00 total instead of correct amount, (2) Edit form displaying cost values in wrong fields (shifted by one position), (3) Botanicals Cost not included in real-time Total Due calculation
- **Location:** `searchByInvoiceNumberV2()`, `searchByDateRangeV2()`, `calculateTotal()`, and `calculateEditTotal()` functions
- **Severity:** High
- **Impact:** Incorrect total display in search results, confusing UX with misaligned values in edit form, and inaccurate total calculations when entering botanicals cost
- **Status:** Resolved
- **Priority:** Critical
- **Reported:** November 13, 2025
- **Resolved:** November 13, 2025
- **Fix:** 
  - Search functions: Updated column indices in `searchByInvoiceNumberV2()` and `searchByDateRangeV2()` to account for new botanicals cost column (column 5). Adjusted all subsequent field mappings: suppliesCost (col 6), greensCost (col 7), miscellaneousCost (col 8), invoiceCredits (col 9), total (col 10), createdTimestamp (col 12)
  - Calculation functions: Added `botanicalsCost` variable to both `calculateTotal()` and `calculateEditTotal()` functions, and updated total formula to include botanicals cost: `flowerCost + botanicalsCost + suppliesCost + greensCost + miscellaneousCost - credits`
- **Version:** Fixed in v0.98
- **Notes:** Column index misalignment occurred because search functions weren't updated when botanicals cost column was inserted. Calculation functions were missing botanicals cost variable despite it being in the event listener array. This defect highlights the importance of updating all data read/write operations when adding new columns to the sheet structure.

---

## How to Use This Document

### Reporting a Defect
When logging a new defect:
1. Add to "Active Defects" section
2. Include all relevant fields (description, location, severity, etc.)
3. Assign appropriate priority and status

### Severity Levels
- **Critical:** Application crash, data loss, or complete feature failure
- **High:** Major functionality broken or significantly impaired
- **Medium:** Feature works but with notable issues
- **Low:** Minor issues, cosmetic problems, edge cases

### Priority Levels
- **Critical:** Must fix immediately
- **High:** Fix in next release
- **Medium:** Schedule for upcoming release
- **Low:** Fix when convenient

### Status Values
- **Open:** Defect confirmed, not yet assigned/started
- **In Progress:** Currently being worked on
- **Testing:** Fix implemented, awaiting verification
- **Resolved:** Fix verified and deployed
- **Closed:** Issue resolved and documented
- **Won't Fix:** Decided not to fix (include reason)

### Moving to Resolved
When a defect is fixed:
1. Move entry to "Resolved Defects" section
2. Update status to "Resolved"
3. Add resolution date and fix details

---

**Last Updated:** November 13, 2025
