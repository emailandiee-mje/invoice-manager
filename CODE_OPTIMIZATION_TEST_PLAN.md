# Code Optimization Test Plan
**Version:** 0.901 - Code Optimization  
**Branch:** refactor/eliminate-duplicate-code  
**Test Date:** 11/18/2025  
**Tester:** Miranda Jane Ellison, MJE AppWorks

## Overview
This test plan validates the code optimization refactoring work that eliminated ~198 lines of duplicate code while maintaining identical functionality.

---

## 🔴 High Priority - Core Functionality

### Test 1: Vendor List Population & Filtering

#### 1.1 Create Form - Vendor Dropdown
- [x] Click on "Vendor" field in Create New Invoice form
- [x] Verify vendor dropdown appears with list of vendors
- [x] Type partial vendor name (e.g., "DV")
- [x] Verify list filters to show only matching vendors
- [x] Select a vendor from the dropdown
- [x] Verify vendor name populates in the field
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected

#### 1.2 Edit Form - Vendor Dropdown
- [x] Navigate to Search & Edit tab
- [x] Search for and edit an existing invoice
- [x] Click on "Vendor" field in Edit Invoice form
- [x] Verify vendor dropdown appears with list of vendors
- [x] Type partial vendor name to filter
- [x] Verify filtering works correctly
- [x] Select a different vendor
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected

---

### Test 2: Total Calculation

#### 2.1 Create Form - Total Calculation
- [x] Enter Flower Cost: **$100.00**
- [x] Enter Botanicals Cost: **$50.00**
- [x] Enter Supplies Cost: **$25.00**
- [x] Enter Greens Cost: **$15.00**
- [x] Enter Miscellaneous Cost: **$10.00**
- [x] Verify Total Due displays: **$200.00**
- [x] Enter Invoice Credits: **$50.00**
- [x] Verify Total Due updates to: **$150.00**
- [x] Enter Invoice Credits: **$250.00** (more than total)
- [x] Verify Total Due displays: **-$50.00** in red
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected

#### 2.2 Edit Form - Total Calculation
- [x] Edit an existing invoice
- [x] Modify Flower Cost to: **$200.00**
- [x] Verify Updated Total Due recalculates correctly
- [x] Modify multiple cost fields
- [x] Verify total updates in real-time for each change
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected

---

### Test 3: Form Validation

#### 3.1 Numeric Field Validation
- [x] In Create form, enter **"abc"** in Flower Cost field
- [x] Try to submit
- [x] Verify error: "Amount must be a valid number (e.g., 10.50)"
- [x] Enter **"-50"** in Supplies Cost field
- [x] Try to submit
- [x] Verify error: "Amount cannot be negative"
- [x] Test same validation for: Botanicals, Greens, Miscellaneous, Credits
- [x] Verify each field validates correctly
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected

#### 3.2 Required Field Validation
- [x] Leave Invoice Number blank, try to submit
- [x] Verify error: "Invoice number is required"
- [x] Leave Vendor blank, try to submit
- [x] Verify error: "Vendor is required"
- [x] Leave Invoice Date blank, try to submit
- [x] Verify error: "Invoice date is required"
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected - Enhancement logged for auto-scroll to errors

---

### Test 4: Search Functionality

#### 4.1 Search by Invoice Number
- [x] Navigate to Search & Edit tab
- [x] Enter an existing invoice number in search field
- [x] Click "Search" button
- [x] Verify results display correctly with all invoice details
- [x] Verify Invoice Date displays as: **"Nov 18, 2025"** format
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected

#### 4.2 Search by Date Range
- [x] Select "From" date: **November 1, 2025**
- [x] Select "To" date: **November 30, 2025**
- [x] Click "Search by Date" button
- [x] Verify all invoices within date range appear
- [x] Verify dates display in correct format
- [x] Try searching with To date before From date
- [x] Verify error: "Start date must be before end date"
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected

---

### Test 5: Invoice Submission

