/**
 * Code.gs - Main Server Logic for Invoice Management App
 * Handles HTTP requests, form submissions, searches, and updates
 * @version 0.901 - Updated Checkboxes
 */

/**
 * include - Helper function to include HTML files
 * @param {string} filename - The name of the HTML file to include (without .html extension)
 * @return {string} The contents of the file
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * doGet - Serves the main HTML interface
 * @return {HtmlOutput} The main application interface
 */
function doGet(e) {
  // Initialize sheets on first load
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Ensure Invoices sheet exists
    if (!spreadsheet.getSheetByName('Invoices')) {
      spreadsheet.insertSheet('Invoices');
    }
    
    // Ensure Vendors sheet exists
    if (!spreadsheet.getSheetByName('Vendors')) {
      spreadsheet.insertSheet('Vendors');
    }
  } catch (error) {
    Logger.log('Warning: Could not initialize sheets: ' + error);
  }
  
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setWidth(1024)
    .setHeight(800);
}

/**
 * submitInvoice - Validates and saves a new invoice to Google Sheets
 * @param {Object} invoiceData - The invoice data object
 * @return {Object} {success: boolean, message: string, invoiceId: string}
 */
function submitInvoice(invoiceData) {
  try {
    Logger.log('=== submitInvoice START ===');
    Logger.log('Invoice data received: ' + JSON.stringify(invoiceData));
    
    // Validate input
    const validationResult = validateAllFields(invoiceData);
    Logger.log('Validation result: ' + JSON.stringify(validationResult));
    if (!validationResult.isValid) {
      return {
        success: false,
        message: validationResult.errors[0] || 'Validation failed'
      };
    }

    // Check for duplicate invoice
    Logger.log('About to call checkForDuplicateInvoice with: ' + invoiceData.invoiceNumber + ' / ' + invoiceData.invoiceDate);
    if (checkForDuplicateInvoice(invoiceData.invoiceNumber, invoiceData.invoiceDate)) {
      Logger.log('DUPLICATE DETECTED - returning error');
      return {
        success: false,
        message: 'An invoice with this number and date already exists'
      };
    }
    Logger.log('No duplicate found - continuing with submission');

    // Calculate total
    const total = calculateTotal(
      invoiceData.flowerCost,
      invoiceData.botanicalsCost,
      invoiceData.suppliesCost,
      invoiceData.greensCost,
      invoiceData.miscellaneousCost,
      invoiceData.invoiceCredits
    );

    // Append to sheet
    const invoiceId = appendInvoice({
      ...invoiceData,
      total: total
    });

    Logger.log('Invoice submitted successfully. ID: ' + invoiceId);

    return {
      success: true,
      message: 'Invoice submitted successfully',
      invoiceId: invoiceId
    };
  } catch (error) {
    Logger.log('Error in submitInvoice: ' + error);
    return {
      success: false,
      message: 'An error occurred while saving the invoice: ' + error
    };
  }
}

/**
 * searchInvoices - Searches for invoices by number or date range
 * @param {string} searchType - 'number' or 'dateRange'
 * @param {*} searchValue - The search criteria (string for number, object for date range)
 * @return {Array} Array of matching invoice objects
 */
