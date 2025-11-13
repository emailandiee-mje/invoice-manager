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
