/**
 * SheetOperations.gs - Data Access Layer for Google Sheets
 * Handles all read/write operations to the Invoices sheet
 */

// Constants
const SHEET_NAME = 'Invoices';
const VENDORS_SHEET_NAME = 'Vendors';
const COLUMN_HEADERS = {
  ID: 0,
  INVOICE_NUMBER: 1,
  INVOICE_DATE: 2,
  VENDOR: 3,
  FLOWER_COST: 4,
  SUPPLIES_COST: 5,
  GREENS_COST: 6,
  INVOICE_CREDITS: 7,
  TOTAL_DUE: 8,
  STATUS: 9,
  CREATED_TIMESTAMP: 10,
  LAST_MODIFIED_TIMESTAMP: 11,
  CREATED_BY: 12,
  LAST_MODIFIED_BY: 13
};

const VENDOR_COLUMN_HEADERS = {
  VENDOR_NAME: 0,
  CREATED_TIMESTAMP: 1,
  CREATED_BY: 2
};

/**
 * initializeSheets - Ensures both Invoices and Vendors sheets exist with proper headers
 * Call this once on first deployment
 */
function initializeSheets() {
  Logger.log('=== INITIALIZING SHEETS ===');
  
  try {
    // Initialize Invoices sheet
    const invoiceSheet = getSheetData();
    Logger.log('Invoices sheet ready: ' + invoiceSheet.getName());
    
    // Initialize Vendors sheet
    const vendorSheet = getVendorsSheet();
    Logger.log('Vendors sheet ready: ' + vendorSheet.getName());
    
    // Verify headers exist
    const invoiceHeaders = invoiceSheet.getRange(1, 1, 1, invoiceSheet.getLastColumn()).getValues();
    Logger.log('Invoice headers: ' + JSON.stringify(invoiceHeaders[0]));
    
    const vendorHeaders = vendorSheet.getRange(1, 1, 1, vendorSheet.getLastColumn()).getValues();
    Logger.log('Vendor headers: ' + JSON.stringify(vendorHeaders[0]));
    
    Logger.log('=== SHEETS INITIALIZED SUCCESSFULLY ===');
    return true;
  } catch (error) {
    Logger.log('ERROR initializing sheets: ' + error);
    return false;
  }
}

/**
 * getSheetData - Returns the Invoices sheet object
 * @return {Sheet} The Invoices sheet
 */
function getSheetData() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    createSheetHeaders(sheet);
  }

  return sheet;
}

/**
 * createSheetHeaders - Creates the header row in the Invoices sheet
 * @param {Sheet} sheet - The Invoices sheet
 */