function searchInvoices(searchType, searchValue) {
  Logger.log('=== searchInvoices CALLED === [VERSION 2025-11-12-ARRAY-ONLY]');
  Logger.log('searchType: ' + searchType);
  Logger.log('searchValue: ' + JSON.stringify(searchValue));
  
  try {
    let results = [];
    
    if (searchType === 'number') {
      Logger.log('Calling searchByInvoiceNumberV2 with: ' + searchValue);
      results = searchByInvoiceNumberV2(searchValue);
      Logger.log('searchByInvoiceNumberV2 returned, type: ' + typeof results);
      Logger.log('Is array: ' + Array.isArray(results));
      if (results) {
        Logger.log('Results length: ' + results.length);
      }
    } else if (searchType === 'dateRange') {
      Logger.log('Calling searchByDateRangeV2');
      results = searchByDateRangeV2(searchValue.from, searchValue.to);
      Logger.log('searchByDateRangeV2 returned, type: ' + typeof results);
      Logger.log('Is array: ' + Array.isArray(results));
      if (results) {
        Logger.log('Results length: ' + results.length);
      }
    }
    
    // Ensure results is an array
    if (!Array.isArray(results)) {
      Logger.log('WARNING: results is not an array, setting to empty array');
      results = [];
    }
    
    Logger.log('RETURNING DIRECT ARRAY: ' + results.length + ' items');
    Logger.log('Array is array: ' + Array.isArray(results));
    
    // Return array DIRECTLY without wrapping
    // The frontend will handle creating the response wrapper
    return results;
  } catch (error) {
    Logger.log('ERROR in searchInvoices: ' + error);
    Logger.log('Error message: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    return [];
  }
}

/**
 * updateInvoice - Updates an existing invoice
 * @param {Object} updatedData - The updated invoice data
 * @return {Object} {success: boolean, message: string}
 */
function updateInvoice(updatedData) {
  try {
    // Validate input
    if (!updatedData.id) {
      return {
        success: false,
        message: 'Invoice ID is required'
      };
    }

    // Validate invoice date
    if (!updatedData.invoiceDate || updatedData.invoiceDate === '') {
      return {
        success: false,
        message: 'Invoice date is required'
      };
    }

    // Calculate new total
    const newTotal = calculateTotal(
      updatedData.flowerCost,
      updatedData.botanicalsCost,
      updatedData.suppliesCost,
      updatedData.greensCost,
      updatedData.miscellaneousCost,
      updatedData.invoiceCredits
    );

    // Update row
    updateInvoiceRow(updatedData.id, {
      invoiceDate: updatedData.invoiceDate,
      vendor: updatedData.vendor,
      flowerCost: updatedData.flowerCost,
      botanicalsCost: updatedData.botanicalsCost,
      suppliesCost: updatedData.suppliesCost,
      greensCost: updatedData.greensCost,
      miscellaneousCost: updatedData.miscellaneousCost,
      invoiceCredits: updatedData.invoiceCredits,
      total: newTotal,
      isWedding: updatedData.isWedding,
      isFuneral: updatedData.isFuneral,
      isParty: updatedData.isParty,
      isStoreStock: updatedData.isStoreStock
    });

    Logger.log('Invoice updated successfully. ID: ' + updatedData.id);

    return {
      success: true,
      message: 'Invoice updated successfully'
    };
  } catch (error) {
    Logger.log('Error in updateInvoice: ' + error);
    return {
      success: false,
      message: 'An error occurred while updating the invoice: ' + error
    };
  }
}

/**
 * getInvoiceById - Retrieves a single invoice by ID
 * @param {string} invoiceId - The invoice ID
 * @return {Object} The invoice object or null
 */
function getInvoiceById(invoiceId) {
  try {
    return getInvoiceDataById(invoiceId);
  } catch (error) {
    Logger.log('Error in getInvoiceById: ' + error);
    return null;
  }
}

/**
 * getAllInvoices - Retrieves all active invoices
 * @return {Array} Array of all active invoice objects
 */
function getAllInvoices() {
  try {
    return getAllActiveInvoices();
  } catch (error) {
    Logger.log('Error in getAllInvoices: ' + error);
    return [];
  }
}

/**
 * getVendors - Retrieves all vendors from the Vendors sheet
 * @return {Array} Array of vendor names
 */
function getVendors() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const vendorSheet = spreadsheet.getSheetByName('Vendors');
    
    if (!vendorSheet) {
      Logger.log('Vendors sheet not found');
      return [];
    }
    
    const data = vendorSheet.getDataRange().getValues();
    Logger.log('Vendor sheet data rows: ' + data.length);
    Logger.log('Full vendor data: ' + JSON.stringify(data));
    
    const vendors = [];
    
    // Skip header row (row 1 = index 0)
    for (let i = 1; i < data.length; i++) {
      const vendorName = data[i][0]; // First column is vendor name
      if (vendorName && vendorName.trim() !== '') {
        vendors.push(vendorName);
        Logger.log('Added vendor: ' + vendorName);
      }
    }
    
    Logger.log('Final vendors array: ' + JSON.stringify(vendors));
    Logger.log('Total vendors: ' + vendors.length);
    
    // Return unique vendors sorted alphabetically
    return [...new Set(vendors)].sort();
  } catch (error) {
    Logger.log('Error in getVendors: ' + error);
    Logger.log('Stack: ' + error.stack);
    return [];
  }
}

/**
 * addNewVendor - Adds a new vendor if it doesn't exist
 * @param {string} vendorName - The vendor name to add
 * @return {Object} {success: boolean, message: string}
 */
