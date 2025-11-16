# Enhancement Ideas & Feature Requests

**Created:** November 13, 2025
**Source:** Testing feedback and user suggestions

---

## Overview
This document tracks potential enhancements and feature ideas for the Invoice Management System. These are not bugs or issues, but suggestions for improving user experience and functionality.

---

## Completed Enhancements

### Application Branding
- **Description:** Consider renaming the app to "Bonnie's Invoice Manager" for better branding
- **Benefit:** More personalized, professional appearance
- **Priority:** Low
- **Status:** Completed
- **Implemented:** November 13, 2025

### Add Miscellaneous Cost Field
- **Description:** Add a new "Miscellaneous Cost" field to track delivery and gas costs
- **GUI Placement:** Field should appear after Greens Cost and before Invoice Credits in the form
- **Sheet Placement:** New column inserted between Greens Cost and Invoice Credits columns
- **Validation:** All rules that apply to other cost fields (non-negative, numeric, default to 0) apply to this field
- **Calculation:** Total Due = Flower Cost + Supplies Cost + Greens Cost + Miscellaneous Cost - Invoice Credits
- **Benefit:** Better expense tracking for delivery, gas, and other miscellaneous costs
- **Priority:** High
- **Status:** Completed
- **Implemented:** November 13, 2025 (v0.95)

### Add Botanicals Cost Field
- **Description:** Add a new "Botanicals Cost" field to track delivery and gas costs
- **GUI Placement:** Field should appear after Flowers Cost and before Supplies Costs in the form
- **Sheet Placement:** New column will be inserted by me between Flowers Cost and Supplies Costs columns
- **Validation:** All rules that apply to other cost fields (non-negative, numeric, default to 0) apply to this field
- **Calculation:** Total Due = Flower Cost + Botanicals Cost + Supplies Cost + Greens Cost + Miscellaneous Cost - Invoice Credits
- **Benefit:** Better expense tracking for plants and botanicals
- **Priority:** High
- **Status:** Completed
- **Implemented:** November 13, 2025 (v0.98)

### Auto-Focus Invoice Number After Submission
- **Description:** After successfully submitting an invoice, automatically place cursor in the Invoice Number field and scroll window to top of form
- **Benefit:** Streamlines batch invoice entry workflow - users can immediately start entering next invoice without manual clicking/scrolling
- **Priority:** Medium
- **Status:** Completed
- **Implemented:** November 13, 2025
- **Notes:** Particularly useful when entering multiple invoices in succession

### Real-Time Duplicate Invoice Number Detection
- **Description:** Check for duplicate invoice numbers immediately when user leaves the Invoice Number field (onBlur event), rather than waiting until form submission
- **Benefit:** Provides instant feedback to user before they waste time entering entire invoice. Prevents frustration of completing form only to discover duplicate at submit time
- **Priority:** High
- **Status:** Completed
- **Implemented:** November 15, 2025 (v0.994)
- **Performance Impact:** Minimal (<1 second even with thousands of invoices)
- **Implementation Details:**
  - Added onBlur event handler to Invoice Number field
  - Displays warning icon/message near field if duplicate detected
  - Non-blocking warning allows user to proceed if intentional
  - Keeps existing submit-time validation as safety net
  - Server-side function `checkInvoiceNumberExists()` performs efficient lookup

### Display Edited Invoice After Update
- **Description:** After editing an invoice, automatically display the updated invoice details by triggering a search for that invoice
- **Benefit:** Immediate visual confirmation of changes, improved UX flow, eliminates need to manually search for the invoice again
- **Priority:** Medium-High
- **Status:** Completed
- **Implemented:** November 15, 2025 (v0.997)
- **Implementation Details:**
  - After successful update, auto-populate search field with invoice number
  - Automatically trigger search to display updated invoice
  - Close edit form and show results for immediate confirmation
  - Reuses existing search functionality for consistency

### Require Vendor Field on Edit
- **Description:** Make vendor field required when editing invoices to match create form validation and ensure data integrity
- **Benefit:** Consistent validation rules, prevents empty vendor fields, maintains data quality
- **Priority:** High
- **Status:** Completed
- **Implemented:** November 15, 2025 (v0.998)
- **Client Confirmation:** Client confirmed vendor is required for data integrity purposes
- **Implementation Details:**
  - Added vendor validation to edit form submission
  - Displays clear error message if vendor is empty
  - Matches validation pattern from create form
  - Prevents accidental removal of vendor during edits