function createSheetHeaders(sheet) {
  const headers = [
    'ID',
    'Invoice Number',
    'Invoice Date',
    'Vendor',
    'Flower Cost',
    'Supplies Cost',
    'Greens Cost',
    'Invoice Credits',
    'Total Due',
    'Status',
    'Created Timestamp',
    'Last Modified Timestamp',
    'Created By',
    'Last Modified By'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#ec4899');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');

  // Set column widths
  sheet.setColumnWidth(1, 150);  // ID
  sheet.setColumnWidth(2, 150);  // Invoice Number
  sheet.setColumnWidth(3, 120);  // Invoice Date
  sheet.setColumnWidth(4, 150);  // Vendor
  sheet.setColumnWidth(5, 120);  // Flower Cost
  sheet.setColumnWidth(6, 140);  // Supplies Cost
  sheet.setColumnWidth(7, 120);  // Greens Cost
  sheet.setColumnWidth(8, 150);  // Invoice Credits
  sheet.setColumnWidth(9, 120);  // Total Due
  sheet.setColumnWidth(10, 100); // Status
  sheet.setColumnWidth(11, 180); // Created Timestamp
  sheet.setColumnWidth(12, 180); // Last Modified Timestamp
  sheet.setColumnWidth(13, 150); // Created By
  sheet.setColumnWidth(14, 150); // Last Modified By
}

/**
 * appendInvoice - Adds a new invoice row to the Invoices sheet
 * @param {Object} invoiceData - The invoice data
 * @return {string} The generated invoice ID
 */
function appendInvoice(invoiceData) {
  const sheet = getSheetData();
  const invoiceId = generateUUID();
  const userEmail = Session.getEffectiveUser().getEmail();
  const timestamp = getCurrentTimestamp();

  const row = [
    invoiceId,
    sanitizeInput(invoiceData.invoiceNumber),
    invoiceData.invoiceDate,
    sanitizeInput(invoiceData.vendor),
    invoiceData.flowerCost || 0,
    invoiceData.suppliesCost || 0,
    invoiceData.greensCost || 0,
    invoiceData.invoiceCredits || 0,
    invoiceData.total || 0,
    'ACTIVE',
    timestamp,
    timestamp,
    userEmail,
    userEmail
  ];

  sheet.appendRow(row);

  // Format currency columns for the new row
  const lastRow = sheet.getLastRow();
  const currencyColumns = [4, 5, 6, 7, 8]; // Flower, Supplies, Greens, Credits, Total
  currencyColumns.forEach(col => {
    sheet.getRange(lastRow, col).setNumberFormat('$#,##0.00');
  });

  // Format date column
  sheet.getRange(lastRow, 3).setNumberFormat('yyyy-mm-dd');

  Logger.log('Invoice appended with ID: ' + invoiceId);
  return invoiceId;
}

/**
 * updateInvoiceRow - Updates an existing invoice row
 * @param {string} invoiceId - The invoice ID
 * @param {Object} updatedData - The updated data
 */
function updateInvoiceRow(invoiceId, updatedData) {
  const sheet = getSheetData();
  const data = sheet.getDataRange().getValues();
  const userEmail = Session.getEffectiveUser().getEmail();
  const timestamp = getCurrentTimestamp();

  // Find the row with matching ID
  let targetRow = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][COLUMN_HEADERS.ID] === invoiceId) {
      targetRow = i + 1;
      break;
    }
  }

  if (targetRow === -1) {
    throw new Error('Invoice not found');
  }

  // Update fields
  if (updatedData.vendor) {
    sheet.getRange(targetRow, COLUMN_HEADERS.VENDOR + 1).setValue(updatedData.vendor);
  }
  if (updatedData.invoiceDate) {
    sheet.getRange(targetRow, COLUMN_HEADERS.INVOICE_DATE + 1).setValue(updatedData.invoiceDate);
  }
  if (updatedData.flowerCost !== undefined) {
    sheet.getRange(targetRow, COLUMN_HEADERS.FLOWER_COST + 1).setValue(updatedData.flowerCost);
  }
  if (updatedData.suppliesCost !== undefined) {
    sheet.getRange(targetRow, COLUMN_HEADERS.SUPPLIES_COST + 1).setValue(updatedData.suppliesCost);
  }
  if (updatedData.greensCost !== undefined) {
    sheet.getRange(targetRow, COLUMN_HEADERS.GREENS_COST + 1).setValue(updatedData.greensCost);
  }
  if (updatedData.invoiceCredits !== undefined) {
    sheet.getRange(targetRow, COLUMN_HEADERS.INVOICE_CREDITS + 1).setValue(updatedData.invoiceCredits);
  }
  if (updatedData.total !== undefined) {
    sheet.getRange(targetRow, COLUMN_HEADERS.TOTAL_DUE + 1).setValue(updatedData.total);
  }

  // Update timestamps
  sheet.getRange(targetRow, COLUMN_HEADERS.LAST_MODIFIED_TIMESTAMP + 1).setValue(timestamp);
  sheet.getRange(targetRow, COLUMN_HEADERS.LAST_MODIFIED_BY + 1).setValue(userEmail);

  Logger.log('Invoice updated: ' + invoiceId);
}