#### 5.1 Create Complete Invoice
- [x] Fill in all required fields:
  - Invoice Number: **TEST-001**
  - Invoice Date: **Today's date**
  - Vendor: **DV Flora** (or existing vendor)
- [x] Fill in all cost fields with valid amounts
- [x] Check event type checkboxes: Wedding, Funeral, Party
- [x] Click "Submit Invoice"
- [x] Verify success message: "Invoice submitted successfully!"
- [x] Verify form clears and resets
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected

#### 5.2 Event Type Checkboxes
- [x] Create invoice with only **Wedding** checked
- [x] Submit and search for the invoice
- [x] Verify only Wedding badge appears in search results
- [x] Create invoice with **Wedding, Funeral, Party** all checked
- [x] Submit and search for the invoice
- [x] Verify all three badges appear in search results
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected

---

### Test 6: Invoice Editing

#### 6.1 Edit Existing Invoice
- [x] Search for invoice: **TEST-001**
- [x] Click "Edit" button
- [x] Verify Edit Invoice form populates with all data
- [x] Verify Invoice Number field is **disabled** (read-only)
- [x] Modify Vendor to different vendor
- [x] Modify Flower Cost to **$150.00**
- [x] Uncheck Wedding checkbox
- [x] Check Party checkbox
- [x] Click "Update Invoice"
- [x] Verify success message: "Invoice updated successfully!"
- [x] Verify search results refresh automatically
- [x] Verify all changes are reflected in the results
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected

