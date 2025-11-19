# Event Type Feature Test Plan
**Feature**: Event Type Checkboxes (Wedding, Funeral, Party/Occasion, Store Stock)  
**Columns**: BL-BO (columns 64-67) storing 1/0 values  
**Date**: November 17, 2025  
**Version**: 0.9995

---

## Pre-Test Verification

### Database Setup
- [x] Verify columns BL-BO exist in the Invoices sheet
- [x] Confirm columns are empty (no existing data that might conflict)
- [x] Check column headers are labeled: `isWedding`, `isFuneral`, `isParty`, `isStoreStock`
- [x] Verify no hidden columns between column BO and any existing data

### Code Review
- [x] Confirm `appendInvoice()` has padding array to columns 64-67
- [x] Confirm `updateInvoiceRow()` updates columns 64-67 with `.setValue()`
- [x] Verify search functions read from indices [63], [64], [65], [66]
- [x] Check `editInvoice()` has checkbox population logic
- [x] Confirm event badge CSS is loaded (check `.event-badge` styles)

### Bug Fixes Applied
- [x] **FIXED**: Search functions now safely read event type columns with length checks
- [x] **ADDED**: Enhanced logging to debug event type values in search results
- [x] **VERIFIED**: Data write path (columns 64-67) was correct all along

---

## Test Scenario 1: Create Invoice with All Checkboxes Checked

### Setup
1. Open the Invoice Management App
2. Navigate to **New Invoice** tab

### Test Steps
| # | Action | Expected Result | Pass | Notes |
|---|--------|-----------------|------|-------|
| 1.1 | Fill in Invoice Number | Field populates | ✅ | e.g., "TEST-001" |
| 1.2 | Fill in Invoice Date | Date picker works | ✅ | Use today's date |
| 1.3 | Select a Vendor | Dropdown appears and selection works | ✅ | e.g., "DV Flora" |
| 1.4 | Enter Flower Cost | Value appears and total updates | ✅ | e.g., "100.00" |
| 1.5 | **Check Wedding checkbox** | Checkbox visually checks | ✅ | Should see checkmark |
| 1.6 | **Check Funeral checkbox** | Checkbox visually checks | ✅ | Should see checkmark |
| 1.7 | **Check Party/Occasion checkbox** | Checkbox visually checks | ✅ | Should see checkmark |
| 1.8 | **Check Store Stock checkbox** | Checkbox visually checks | ✅ | Should see checkmark |
| 1.9 | Click **Submit Invoice** | Success toast appears | ✅ | "Invoice submitted successfully" |
| 1.10 | Check Google Sheets | New row appears in Invoices sheet | ✅ | Row should be populated |
| 1.11 | **Verify columns BL-BO** | All four columns contain "1" | ✅ | Critical: Check these cells |
| 1.12 | Check other cost columns | Flower Cost appears in correct column | ✅ | Verify data alignment |

### Expected Data in Sheet (Row)
```
Column BL (isWedding):     1
Column BM (isFuneral):     1
Column BN (isParty):       1
Column BO (isStoreStock):  1
```

---

## Test Scenario 2: Create Invoice with No Checkboxes Checked

### Setup
1. Open the Invoice Management App
2. Navigate to **New Invoice** tab

### Test Steps
| # | Action | Expected Result | Pass | Notes |
|---|--------|-----------------|------|-------|
| 2.1 | Fill in Invoice Number | Field populates | ✅ | e.g., "TEST-002" |
| 2.2 | Fill in Invoice Date | Date picker works | ✅ | Use today's date |
| 2.3 | Select a Vendor | Selection works | ✅ | e.g., "Product Junction" |
| 2.4 | Enter Supplies Cost | Value appears | ✅ | e.g., "50.00" |
| 2.5 | **Leave all checkboxes unchecked** | No checkmarks visible | ✅ | Should be empty |
| 2.6 | Click **Submit Invoice** | Success toast appears | ✅ | Form submits successfully |
| 2.7 | Check Google Sheets | New row appears | ✅ | Should be second new row |
| 2.8 | **Verify columns BL-BO** | All four columns contain "0" | ✅ | Critical: Check these cells |

