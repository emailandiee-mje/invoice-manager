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

---

## Proposed Enhancements

### 1. Character Counter on Fields
- **Description:** Add character counters to the invoice number and vendor name fields
- **Benefit:** Users can see how many characters they've used vs. the limit (50 for invoice, 100 for vendor)
- **Priority:** Low
- **Status:** Under consideration

### 2. Arrow Key Navigation in Vendor Field
- **Description:** Allow users to navigate the vendor dropdown using arrow keys (up/down)
- **Benefit:** Improved keyboard accessibility and faster data entry
- **Priority:** Medium
- **Status:** Under consideration

### 3. Consolidate Search Buttons
- **Description:** Currently there are two separate search buttons (by number and by date). Consider consolidating into one search interface
- **Benefit:** Cleaner UI, less confusion
- **Priority:** Low
- **Status:** Under consideration

### 4. Search by Vendor
- **Description:** Add ability to search for all invoices from a specific vendor
- **Benefit:** Useful for vendor-specific reporting and analysis
- **Priority:** Medium
- **Status:** Under consideration

### 5. Display Edited Invoice After Update
- **Description:** After editing an invoice, display the updated invoice details or return to a search showing just that invoice
- **Benefit:** Immediate confirmation of changes, better UX flow
- **Priority:** Low
- **Status:** Under consideration

### 6. Review Vendor Optional Rule on Edit
- **Description:** Currently vendor is optional when editing (line 218 of TEST_PLAN.md). Verify if this is the desired behavior
- **Benefit:** Data consistency and integrity
- **Priority:** High
- **Status:** Needs review

### 7. Clear Search Results on Tab Switch
- **Description:** Decide whether switching between tabs should clear search results, and whether a dedicated "Clear" button is needed
- **Benefit:** Better state management, clearer UX expectations
- **Priority:** Medium
- **Status:** Needs discussion

### 8. Add Freeform Comment Field
- **Description:** Add freeform comment field to Create New Invoice and Edit Invoice screens
- **Benefit:** Provide context for purchases
- **Priority:** Medium
- **Status:** Under consideration

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

**Last Reviewed:** November 13, 2025