#### 6.2 Cancel Edit
- [x] Edit an invoice
- [x] Make some changes (don't save)
- [x] Click "Cancel" button
- [x] Verify edit form closes
- [x] Verify changes were not saved
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected

---

## 🟡 Medium Priority - Edge Cases

### Test 7: Event Type Badges

#### 7.1 Badge Display - Light Mode
- [x] Ensure app is in Light Mode (moon icon visible)
- [x] Search for invoices with event types
- [x] Verify Wedding badge displays with ring icon
- [x] Verify Funeral badge displays with heart-broken icon
- [x] Verify Party badge displays with music icon
- [x] Verify badges are readable with proper contrast
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected

#### 7.2 Badge Display - Dark Mode
- [x] Click theme toggle to switch to Dark Mode (sun icon visible)
- [x] Search for invoices with event types
- [x] Verify all badges display in white color
- [x] Verify icons display in white color
- [x] Verify badges are readable in dark mode
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected

#### 7.3 No Event Type
- [x] Create invoice without checking any event type checkboxes
- [x] Submit and search for the invoice
- [x] Verify Event Types column shows: **"—"** (em dash)
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected

---

### Test 8: Keyboard Navigation

#### 8.1 Vendor Dropdown Navigation
- [x] Click on Vendor field in Create form
- [x] Press **Arrow Down** key
- [x] Verify first vendor highlights
- [x] Press **Arrow Down** multiple times
- [x] Verify highlight moves to next vendors
- [x] Press **Arrow Up**
- [x] Verify highlight moves to previous vendor
- [x] Press **Enter** on highlighted vendor
- [x] Verify vendor is selected and dropdown closes
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected

#### 8.2 Escape and Tab Keys
- [x] Open vendor dropdown
- [x] Press **Escape** key
- [x] Verify dropdown closes
- [x] Open vendor dropdown, highlight a vendor
- [x] Press **Tab** key
- [x] Verify highlighted vendor is selected
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected

---

### Test 9: Duplicate Invoice Detection

#### 9.1 Real-Time Duplicate Warning
- [x] Note an existing invoice number (e.g., **TEST-001**)
- [x] Start creating a new invoice
- [x] Type the existing invoice number in Invoice Number field
- [x] Tab out of the field or click elsewhere
- [x] Verify orange warning banner appears: "Warning: An invoice with this number already exists"
- [x] Change invoice number to unique value
- [x] Verify warning disappears
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected - Enhancement logged for performance improvement

#### 9.2 Duplicate Prevention on Submit
- [x] Fill in complete invoice form with existing invoice number
- [x] Use same date as existing invoice
- [x] Click "Submit Invoice"
- [x] Verify error message: "An invoice with this number and date already exists"
- [x] Verify invoice is NOT saved
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected - Enhancement logged to prevent new vendor creation on error

---

### Test 10: New Vendor Addition

#### 10.1 Add New Vendor via Invoice
- [x] In Create form, type new vendor name: **"Test Vendor XYZ"**
- [x] Fill in remaining invoice fields
- [x] Click "Submit Invoice"
- [x] Verify success message
- [x] Open vendor dropdown
- [x] Verify **"Test Vendor XYZ"** now appears in the list
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected

---

## 🟢 Low Priority - Visual/UX

### Test 11: Dark Mode Toggle

#### 11.1 Theme Switching
- [x] Click theme toggle button (moon icon)
- [x] Verify app switches to dark mode
- [x] Verify button icon changes to sun
- [x] Verify all text is readable
- [x] Verify form fields have proper contrast
- [x] Click theme toggle again
- [x] Verify app switches back to light mode
- [x] Verify button icon changes to moon
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected

#### 11.2 Theme Persistence
- [x] Switch to dark mode
- [x] Refresh the page (F5)
- [x] Verify app remains in dark mode after refresh
- [x] Switch to light mode
- [x] Refresh the page
- [x] Verify app remains in light mode
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected

---

### Test 12: Form Reset

#### 12.1 Clear Form Button
- [x] Fill in all fields in Create New Invoice form
- [x] Check some event type checkboxes
- [x] Click "Clear Form" button
- [x] Verify all fields clear
- [x] Verify checkboxes uncheck
- [x] Verify Total Due resets to: **$0.00**
- [x] Verify Invoice Date resets to today's date
- [x] **Status:** ✅ Pass / ⬜ Fail  
- **Notes:** Working as expected

---

## 📊 Test Summary

### Quick Smoke Test Results (5-10 minutes)
- [x] Test 5.1: Create complete invoice ✓
- [x] Test 4.1: Search by invoice number ✓
- [x] Test 6.1: Edit invoice ✓
- [x] Test 4.2: Search by date range ✓
- [x] Test 2.1: Vendor dropdown filtering (both forms) ✓

**Smoke Test Status:** ✅ All Pass / ⬜ Issues Found

---

### Full Regression Test Results (20-30 minutes)
**Total Tests:** 24  
**Passed:** 24  
**Failed:** 0  
**Blocked:** 0  

---

### Critical Issues Found
None - All tests passed successfully

---

### Notes & Observations
- All refactored generic functions (populateVendorListGeneric, filterVendorListGeneric, calculateTotalGeneric, handleVendorKeydown) working correctly
- Event delegation for edit buttons functioning properly
- Keyboard navigation implemented and tested successfully
- Three enhancement requests logged in ENHANCEMENT_IDEAS.md for future consideration:
  1. Auto-scroll to validation error messages
  2. Improve duplicate invoice detection performance (reduce 3-second delay)
  3. Prevent new vendor creation when duplicate invoice error occurs

---

## ✅ Sign-Off

**Tested By:** Miranda Jane Fucking Ellison  
**Date:** November 18, 2025  
**Approval:** ✅ Approved for Merge to Main / ⬜ Issues Need Resolution

---

## Next Steps After Testing

If all tests pass:
1. [ ] Commit and push any final changes
2. [ ] Merge `refactor/eliminate-duplicate-code` branch to `main`
3. [ ] Update Google Apps Script with new files:
   - Code.gs
   - index.html
   - script.html (if changed)
4. [ ] Test in production Google Sheets environment
5. [ ] Close related GitHub issues/tasks

If issues found:
1. [ ] Document issues in detail above
2. [ ] Create bug tickets if needed
3. [ ] Fix issues on current branch
4. [ ] Re-test affected areas