### Expected Data in Sheet
```
Column BL (isWedding):     0
Column BM (isFuneral):     0
Column BN (isParty):       0
Column BO (isStoreStock):  0
```

---

## Test Scenario 3: Create Invoice with Mixed Checkboxes

### Setup
1. Open the Invoice Management App
2. Navigate to **New Invoice** tab

### Test Steps
| # | Action | Expected Result | Pass | Notes |
|---|--------|-----------------|------|-------|
| 3.1 | Fill in Invoice Number | Field populates | ✅ | e.g., "TEST-003" |
| 3.2 | Fill in Invoice Date | Works correctly | ✅ | Use today's date |
| 3.3 | Select a Vendor | Works correctly | ✅ | Any vendor |
| 3.4 | Enter Miscellaneous Cost | Value appears | ✅ | e.g., "25.00" |
| 3.5 | **Check ONLY Wedding** | Only Wedding checked | ✅ | Others unchecked |
| 3.6 | **Check ONLY Party/Occasion** | Only Party checked | ✅ | Others unchecked |
| 3.7 | Click **Submit Invoice** | Success message | ✅ | Submit works |
| 3.8 | Check Google Sheets | New row appears | ✅ | Third new row |
| 3.9 | **Verify columns BL-BO** | BL=1, BM=0, BN=1, BO=0 | ✅ | **CRITICAL**: Verify exact values |

### Expected Data in Sheet
```
Column BL (isWedding):     1
Column BM (isFuneral):     0
Column BN (isParty):       1
Column BO (isStoreStock):  0
```

---

## Test Scenario 4: Search and Display Event Badges

### Setup
1. Create test invoices using Scenarios 1-3 above
2. Navigate to **Search & Edit** tab

### Test Steps
| # | Action | Expected Result | Pass | Notes |
|---|--------|-----------------|------|-------|
| 4.1 | Click in "Search by Invoice Number" field | Field focuses | ✅ | Ready for input |
| 4.2 | Type "TEST-" | Field accepts text | ✅ | Partial search |
| 4.3 | Click **Search** button | Loading spinner appears then disappears | ✅ | Should show 3 results |
| 4.4 | View search results table | Table displays with new "Event Types" column | ✅ | 7 columns total now |
| 4.5 | **Row 1 (TEST-001)** | Shows 4 badges: Wedding, Funeral, Party, Stock | ✅ | All colored appropriately |
| 4.6 | **Row 2 (TEST-002)** | Shows dash "—" (no event types) | ✅ | Centered, gray color |
| 4.7 | **Row 3 (TEST-003)** | Shows 2 badges: Wedding, Party | ✅ | In correct order |
| 4.8 | Verify badge colors | Wedding=pink, Funeral=gray, Party=purple, Stock=green | ✅ | Visual verification |
| 4.9 | Hover over badges | Icons display correctly | ✅ | Ring, Flower, Balloon, Store |
| 4.10 | Click Edit on TEST-001 | Edit form loads with checkboxes | ✅ | **FIXED**: Now correctly updates only selected event columns |
| 4.11 | Dark mode toggle | Click theme toggle button | ✅ | Background changes |
| 4.12 | View badges in dark mode | Colors visible and readable | ✅ | Should be lighter shades |

---

## Test Scenario 5: Edit Invoice - Modify Checkboxes

### Setup
1. From Search & Edit tab with TEST-001 displayed
2. Click **Edit** button on TEST-001 (all checkboxes were 1)