function addNewVendor(vendorName) {
  try {
    const trimmedName = sanitizeInput(vendorName).trim();
    
    if (!trimmedName || trimmedName.length === 0) {
      return {
        success: false,
        message: 'Vendor name cannot be empty'
      };
    }

    if (trimmedName.length > 100) {
      return {
        success: false,
        message: 'Vendor name must be 100 characters or less'
      };
    }

    const wasAdded = appendVendor(trimmedName);
    
    if (wasAdded) {
      return {
        success: true,
        message: 'Vendor added successfully'
      };
    } else {
      return {
        success: false,
        message: 'Vendor already exists'
      };
    }
  } catch (error) {
    Logger.log('Error in addNewVendor: ' + error);
    return {
      success: false,
      message: 'An error occurred while adding the vendor: ' + error
    };
  }
}

/**
 * initializeVendorsSheet - DEBUG FUNCTION: Initialize and verify Vendors sheet
 * Run this from the Apps Script console to test vendor sheet setup
 */
function initializeVendorsSheet() {
  try {
    Logger.log('=== VENDOR SHEET INITIALIZATION DEBUG ===');
    
    // Get/Create vendors sheet
    const sheet = getVendorsSheet();
    Logger.log('Vendors sheet found or created: ' + sheet.getName());
    
    // Get all vendors
    const vendors = getAllVendors();
    Logger.log('Current vendors in sheet: ' + JSON.stringify(vendors));
    Logger.log('Number of vendors: ' + vendors.length);
    
    // Check if DV Flora and Product Junction exist
    if (!vendors.includes('DV Flora')) {
      Logger.log('Adding DV Flora...');
      appendVendor('DV Flora');
    } else {
      Logger.log('DV Flora already exists');
    }
    
    if (!vendors.includes('Product Junction')) {
      Logger.log('Adding Product Junction...');
      appendVendor('Product Junction');
    } else {
      Logger.log('Product Junction already exists');
    }
    
    // Final verification
    const finalVendors = getAllVendors();
    Logger.log('Final vendors list: ' + JSON.stringify(finalVendors));
    Logger.log('=== INITIALIZATION COMPLETE ===');
    
    return {
      success: true,
      vendors: finalVendors,
      message: 'Vendors sheet initialized successfully'
    };
  } catch (error) {
    Logger.log('ERROR in initializeVendorsSheet: ' + error);
    return {
      success: false,
      message: 'Error: ' + error
    };
  }
}

/**
 * setupAllSheets - MASTER SETUP FUNCTION
 * Run this once from the console to set up everything
 */