/**
 * searchByInvoiceNumber - Searches for invoices by number (partial match)
 * @param {string} invoiceNumber - The invoice number to search for
 * @return {Array} Array of matching invoice objects
 */
function searchByInvoiceNumber(invoiceNumber) {
  const sheet = getSheetData();
  const data = sheet.getDataRange().getValues();
  const results = [];

  const searchTerm = sanitizeInput(invoiceNumber).toUpperCase();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const status = row[COLUMN_HEADERS.STATUS];

    // Only include ACTIVE invoices
    if (status !== 'ACTIVE') continue;

    const invNumber = (row[COLUMN_HEADERS.INVOICE_NUMBER] || '').toString().toUpperCase();

    // Partial match
    if (invNumber.includes(searchTerm)) {
      results.push(rowToInvoiceObject(row));
    }
  }

  return results;
}

/**
 * searchByDateRange - Searches for invoices within a date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @return {Array} Array of matching invoice objects
 */
function searchByDateRange(startDate, endDate) {
  const sheet = getSheetData();
  const data = sheet.getDataRange().getValues();
  const results = [];

  const start = new Date(startDate + 'T00:00:00Z');
  const end = new Date(endDate + 'T23:59:59Z');

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const status = row[COLUMN_HEADERS.STATUS];

    // Only include ACTIVE invoices
    if (status !== 'ACTIVE') continue;

    const invoiceDate = new Date(row[COLUMN_HEADERS.INVOICE_DATE] + 'T00:00:00Z');

    if (invoiceDate >= start && invoiceDate <= end) {
      results.push(rowToInvoiceObject(row));
    }
  }

  // Sort by date descending
  results.sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate));

  return results;
}

/**
 * getInvoiceDataById - Retrieves a single invoice by ID
 * @param {string} invoiceId - The invoice ID
 * @return {Object} The invoice object or null
 */
function getInvoiceDataById(invoiceId) {
  const sheet = getSheetData();
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[COLUMN_HEADERS.ID] === invoiceId) {
      return rowToInvoiceObject(row);
    }
  }

  return null;
}

/**
 * getAllActiveInvoices - Retrieves all active invoices
 * @return {Array} Array of all active invoice objects
 */
function getAllActiveInvoices() {
  const sheet = getSheetData();
  const data = sheet.getDataRange().getValues();
  const results = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[COLUMN_HEADERS.STATUS] === 'ACTIVE') {
      results.push(rowToInvoiceObject(row));
    }
  }

  return results;
}

/**
 * isDuplicateInvoice - Checks if an invoice with the same number and date exists
 * @param {string} invoiceNumber - The invoice number
 * @param {string} invoiceDate - The invoice date
 * @return {boolean} True if duplicate exists
 */
function isDuplicateInvoice(invoiceNumber, invoiceDate) {
  const sheet = getSheetData();
  const data = sheet.getDataRange().getValues();

  const normalizedNumber = sanitizeInput(invoiceNumber).toUpperCase();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const status = row[COLUMN_HEADERS.STATUS];

    if (status === 'ACTIVE') {
      const existingNumber = (row[COLUMN_HEADERS.INVOICE_NUMBER] || '').toString().toUpperCase();
      const existingDate = row[COLUMN_HEADERS.INVOICE_DATE];

      if (existingNumber === normalizedNumber && existingDate === invoiceDate) {
        return true;
      }
    }
  }

  return false;
}

/**
 * rowToInvoiceObject - Converts a sheet row to an invoice object
 * @param {Array} row - The sheet row data
 * @return {Object} The invoice object
 */