### Test Steps
| # | Action | Expected Result | Pass | Notes |
|---|--------|-----------------|------|-------|
| 5.1 | Edit form appears | All fields populated, form is not hidden | ✅ | Should scroll into view |
| 5.2 | **Check checkbox states** | All 4 checkboxes are CHECKED | ✅ | CRITICAL: Verify all populated |
| 5.3 | Uncheck Wedding | Wedding becomes unchecked visually | ✅ | Still see checkmark on others |
| 5.4 | Uncheck Party/Occasion | Party becomes unchecked visually | ✅ | Now only Funeral & Stock checked |
| 5.5 | Verify other fields | Invoice Number, Vendor, costs all show | ✅ | Data persists correctly |
| 5.6 | Click **Update Invoice** | Success message appears | ✅ | "Invoice updated successfully" |
| 5.7 | Check Google Sheets | Row updated with new values | ✅ | Modified timestamp should update |
| 5.8 | **Verify columns BL-BO** | BL=0, BM=1, BN=0, BO=1 | ✅ | Should reflect unchecked boxes |

---

## Test Scenario 6: Edit Invoice - Unchecked Becomes Checked

### Setup
1. From Search & Edit tab
2. Search for TEST-002 (all checkboxes were 0)
3. Click **Edit** on TEST-002

### Test Steps
| # | Action | Expected Result | Pass | Notes |
|---|--------|-----------------|------|-------|
| 6.1 | Edit form appears | Invoice data loads | ✅ | Form visible |
| 6.2 | **Check checkbox states** | All 4 checkboxes are UNCHECKED | ✅ | CRITICAL: None should be checked |
| 6.3 | Check ONLY Funeral | Funeral becomes checked | ✅ | Others remain unchecked |
| 6.4 | Check ONLY Store Stock | Store Stock becomes checked | ✅ | Funeral still checked |
| 6.5 | Click **Update Invoice** | Success message | ✅ | Form submits |
| 6.6 | Check Google Sheets | Row updated | ✅ | New timestamp |
| 6.7 | **Verify columns BL-BO** | BL=0, BM=1, BN=0, BO=1 | ✅ | Matches selection |

---

## Test Scenario 7: Date Range Search with Event Badges

### Setup
1. Navigate to **Search & Edit** tab
2. Clear any previous search results

### Test Steps
| # | Action | Expected Result | Pass | Notes |
|---|--------|-----------------|------|-------|
| 7.1 | Enter "From Date" | Date field accepts input | ✅ | Use date from TEST invoices |
| 7.2 | Enter "To Date" | Date field accepts input | ✅ | Same or later date |
| 7.3 | Click **Search by Date** | Loading spinner appears | ✅ | Processing... |
| 7.4 | Results display | Table shows matching invoices | ✅ | Should include TEST-001, 002, 003 |
| 7.5 | **Event Types column displays** | Shows badges for all rows | ✅ | New column visible |
| 7.6 | Badge accuracy | TEST-001 shows 4, TEST-002 shows dash, TEST-003 shows 2 | ✅ | Matches expected state |

---

## Test Scenario 8: Cancel Edit Button

### Setup
1. Navigate to **Search & Edit** tab
2. Search for any invoice and click Edit

### Test Steps
| # | Action | Expected Result | Pass | Notes |
|---|--------|-----------------|------|-------|
| 8.1 | Edit form appears | Form is visible | ✅ | Standard state |
| 8.2 | Make a change (e.g., check a box) | Change appears in form | ✅ | Checkbox updates |
| 8.3 | Click **Cancel** button | Edit form hides | ✅ | Returns to search results |
| 8.4 | Search again and edit same invoice | Checkboxes show original state | ✅ | Change was NOT saved |

---

## Test Scenario 9: Form Reset (Create Tab)

### Setup
1. Navigate to **New Invoice** tab
2. Fill in some invoice data