function setupAllSheets() {
  Logger.log('========================================');
  Logger.log('MASTER SETUP - INITIALIZING ALL SHEETS');
  Logger.log('========================================');
  
  try {
    // Step 1: Initialize Invoices sheet
    Logger.log('\n[1/3] Initializing Invoices sheet...');
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let invoiceSheet = spreadsheet.getSheetByName('Invoices');
    
    if (!invoiceSheet) {
      invoiceSheet = spreadsheet.insertSheet('Invoices');
      Logger.log('Created new Invoices sheet');
    } else {
      Logger.log('Invoices sheet already exists');
    }
    
    // Add headers if they don't exist
    const invoiceLastColumn = invoiceSheet.getLastColumn();
    
    if (invoiceLastColumn === 0) {
      // Sheet is completely empty, add headers
      const headers = [
        'ID', 'Invoice Number', 'Invoice Date', 'Vendor', 'Flower Cost', 
        'Supplies Cost', 'Greens Cost', 'Invoice Credits', 'Total Due', 'Status',
        'Created Timestamp', 'Last Modified Timestamp', 'Created By', 'Last Modified By'
      ];
      invoiceSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format header row
      const headerRange = invoiceSheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#ec4899');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
      Logger.log('Added headers to Invoices sheet');
    } else {
      // Sheet has data, check if first cell is empty
      const firstRow = invoiceSheet.getRange(1, 1, 1, invoiceLastColumn).getValues()[0];
      if (!firstRow[0] || firstRow[0] === '') {
        const headers = [
          'ID', 'Invoice Number', 'Invoice Date', 'Vendor', 'Flower Cost', 
          'Supplies Cost', 'Greens Cost', 'Invoice Credits', 'Total Due', 'Status',
          'Created Timestamp', 'Last Modified Timestamp', 'Created By', 'Last Modified By'
        ];
        invoiceSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        
        // Format header row
        const headerRange = invoiceSheet.getRange(1, 1, 1, headers.length);
        headerRange.setBackground('#ec4899');
        headerRange.setFontColor('white');
        headerRange.setFontWeight('bold');
        Logger.log('Added headers to Invoices sheet');
      } else {
        Logger.log('Headers already exist in Invoices sheet');
      }
    }
    Logger.log('✓ Invoices sheet ready');
    
    // Step 2: Initialize Vendors sheet
    Logger.log('\n[2/3] Initializing Vendors sheet...');
    let vendorSheet = spreadsheet.getSheetByName('Vendors');
    
    if (!vendorSheet) {
      vendorSheet = spreadsheet.insertSheet('Vendors');
      Logger.log('Created new Vendors sheet');
    } else {
      Logger.log('Vendors sheet already exists');
    }
    
    // Add headers if they don't exist
    const vendorLastColumn = vendorSheet.getLastColumn();
    
    if (vendorLastColumn === 0) {
      // Sheet is completely empty, add headers
      const vendorHeaders = ['Vendor Name', 'Created Timestamp', 'Created By'];
      vendorSheet.getRange(1, 1, 1, vendorHeaders.length).setValues([vendorHeaders]);
      
      // Format header row
      const vendorHeaderRange = vendorSheet.getRange(1, 1, 1, vendorHeaders.length);
      vendorHeaderRange.setBackground('#8b5cf6');
      vendorHeaderRange.setFontColor('white');
      vendorHeaderRange.setFontWeight('bold');
      Logger.log('Added headers to Vendors sheet');
    } else {
      // Sheet has data, check if first cell is empty
      const vendorFirstRow = vendorSheet.getRange(1, 1, 1, vendorLastColumn).getValues()[0];
      if (!vendorFirstRow[0] || vendorFirstRow[0] === '') {
        const vendorHeaders = ['Vendor Name', 'Created Timestamp', 'Created By'];
        vendorSheet.getRange(1, 1, 1, vendorHeaders.length).setValues([vendorHeaders]);
        
        // Format header row
        const vendorHeaderRange = vendorSheet.getRange(1, 1, 1, vendorHeaders.length);
        vendorHeaderRange.setBackground('#8b5cf6');
        vendorHeaderRange.setFontColor('white');
        vendorHeaderRange.setFontWeight('bold');
        Logger.log('Added headers to Vendors sheet');
      } else {
        Logger.log('Headers already exist in Vendors sheet');
      }
    }
    
    // Add default vendors if sheet is empty
    const vendorData = vendorSheet.getDataRange().getValues();
    if (vendorData.length <= 1) {  // Only header row
      const userEmail = Session.getEffectiveUser().getEmail();
      const timestamp = new Date().toISOString();
      
      Logger.log('Adding default vendors...');
      vendorSheet.appendRow(['DV Flora', timestamp, userEmail]);
      vendorSheet.appendRow(['Product Junction', timestamp, userEmail]);
      Logger.log('✓ Default vendors added');
    } else {
      Logger.log('Vendors already exist in sheet');
    }
    Logger.log('✓ Vendors sheet ready');
    
    // Step 3: Verify everything
    Logger.log('\n[3/3] Verifying setup...');
    const vendors = getAllVendors();
    
    Logger.log('✓ Invoice sheet: ' + invoiceSheet.getName());
    Logger.log('✓ Vendor sheet: ' + vendorSheet.getName());
    Logger.log('✓ Vendors in list: ' + vendors.length);
    Logger.log('✓ Vendor names: ' + JSON.stringify(vendors));
    
    Logger.log('\n========================================');
    Logger.log('SETUP COMPLETE - ALL SYSTEMS READY');
    Logger.log('========================================');
    
    return {
      success: true,
      message: 'All sheets initialized successfully',
      vendors: vendors
    };
  } catch (error) {
    Logger.log('\n✗ SETUP FAILED: ' + error);
    Logger.log('Stack: ' + error.stack);
    return {
      success: false,
      message: 'Setup failed: ' + error
    };
  }
}

/**
 * Helper Functions for Invoice Management
 */

function checkForDuplicateInvoice(invoiceNumber, invoiceDate) {
  try {
    Logger.log('=== checkForDuplicateInvoice START ===');
    Logger.log('Parameters: ' + invoiceNumber + ' / ' + invoiceDate);
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Invoices');
    const values = sheet.getDataRange().getValues();
    
    Logger.log('Rows in sheet: ' + values.length);
    
    for (let i = 1; i < values.length; i++) {
      const num = values[i][1];
      const date = values[i][2];
      
      let dateStr = '';
      if (date instanceof Date) {
        const y = date.getUTCFullYear();
        const m = String(date.getUTCMonth() + 1).padStart(2, '0');
        const d = String(date.getUTCDate()).padStart(2, '0');
        dateStr = y + '-' + m + '-' + d;
      }
      
      if (num === invoiceNumber && dateStr === invoiceDate) {
        Logger.log('DUPLICATE FOUND');
        return true;
      }
    }
    
    Logger.log('No duplicate');
    return false;
  } catch (e) {
    Logger.log('ERROR: ' + e.message);
    return false;
  }
}