### Arrow Key Navigation in Vendor Field
- **Description:** Allow users to navigate the vendor dropdown using arrow keys (up/down)
- **Benefit:** Improved keyboard accessibility and faster data entry
- **Priority:** High
- **Status:** Completed
- **Implemented:** November 15, 2025 (v0.999)
- **Implementation Details:**
  - **Enter Key:** Selects the currently highlighted item and closes dropdown
  - **Escape Key:** Closes dropdown without selecting
  - **Tab Key:** Selects currently highlighted item (if any) and moves focus to next field
  - **Arrow Up/Down:** Navigate through visible dropdown items
  - **Wrapping Behavior:** Up arrow on first item wraps to last item; down arrow on last item wraps to first item
  - **Filtered Lists:** Arrow keys navigate only through visible/filtered items
  - **Keyboard vs Mouse:** Keyboard selection takes precedence over mouse hover states (distinct visual indicator)
  - **Focus Management:** Focus remains in vendor field during navigation; Tab exits field
  - **Visual Feedback:** Keyboard-highlighted item has distinct outline and stronger background color
  - **Scroll Behavior:** Highlighted item automatically scrolls into view in dropdown list
  - **State Management:** Highlight resets on blur and when filtering list

---

## Proposed Enhancements

### 1. Character Counter on Fields
- **Description:** Add character counters to the invoice number and vendor name fields
- **Benefit:** Users can see how many characters they've used vs. the limit (50 for invoice, 100 for vendor)
- **Priority:** Low
- **Status:** Under consideration

### 2. Consolidate Search Buttons
- **Description:** Currently there are two separate search buttons (by number and by date). Consider consolidating into one search interface
- **Benefit:** Cleaner UI, less confusion
- **Priority:** Low
- **Status:** Under consideration

### 3. Search by Vendor
- **Description:** Add ability to search for all invoices from a specific vendor
- **Benefit:** Useful for vendor-specific reporting and analysis
- **Priority:** Medium
- **Status:** Under consideration

### 4. Clear Search Results on Tab Switch
- **Description:** Decide whether switching between tabs should clear search results, and whether a dedicated "Clear" button is needed
- **Benefit:** Better state management, clearer UX expectations
- **Priority:** Medium
- **Status:** Needs discussion with customer/stakeholders

### 5. Add Freeform Comment Field
- **Description:** Add freeform comment field to Create New Invoice and Edit Invoice screens
- **Benefit:** Provide context for purchases
- **Priority:** Medium
- **Status:** Needs discussion with customer/stakeholders to understand best field placement

### 6. Event Type Checkboxes
- **Description:** Add three checkboxes on Create Invoice and Edit Invoice screens to categorize orders: Wedding, Funeral, and Holiday
- **Benefit:** Enable event-type tracking for business analysis, seasonal trends, and reporting (e.g., "How much of our business comes from weddings vs. funerals?")
- **Priority:** High
- **Status:** Approved - Customer requested
- **Implementation Notes:**
  - Add three checkbox fields: "Wedding", "Funeral", "Holiday"
  - Multiple checkboxes can be selected (e.g., a holiday wedding)
  - Store as boolean/checkbox columns in the sheet
  - Include in both Create and Edit invoice screens
  - Optional fields (can be left unchecked)

---

## How to Use This Document

### Adding New Ideas
When new enhancement ideas arise:
1. Add them to the "Proposed Enhancements" section
2. Include description, benefit, priority, and status
3. Update the date and source if applicable

### Status Values
- **Under consideration:** Idea logged, not yet evaluated
- **Needs review:** Requires technical or business review
- **Needs discussion:** Stakeholders need to discuss/decide
- **Approved:** Approved for future implementation
- **In progress:** Currently being developed
- **Completed:** Enhancement implemented
- **Rejected:** Decided not to implement (include reason)

### Priority Levels
- **High:** Significant impact on usability or data integrity
- **Medium:** Noticeable improvement to user experience
- **Low:** Nice to have, minor improvement

---

## Implementation Notes

When implementing enhancements, consider:
- Impact on existing functionality
- Testing requirements
- Documentation updates needed
- User training/communication required

---

**Last Reviewed:** November 15, 2025