function rowToInvoiceObject(row) {
  return {
    id: row[COLUMN_HEADERS.ID],
    invoiceNumber: row[COLUMN_HEADERS.INVOICE_NUMBER],
    invoiceDate: row[COLUMN_HEADERS.INVOICE_DATE],
    vendor: row[COLUMN_HEADERS.VENDOR],
    flowerCost: parseFloat(row[COLUMN_HEADERS.FLOWER_COST]) || 0,
    suppliesCost: parseFloat(row[COLUMN_HEADERS.SUPPLIES_COST]) || 0,
    greensCost: parseFloat(row[COLUMN_HEADERS.GREENS_COST]) || 0,
    invoiceCredits: parseFloat(row[COLUMN_HEADERS.INVOICE_CREDITS]) || 0,
    total: parseFloat(row[COLUMN_HEADERS.TOTAL_DUE]) || 0,
    status: row[COLUMN_HEADERS.STATUS],
    createdTimestamp: row[COLUMN_HEADERS.CREATED_TIMESTAMP],
    lastModifiedTimestamp: row[COLUMN_HEADERS.LAST_MODIFIED_TIMESTAMP],
    createdBy: row[COLUMN_HEADERS.CREATED_BY],
    lastModifiedBy: row[COLUMN_HEADERS.LAST_MODIFIED_BY]
  };
}

/**
 * getVendorsSheet - Returns the Vendors sheet object, creates if needed
 * @return {Sheet} The Vendors sheet
 */
function getVendorsSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(VENDORS_SHEET_NAME);

  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = spreadsheet.insertSheet(VENDORS_SHEET_NAME);
    createVendorSheetHeaders(sheet);
  }

  return sheet;
}

/**
 * createVendorSheetHeaders - Creates the header row in the Vendors sheet
 * @param {Sheet} sheet - The Vendors sheet
 */
function createVendorSheetHeaders(sheet) {
  const headers = [
    'Vendor Name',
    'Created Timestamp',
    'Created By'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#8b5cf6');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');

  // Set column widths
  sheet.setColumnWidth(1, 200);  // Vendor Name
  sheet.setColumnWidth(2, 180);  // Created Timestamp
  sheet.setColumnWidth(3, 150);  // Created By
}

/**
 * getAllVendors - Retrieves all vendors from the Vendors sheet
 * @return {Array} Array of vendor names
 */
function getAllVendors() {
  const sheet = getVendorsSheet();
  const data = sheet.getDataRange().getValues();
  const vendors = [];

  for (let i = 1; i < data.length; i++) {
    const vendorName = data[i][VENDOR_COLUMN_HEADERS.VENDOR_NAME];
    if (vendorName && vendorName.trim() !== '') {
      vendors.push(vendorName);
    }
  }

  // Return unique vendors sorted alphabetically
  return [...new Set(vendors)].sort();
}

/**
 * appendVendor - Adds a new vendor to the Vendors sheet
 * @param {string} vendorName - The vendor name to add
 * @return {boolean} True if vendor was added (not a duplicate)
 */
function appendVendor(vendorName) {
  const sanitizedName = sanitizeInput(vendorName).trim();

  if (!sanitizedName || sanitizedName.length === 0) {
    return false;
  }

  // Check if vendor already exists
  const existingVendors = getAllVendors();
  if (existingVendors.map(v => v.toUpperCase()).includes(sanitizedName.toUpperCase())) {
    return false; // Vendor already exists
  }

  const sheet = getVendorsSheet();
  const userEmail = Session.getEffectiveUser().getEmail();
  const timestamp = getCurrentTimestamp();

  const row = [
    sanitizedName,
    timestamp,
    userEmail
  ];

  sheet.appendRow(row);

  Logger.log('Vendor added: ' + sanitizedName);
  return true;
}

/**
 * searchVendors - Searches vendors by partial name match
 * @param {string} searchTerm - The search term
 * @return {Array} Array of matching vendor names
 */
function searchVendors(searchTerm) {
  const vendors = getAllVendors();
  const lowerTerm = sanitizeInput(searchTerm).toLowerCase();

  return vendors.filter(vendor => 
    vendor.toLowerCase().includes(lowerTerm)
  );
}