/**
 * checkInvoiceNumberExists - Checks if an invoice number already exists (for real-time validation)
 * @param {string} invoiceNumber - The invoice number to check
 * @return {boolean} True if invoice number exists, false otherwise
 */
function checkInvoiceNumberExists(invoiceNumber) {
  try {
    Logger.log('=== checkInvoiceNumberExists START ===');
    Logger.log('Checking invoice number: ' + invoiceNumber);
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Invoices');
    
    if (!sheet) {
      Logger.log('Invoices sheet not found');
      return false;
    }
    
    const values = sheet.getDataRange().getValues();
    Logger.log('Total rows in sheet: ' + values.length);
    
    // Skip header row, check column B (index 1) for invoice numbers
    for (let i = 1; i < values.length; i++) {
      const existingNumber = values[i][1]; // Column B = Invoice Number
      
      if (existingNumber === invoiceNumber) {
        Logger.log('DUPLICATE INVOICE NUMBER FOUND at row ' + (i + 1));
        return true;
      }
    }
    
    Logger.log('No duplicate invoice number found');
    return false;
  } catch (e) {
    Logger.log('ERROR in checkInvoiceNumberExists: ' + e.message);
    return false;
  }
}

function validateAllFields(data) {
  const errors = [];
  let isValid = true;
  
  if (!data.invoiceNumber || data.invoiceNumber.trim() === '') {
    errors.push('Invoice number is required');
    isValid = false;
  } else if (data.invoiceNumber.length > 50) {
    errors.push('Invoice number must be 50 characters or less');
    isValid = false;
  } else if (!/^[a-zA-Z0-9\-_]+$/.test(data.invoiceNumber)) {
    errors.push('Invoice number can only contain alphanumeric characters, hyphens, and underscores');
    isValid = false;
  }
  
  if (!data.invoiceDate) {
    errors.push('Invoice date is required');
    isValid = false;
  }
  
  if (!data.vendor || data.vendor.trim() === '') {
    errors.push('Vendor is required');
    isValid = false;
  } else if (data.vendor.length > 100) {
    errors.push('Vendor name must be 100 characters or less');
    isValid = false;
  }
  
  return { isValid, errors };
}

function calculateTotal(flowerCost, botanicalsCost, suppliesCost, greensCost, miscellaneousCost, invoiceCredits) {
  return flowerCost + botanicalsCost + suppliesCost + greensCost + miscellaneousCost - invoiceCredits;
}

function appendInvoice(invoiceData) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const invoiceSheet = spreadsheet.getSheetByName('Invoices');
    
    if (!invoiceSheet) {
      throw new Error('Invoices sheet not found');
    }
    
    const invoiceId = Utilities.getUuid();
    const userEmail = Session.getEffectiveUser().getEmail();
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MM/dd/yyyy HH:mm:ss');
    
    // Build the row with core invoice data (columns A-P only)
    // Let Google Sheets table auto-fill handle columns Q-BK (formulas)
    // Manually set event type flags in columns BL-BO (64-67) after append
    const newRow = [
      invoiceId,                              // A: ID
      invoiceData.invoiceNumber,              // B: Invoice Number
      invoiceData.invoiceDate,                // C: Invoice Date
      invoiceData.vendor,                     // D: Vendor
      invoiceData.flowerCost,                 // E: Flower Cost
      invoiceData.botanicalsCost,             // F: Botanicals Cost
      invoiceData.suppliesCost,               // G: Supplies Cost
      invoiceData.greensCost,                 // H: Greens Cost
      invoiceData.miscellaneousCost,          // I: Miscellaneous Cost
      invoiceData.invoiceCredits,             // J: Invoice Credits
      invoiceData.total,                      // K: Total Due
      'Active',                               // L: Status
      timestamp,                              // M: Created Timestamp
      timestamp,                              // N: Last Modified Timestamp
      userEmail,                              // O: Created By
      userEmail                               // P: Last Modified By
    ];
    
    invoiceSheet.appendRow(newRow);
    
    // Set event type flags in columns BL-BO (64-67) for the newly appended row
    const lastRow = invoiceSheet.getLastRow();
    invoiceSheet.getRange(lastRow, 64).setValue(invoiceData.isWedding || 0);      // BL: isWedding
    invoiceSheet.getRange(lastRow, 65).setValue(invoiceData.isFuneral || 0);      // BM: isFuneral
    invoiceSheet.getRange(lastRow, 66).setValue(0);                               // BN: isHoliday (retained, not used)
    invoiceSheet.getRange(lastRow, 67).setValue(invoiceData.isParty || 0);        // BO: isParty
    
    return invoiceId;
  } catch (error) {
    Logger.log('Error in appendInvoice: ' + error);
    throw error;
  }
}