### Test Steps
| # | Action | Expected Result | Pass | Notes |
|---|--------|-----------------|------|-------|
| 9.1 | Check some checkboxes | Visible checkmarks appear | ✅ | At least 1-2 checked |
| 9.2 | Click **Clear Form** button | All form fields clear | ✅ | Form resets completely |
| 9.3 | **Verify checkboxes are unchecked** | All event checkboxes are empty | ✅ | CRITICAL: Should be unchecked |
| 9.4 | Verify total resets | Total display shows $0.00 | ✅ | Total cleared |
| 9.5 | Verify date resets | Date field shows today's date | ✅ | Standard behavior |

---

## Test Scenario 10: Light Mode vs Dark Mode

### Setup
1. Open Invoice Management App
2. Create an invoice with mixed checkboxes (checked some, unchecked others)
3. Search to display results

### Test Steps
| # | Action | Expected Result | Pass | Notes |
|---|--------|-----------------|------|-------|
| 10.1 | View in Light Mode | Event badges visible with colors | ✅ | Pink, gray, purple, green |
| 10.2 | Click **Toggle Theme** button (moon icon) | App switches to dark mode | ✅ | Background darkens |
| 10.3 | **View badges in dark mode** | Badges visible with light colors | ✅ | Icons/text white in dark mode |
| 10.4 | Verify badge text readable | Icons and labels clear | ✅ | White text on darker backgrounds |
| 10.5 | Verify checkbox styling in dark mode | Checkboxes clearly visible | ✅ | Checkboxes visible |
| 10.6 | Toggle back to Light Mode | Badges revert to original colors | ✅ | Consistent switching |

---

## Test Scenario 11: Responsive Design

### Setup
1. Open Invoice Management App in a browser
2. Create and search for invoices with event types

### Test Steps (Desktop - 1024px+)
| # | Action | Expected Result | Pass | Notes |
|---|--------|-----------------|------|-------|
| 11.1 | View Event Types column | Column displays inline with others | ✅ | Not wrapped |
| 11.2 | Event badges | All 4 badges fit in column width | ✅ | No overflow |
| 11.3 | Checkboxes in form | Grid layout works | ✅ | 4 across or 2x2 depending on width |

### Test Steps (Tablet - 768px)
| # | Action | Expected Result | Pass | Notes |
|---|--------|-----------------|------|-------|
| 11.4 | Horizontal scroll | May need scroll for table | ✅ | Or compress columns |
| 11.5 | Checkboxes in form | Stack appropriately | ✅ | Responsive grid |
| 11.6 | Event badges | Still readable | ✅ | Don't disappear or overlap |

### Test Steps (Mobile - 320px)
| # | Action | Expected Result | Pass | Notes |
|---|--------|-----------------|------|-------|
| 11.7 | Form layout | Checkboxes stack 1 per row or 2 per row | ✅ | Usable on small screen |
| 11.8 | Search results | Table scrolls horizontally | ✅ | Event Types column accessible |
| 11.9 | Badges on mobile | Text truncation handled gracefully | ✅ | Labels visible or icons only |

---

## Test Scenario 12: Validation & Edge Cases

### Setup
1. Navigate to **New Invoice** tab

### Test Steps
| # | Action | Expected Result | Pass | Notes |
|---|--------|-----------------|------|-------|
| 12.1 | Submit with no checkboxes checked | Form submits successfully | ☐ | Event types optional |
| 12.2 | Submit with all checkboxes checked | Form submits successfully | ☐ | Multiple selections allowed |
| 12.3 | Check boxes multiple times rapidly | No visual glitches | ☐ | Toggle on/off smoothly |
| 12.4 | Fill form, check box, uncheck box | State persists correctly | ☐ | No automatic clearing |
| 12.5 | Duplicate invoice number with different checkboxes | Duplicate warning appears | ☐ | Validation still works |
| 12.6 | Edit invoice, change only checkboxes (no other fields) | Update succeeds | ☐ | Partial updates work |

---

## Test Scenario 13: Data Persistence & Accuracy