function updateInvoiceRow(invoiceId, updatedData) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const invoiceSheet = spreadsheet.getSheetByName('Invoices');
    
    if (!invoiceSheet) {
      throw new Error('Invoices sheet not found');
    }
    
    const data = invoiceSheet.getDataRange().getValues();
    const userEmail = Session.getEffectiveUser().getEmail();
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MM/dd/yyyy HH:mm:ss');
    
    // Find the row with matching invoiceId
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === invoiceId) {
        // Update the row
        const rowNumber = i + 1; // Sheets are 1-indexed
        
        invoiceSheet.getRange(rowNumber, 3).setValue(updatedData.invoiceDate); // Invoice Date (C)
        invoiceSheet.getRange(rowNumber, 4).setValue(updatedData.vendor); // Vendor (D)
        invoiceSheet.getRange(rowNumber, 5).setValue(updatedData.flowerCost); // Flower Cost (E)
        invoiceSheet.getRange(rowNumber, 6).setValue(updatedData.botanicalsCost); // Botanicals Cost (F)
        invoiceSheet.getRange(rowNumber, 7).setValue(updatedData.suppliesCost); // Supplies Cost (G)
        invoiceSheet.getRange(rowNumber, 8).setValue(updatedData.greensCost); // Greens Cost (H)
        invoiceSheet.getRange(rowNumber, 9).setValue(updatedData.miscellaneousCost); // Miscellaneous Cost (I)
        invoiceSheet.getRange(rowNumber, 10).setValue(updatedData.invoiceCredits); // Invoice Credits (J)
        invoiceSheet.getRange(rowNumber, 11).setValue(updatedData.total); // Total Due (K)
        invoiceSheet.getRange(rowNumber, 14).setValue(timestamp); // Last Modified Timestamp (N)
        invoiceSheet.getRange(rowNumber, 16).setValue(userEmail); // Last Modified By (P)
        
        // Update event type flags (columns 64-67: BL-BO)
        // Use the values directly since client sends 1 or 0 explicitly
        Logger.log('>>> updateInvoiceRow event flags: Wedding=' + updatedData.isWedding + ', Funeral=' + updatedData.isFuneral + ', Party=' + updatedData.isParty);
        invoiceSheet.getRange(rowNumber, 64).setValue(updatedData.isWedding); // BL: isWedding
        invoiceSheet.getRange(rowNumber, 65).setValue(updatedData.isFuneral); // BM: isFuneral
        // Column 66 (BN: isHoliday) retained but not updated from UI
        invoiceSheet.getRange(rowNumber, 67).setValue(updatedData.isParty); // BO: isParty
        
        return true;
      }
    }
    
    throw new Error('Invoice not found');
  } catch (error) {
    Logger.log('Error in updateInvoiceRow: ' + error);
    throw error;
  }
}

// Helper function to build invoice object from row data
function buildInvoiceObject(rowData, rowIndex) {
  const invoiceDateObj = rowData[2];
  const createdTimestampObj = rowData[12];
  
  let invoiceDateStr = String(invoiceDateObj);
  let createdTimestampStr = String(createdTimestampObj);
  
  // Convert Date objects to YYYY-MM-DD format using getFullYear/getMonth/getDate
  try {
    if (invoiceDateObj && typeof invoiceDateObj === 'object' && invoiceDateObj.getTime) {
      const year = invoiceDateObj.getFullYear();
      const month = String(invoiceDateObj.getMonth() + 1).padStart(2, '0');
      const day = String(invoiceDateObj.getDate()).padStart(2, '0');
      invoiceDateStr = year + '-' + month + '-' + day;
      Logger.log('>>> Invoice Date: Raw=' + invoiceDateObj + ' | Formatted=' + invoiceDateStr);
    }
  } catch (e) {
    Logger.log('>>> Could not convert invoiceDate: ' + e);
  }
  
  try {
    if (createdTimestampObj && typeof createdTimestampObj === 'object' && createdTimestampObj.getTime) {
      // Format the timestamp as readable string: "Nov 12, 2025, 2:47 PM"
      createdTimestampStr = Utilities.formatDate(createdTimestampObj, Session.getScriptTimeZone(), 'MMM dd, yyyy, h:mm a');
    }
  } catch (e) {
    Logger.log('>>> Could not convert createdTimestamp: ' + e);
  }
  
  return {
    id: String(rowData[0]),
    invoiceNumber: String(rowData[1]),
    invoiceDate: invoiceDateStr,
    vendor: String(rowData[3]),
    flowerCost: Number(rowData[4]),
    botanicalsCost: Number(rowData[5]) || 0,
    suppliesCost: Number(rowData[6]),
    greensCost: Number(rowData[7]),
    miscellaneousCost: Number(rowData[8]) || 0,
    invoiceCredits: Number(rowData[9]),
    total: Number(rowData[10]),
    createdTimestamp: createdTimestampStr,
    isWedding: rowData.length > 63 ? Number(rowData[63]) || 0 : 0,      // BL (column 64, index 63)
    isFuneral: rowData.length > 64 ? Number(rowData[64]) || 0 : 0,      // BM (column 65, index 64)
    // isHoliday at BN (column 66, index 65) - retained but not returned
    isParty: rowData.length > 66 ? Number(rowData[66]) || 0 : 0         // BO (column 67, index 66)
  };
}

function searchByInvoiceNumberV2(searchTerm) {
  try {
    Logger.log('>>> searchByInvoiceNumberV2 START - searchTerm: ' + searchTerm);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const invoiceSheet = spreadsheet.getSheetByName('Invoices');
    
    if (!invoiceSheet) {
      Logger.log('>>> ERROR: Invoices sheet not found');
      return [];
    }
    
    const data = invoiceSheet.getDataRange().getValues();
    Logger.log('>>> Data range has ' + data.length + ' rows');
    
    const searchLower = searchTerm.toLowerCase();
    const plainResults = [];
    
    for (let i = 1; i < data.length; i++) {
      const invoiceNumber = String(data[i][1]).toLowerCase();
      if (invoiceNumber.includes(searchLower)) {
        const invoiceObj = buildInvoiceObject(data[i], i);
        plainResults.push(invoiceObj);
        Logger.log('>>> Added invoice: ' + invoiceObj.invoiceNumber + ' | Wedding=' + invoiceObj.isWedding + ', Funeral=' + invoiceObj.isFuneral + ', Party=' + invoiceObj.isParty);
      }
    }
    
    Logger.log('>>> Found ' + plainResults.length + ' results');
    Logger.log('>>> plainResults type: ' + typeof plainResults);
    Logger.log('>>> plainResults is array: ' + Array.isArray(plainResults));
    
    return plainResults;
  } catch (error) {
    Logger.log('>>> ERROR in searchByInvoiceNumberV2: ' + error.toString());
    Logger.log('>>> Stack: ' + error.stack);
    return [];
  }
}

function searchByDateRangeV2(fromDate, toDate) {
  try {
    Logger.log('>>> searchByDateRangeV2 START');
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const invoiceSheet = spreadsheet.getSheetByName('Invoices');
    
    if (!invoiceSheet) {
      Logger.log('>>> ERROR: Invoices sheet not found');
      return [];
    }
    
    const data = invoiceSheet.getDataRange().getValues();
    Logger.log('>>> Data range has ' + data.length + ' rows');
    
    const plainResults = [];
    
    // Parse dates in script timezone to avoid UTC issues
    const scriptTimezone = Session.getScriptTimeZone();
    const from = new Date(fromDate + 'T00:00:00');
    const to = new Date(toDate + 'T23:59:59');
    
    Logger.log('>>> Script timezone: ' + scriptTimezone);
    Logger.log('>>> Searching from ' + from + ' to ' + to);
    
    for (let i = 1; i < data.length; i++) {
      const invoiceDateRaw = data[i][2];
      Logger.log('>>> Row ' + i + ' Invoice Date raw: ' + invoiceDateRaw + ' | Type: ' + typeof invoiceDateRaw);
      
      const invoiceDate = new Date(invoiceDateRaw);
      Logger.log('>>> Row ' + i + ' Invoice Date parsed: ' + invoiceDate);
      Logger.log('>>> Row ' + i + ' Comparison: ' + invoiceDate + ' >= ' + from + ' && ' + invoiceDate + ' <= ' + to + ' = ' + (invoiceDate >= from && invoiceDate <= to));
      
      if (invoiceDate >= from && invoiceDate <= to) {
        const invoiceObj = buildInvoiceObject(data[i], i);
        plainResults.push(invoiceObj);
        Logger.log('>>> Added invoice: ' + invoiceObj.invoiceNumber + ' | Wedding=' + invoiceObj.isWedding + ', Funeral=' + invoiceObj.isFuneral + ', Party=' + invoiceObj.isParty);
      }
    }
    
    Logger.log('>>> Found ' + plainResults.length + ' results');
    Logger.log('>>> plainResults type: ' + typeof plainResults);
    Logger.log('>>> plainResults is array: ' + Array.isArray(plainResults));
    
    return plainResults;
  } catch (error) {
    Logger.log('>>> ERROR in searchByDateRangeV2: ' + error.toString());
    Logger.log('>>> Stack: ' + error.stack);
    return [];
  }
}