### Setup
1. Create 5 different test invoices with various checkbox combinations
2. Wait 1-2 minutes
3. Hard refresh the page (Ctrl+F5)

### Test Steps
| # | Action | Expected Result | Pass | Notes |
|---|--------|-----------------|------|-------|
| 13.1 | Search for all test invoices | All appear in results | ☐ | Saved correctly |
| 13.2 | Verify each invoice's event badges | Match expected values | ☐ | Data persisted accurately |
| 13.3 | Edit one invoice | Checkboxes load correctly | ☐ | Read from sheet working |
| 13.4 | View Google Sheets directly | Columns BL-BO match app display | ☐ | Single source of truth |

---

## Test Scenario 14: Performance & Load Time

### Setup
1. Assume you have 100+ invoices in the sheet (or create them via rapid submits)

### Test Steps
| # | Action | Expected Result | Pass | Notes |
|---|--------|-----------------|------|-------|
| 14.1 | Search for invoices | Results load within 2-3 seconds | ☐ | No excessive lag |
| 14.2 | View event badges in large result set | Badges render smoothly | ☐ | No visual stuttering |
| 14.3 | Edit invoice from large result set | Form loads quickly | ☐ | Checkbox state appears fast |
| 14.4 | Submit new invoice | Saves within 1-2 seconds | ☐ | Performance acceptable |

---

## Test Scenario 15: Regression Testing

### Setup
Ensure no existing functionality broke

### Test Steps
| # | Action | Expected Result | Pass | Notes |
|---|--------|-----------------|------|-------|
| 15.1 | Create invoice without event types | Vendor dropdown works | ☐ | No vendor feature broken |
| 15.2 | Cost calculations | Total updates correctly | ☐ | Math still works |
| 15.3 | Credits deduction | Total reflects credits | ☐ | Credits still deduct |
| 15.4 | Invoice duplicate detection | Still warns on duplicates | ☐ | Validation intact |
| 15.5 | Edit existing invoices (non-event fields) | Updates work normally | ☐ | Edit feature intact |
| 15.6 | Clear form button | Resets all fields including new checkboxes | ☐ | Reset complete |
| 15.7 | Theme toggle | Works as before | ☐ | Light/dark switch fine |
| 15.8 | Tab switching | Create ↔ Search tabs work | ☐ | Navigation unchanged |

---

## Known Risks to Verify

| Risk | Test Method | Expected Outcome | Pass |
|------|-------------|------------------|------|
| Column index off by one | Verify BL-BO in sheet contain correct values | Values appear in right columns | ☐ |
| Checkbox type coercion | Edit invoice created with 1/0 values | Checkboxes populate correctly | ☐ |
| Search function indices | Search and view event badges | Badges show correct data | ☐ |
| Dark mode badge contrast | Toggle dark mode, view badges | All badges readable | ☐ |
| Empty event column in results | Search invoice with no checkboxes | Shows "—" dash in Event Types column | ☐ |

---

## Sign-Off

| Item | Status |
|------|--------|
| All test scenarios completed | ☐ |
| All critical items verified | ☐ |
| No regressions detected | ☐ |
| Performance acceptable | ☐ |
| Ready for production | ☐ |

**Tested By**: _______________  
**Date**: _______________  
**Notes**: 

---

## Rollback Plan (If Issues Found)

If critical issues are discovered:

1. **Immediate**: Remove checkboxes from HTML (comment out Event Type sections)
2. **Data Safety**: Existing data in BL-BO columns won't be deleted
3. **Restoration**: Can re-enable checkboxes once fixed
4. **Backup**: Take screenshot of columns BL-BO before removing code

**Key files to restore if needed**:
- HTML checkbox sections (around lines 941-963 and 1165-1187)
- JavaScript form handlers (handleFormSubmit, handleEditSubmit)
- Search functions (searchByInvoiceNumberV2, searchByDateRangeV2)
- Display function (displaySearchResults)