function getInvoiceDataById(invoiceId) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const invoiceSheet = spreadsheet.getSheetByName('Invoices');
    
    if (!invoiceSheet) {
      return null;
    }
    
    const data = invoiceSheet.getDataRange().getValues();
    
    // Skip header row
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === invoiceId) {
        return {
          id: data[i][0],
          invoiceNumber: data[i][1],
          invoiceDate: data[i][2],
          vendor: data[i][3],
          flowerCost: data[i][4],
          suppliesCost: data[i][5],
          greensCost: data[i][6],
          miscellaneousCost: data[i][7] || 0,
          invoiceCredits: data[i][8],
          total: data[i][9],
          createdTimestamp: data[i][11]
        };
      }
    }
    
    return null;
  } catch (error) {
    Logger.log('Error in getInvoiceDataById: ' + error);
    return null;
  }
}

function getAllActiveInvoices() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const invoiceSheet = spreadsheet.getSheetByName('Invoices');
    
    if (!invoiceSheet) {
      return [];
    }
    
    const data = invoiceSheet.getDataRange().getValues();
    const results = [];
    
    // Skip header row
    for (let i = 1; i < data.length; i++) {
      if (data[i][10] === 'Active') { // Status column (shifted by 1)
        results.push({
          id: data[i][0],
          invoiceNumber: data[i][1],
          invoiceDate: data[i][2],
          vendor: data[i][3],
          flowerCost: data[i][4],
          suppliesCost: data[i][5],
          greensCost: data[i][6],
          miscellaneousCost: data[i][7] || 0,
          invoiceCredits: data[i][8],
          total: data[i][9],
          createdTimestamp: data[i][11]
        });
      }
    }
    
    return results;
  } catch (error) {
    Logger.log('Error in getAllActiveInvoices: ' + error);
    return [];
  }
}

function getVendorsSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let vendorSheet = spreadsheet.getSheetByName('Vendors');
  
  if (!vendorSheet) {
    vendorSheet = spreadsheet.insertSheet('Vendors');
    const headers = ['Vendor Name', 'Created Timestamp', 'Created By'];
    vendorSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  
  return vendorSheet;
}

function getAllVendors() {
  try {
    const sheet = getVendorsSheet();
    const data = sheet.getDataRange().getValues();
    const vendors = [];
    
    // Skip header row
    for (let i = 1; i < data.length; i++) {
      const vendorName = data[i][0];
      if (vendorName && vendorName.trim() !== '') {
        vendors.push(vendorName);
      }
    }
    
    return [...new Set(vendors)].sort();
  } catch (error) {
    Logger.log('Error in getAllVendors: ' + error);
    return [];
  }
}

function appendVendor(vendorName) {
  try {
    const trimmedName = vendorName.trim();
    const vendors = getAllVendors();
    
    // Check if vendor already exists
    if (vendors.some(v => v.toLowerCase() === trimmedName.toLowerCase())) {
      return false;
    }
    
    const sheet = getVendorsSheet();
    const userEmail = Session.getEffectiveUser().getEmail();
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MM/dd/yyyy HH:mm:ss');
    
    sheet.appendRow([trimmedName, timestamp, userEmail]);
    return true;
  } catch (error) {
    Logger.log('Error in appendVendor: ' + error);
    return false;
  }
}

function sanitizeInput(input) {
  try {
    return String(input).trim();
  } catch (error) {
    return '';
  }
}
