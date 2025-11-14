/**
 * Code.gs - Main Server Logic for Invoice Management App
 * Handles HTTP requests, form submissions, searches, and updates
 * @version 0.97
 */

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
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice Management System</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        :root {
            --primary: #ec4899;
            --primary-dark: #be185d;
            --secondary: #8b5cf6;
            --accent: #06b6d4;
            --success: #10b981;
            --error: #ef4444;
            --warning: #f59e0b;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            transition: background 0.3s ease;
        }

        body.light-mode {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .glass-effect {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
        }

        .dark-mode .glass-effect {
            background: rgba(30, 30, 46, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .gradient-text {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1.5;
            display: inline-block;
            padding-bottom: 8px;
            overflow: visible;
        }

        h1.gradient-text {
            padding: 8px 0 12px 0;
        }

        input, textarea, select {
            transition: all 0.3s ease;
        }

        input:focus, textarea:focus, select:focus {
            box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
            transform: translateY(-2px);
        }

        .input-field {
            position: relative;
        }

        .input-field input, .input-field select {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            font-size: 16px;
            transition: all 0.3s ease;
        }

        .dark-mode .input-field input,
        .dark-mode .input-field select {
            background: #1f1f2e;
            color: #e5e7eb;
            border-color: #404050;
        }

        .input-field input:focus, .input-field select:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
        }

        .vendor-input-wrapper {
            position: relative;
        }

        .vendor-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 2px solid #e5e7eb;
            border-top: none;
            border-radius: 0 0 12px 12px;
            max-height: 250px;
            overflow-y: auto;
            list-style: none;
            margin: 0;
            padding: 8px 0;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .dark-mode .vendor-dropdown {
            background: #1f1f2e;
            border-color: #404050;
        }

        .vendor-dropdown.hidden {
            display: none;
        }

        .vendor-dropdown li {
            padding: 10px 16px;
            cursor: pointer;
            transition: background 0.2s ease;
            color: #374151;
            font-size: 14px;
        }

        .dark-mode .vendor-dropdown li {
            color: #e5e7eb;
        }

        .vendor-dropdown li:hover,
        .vendor-dropdown li.selected {
            background: rgba(236, 72, 153, 0.1);
            color: var(--primary);
        }

        .dark-mode .vendor-dropdown li:hover,
        .dark-mode .vendor-dropdown li.selected {
            background: rgba(236, 72, 153, 0.2);
        }

        .vendor-dropdown li.add-new {
            border-top: 1px solid #e5e7eb;
            color: var(--primary);
            font-weight: 600;
            background: rgba(236, 72, 153, 0.05);
        }

        .dark-mode .vendor-dropdown li.add-new {
            border-top-color: #404050;
            background: rgba(236, 72, 153, 0.1);
        }

        .btn {
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(236, 72, 153, 0.6);
        }

        .btn-primary:active {
            transform: translateY(0);
        }

        .btn-secondary {
            background: transparent;
            color: var(--primary);
            border: 2px solid var(--primary);
        }

        .btn-secondary:hover {
            background: rgba(236, 72, 153, 0.1);
        }

        .btn-danger {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
        }

        .btn-success {
            background: linear-gradient(135deg, var(--success) 0%, #059669 100%);
            color: white;
        }

        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none !important;
        }

        .tab-button {
            padding: 12px 24px;
            border: none;
            background: transparent;
            cursor: pointer;
            font-weight: 600;
            font-size: 16px;
            color: #9ca3af;
            border-bottom: 3px solid transparent;
            transition: all 0.3s ease;
            position: relative;
        }

        .tab-button.active {
            color: var(--primary);
            border-bottom-color: var(--primary);
        }

        .tab-button:hover {
            color: var(--secondary);
        }

        .tab-content {
            display: none;
            animation: slideIn 0.3s ease;
        }

        .tab-content.active {
            display: block;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .toast {
            position: fixed;
            bottom: 24px;
            right: 24px;
            padding: 16px 24px;
            border-radius: 12px;
            animation: slideUp 0.3s ease;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 1000;
            max-width: 400px;
            font-weight: 500;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .toast.success {
            background: linear-gradient(135deg, var(--success) 0%, #059669 100%);
            color: white;
        }

        .toast.error {
            background: linear-gradient(135deg, var(--error) 0%, #dc2626 100%);
            color: white;
        }

        .toast.info {
            background: linear-gradient(135deg, var(--accent) 0%, #0891b2 100%);
            color: white;
        }

        .currency-input {
            position: relative;
        }

        .currency-input::before {
            content: '$';
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            font-weight: 600;
            color: var(--primary);
            pointer-events: none;
        }

        .currency-input input {
            padding-left: 32px;
        }

        .total-display {
            background: linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
            border: 2px solid var(--primary);
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            animation: fadeIn 0.3s ease;
        }

        .total-display .label {
            font-size: 14px;
            color: #6b7280;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .dark-mode .total-display .label {
            color: #9ca3af;
        }

        .total-display .amount {
            font-size: 48px;
            font-weight: 700;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .search-result-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .search-result-table thead {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: white;
        }

        .search-result-table th {
            padding: 16px;
            text-align: left;
            font-weight: 600;
        }

        .search-result-table td {
            padding: 12px 16px;
            border-bottom: 1px solid #e5e7eb;
        }

        .dark-mode .search-result-table td {
            border-bottom-color: #404050;
            color: #e5e7eb;
        }

        .search-result-table tbody tr:hover {
            background: rgba(236, 72, 153, 0.05);
        }

        .dark-mode .search-result-table tbody tr:hover {
            background: rgba(236, 72, 153, 0.1);
        }

        .edit-button {
            background: var(--secondary);
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .edit-button:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }

        .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .error-message {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.5);
            color: #dc2626;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            margin-top: 8px;
            animation: slideUp 0.3s ease;
        }

        .dark-mode .error-message {
            background: rgba(239, 68, 68, 0.2);
            color: #fca5a5;
        }

        .empty-state {
            text-align: center;
            padding: 48px 24px;
            color: #9ca3af;
        }

        .empty-state i {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.5;
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 24px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-group label {
            font-weight: 600;
            margin-bottom: 8px;
            color: #374151;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .dark-mode .form-group label {
            color: #d1d5db;
        }

        .toggle-theme {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            z-index: 999;
            transition: all 0.3s ease;
        }

        .toggle-theme:hover {
            transform: scale(1.1);
        }

        .dark-mode .toggle-theme {
            background: #1f1f2e;
            color: #fbbf24;
        }

        .field-hint {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 4px;
        }

        .dark-mode .field-hint {
            color: #6b7280;
        }

        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        }

        .loading-overlay.active {
            display: flex;
        }

        .loading-content {
            background: white;
            padding: 32px;
            border-radius: 16px;
            text-align: center;
        }

        .dark-mode .loading-content {
            background: #1f1f2e;
        }

        .dark-mode h2 {
            color: white !important;
        }

        .dark-mode h3 {
            color: white !important;
        }

        @media (max-width: 768px) {
            .form-grid {
                grid-template-columns: 1fr;
            }

            .btn {
                width: 100%;
                justify-content: center;
            }

            .total-display .amount {
                font-size: 36px;
            }

            .toggle-theme {
                top: 10px;
                right: 10px;
                width: 44px;
                height: 44px;
                font-size: 18px;
            }
        }
    </style>
</head>
<body class="light-mode">
    <button class="toggle-theme" id="themeToggle" title="Toggle dark mode">
        <i class="fas fa-moon"><\/i>
    </button>

    <div class="loading-overlay" id="loadingOverlay">
        <div class="loading-content">
            <div class="spinner" style="margin: 0 auto 16px;"><\/div>
            <p class="text-gray-600">Processing your request...<\/p>
        </div>
    </div>

    <div class="min-h-screen py-8 px-4">
        <div class="max-w-4xl mx-auto">
            <div class="text-center mb-12 animate-fade-in">
                <h1 class="gradient-text text-5xl font-bold mb-4">
                    <i class="fas fa-receipt"><\/i> Bonnie's Invoice Manager
                </h1>
                <p class="text-gray-600 dark-mode:text-gray-200 text-lg">
                    Professional invoice management for your business
                </p>
            </div>

            <div class="glass-effect rounded-2xl overflow-hidden shadow-2xl">
                <div class="border-b border-gray-200 dark-mode:border-gray-700 px-6 pt-6">
                    <div class="flex gap-4 overflow-x-auto">
                        <button class="tab-button active" data-tab="create">
                            <i class="fas fa-plus-circle"><\/i> New Invoice
                        </button>
                        <button class="tab-button" data-tab="search">
                            <i class="fas fa-search"><\/i> Search & Edit
                        </button>
                    </div>
                </div>

                <div class="p-8">
                    <div id="tab-create" class="tab-content active">
                        <h2 class="text-2xl font-bold mb-8 text-gray-800 dark-mode:text-white">
                            Create New Invoice
                        </h2>

                        <form id="invoiceForm" novalidate>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="invoiceNumber">Invoice Number *<\/label>
                                    <div class="input-field">
                                        <input 
                                            type="text" 
                                            id="invoiceNumber" 
                                            name="invoiceNumber"
                                            placeholder="e.g., INV-2025-001"
                                            required
                                        >
                                    <\/div>
                                    <div class="field-hint">Unique identifier for this invoice<\/div>
                                    <div class="error-message hidden" id="invoiceNumberError"><\/div>
                                <\/div>

                                <div class="form-group">
                                    <label for="invoiceDate">Invoice Date *<\/label>
                                    <div class="input-field">
                                        <input 
                                            type="date" 
                                            id="invoiceDate" 
                                            name="invoiceDate"
                                            required
                                        >
                                    <\/div>
                                    <div class="field-hint">When was this invoice issued?<\/div>
                                    <div class="error-message hidden" id="invoiceDateError"><\/div>
                                <\/div>
                            <\/div>

                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="vendorSelect">Vendor *<\/label>
                                    <div class="input-field vendor-input-wrapper">
                                        <input 
                                            type="text" 
                                            id="vendorSelect" 
                                            name="vendorSelect"
                                            placeholder="Select or type vendor name"
                                            autocomplete="off"
                                            required
                                        >
                                        <ul id="vendorList" class="vendor-dropdown hidden" role="listbox"><\/ul>
                                    <\/div>
                                    <div class="field-hint">Select from list or type a new vendor name<\/div>
                                    <div class="error-message hidden" id="vendorSelectError"><\/div>
                                <\/div>
                            <\/div>

                            <div class="mb-8">
                                <h3 class="text-lg font-semibold mb-6 text-gray-800 dark-mode:text-white">
                                    <i class="fas fa-dollar-sign text-pink-500"><\/i> Cost Breakdown
                                <\/h3>
                                
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="flowerCost">Flower Cost<\/label>
                                        <div class="input-field currency-input">
                                            <input 
                                                type="text" 
                                                id="flowerCost" 
                                                name="flowerCost"
                                                placeholder="0.00"
                                                inputmode="decimal"
                                            >
                                        <\/div>
                                        <div class="field-hint">Cost of flowers<\/div>
                                        <div class="error-message hidden" id="flowerCostError"><\/div>
                                    <\/div>

                                    <div class="form-group">
                                        <label for="suppliesCost">Supplies Cost<\/label>
                                        <div class="input-field currency-input">
                                            <input 
                                                type="text" 
                                                id="suppliesCost" 
                                                name="suppliesCost"
                                                placeholder="0.00"
                                                inputmode="decimal"
                                            >
                                        <\/div>
                                        <div class="field-hint">Cost of supplies<\/div>
                                        <div class="error-message hidden" id="suppliesCostError"><\/div>
                                    <\/div>

                                    <div class="form-group">
                                        <label for="greensCost">Greens Cost<\/label>
                                        <div class="input-field currency-input">
                                            <input 
                                                type="text" 
                                                id="greensCost" 
                                                name="greensCost"
                                                placeholder="0.00"
                                                inputmode="decimal"
                                            >
                                        <\/div>
                                        <div class="field-hint">Cost of greens<\/div>
                                        <div class="error-message hidden" id="greensCostError"><\/div>
                                    <\/div>

                                    <div class="form-group">
                                        <label for="miscellaneousCost">Miscellaneous Cost<\/label>
                                        <div class="input-field currency-input">
                                            <input 
                                                type="text" 
                                                id="miscellaneousCost" 
                                                name="miscellaneousCost"
                                                placeholder="0.00"
                                                inputmode="decimal"
                                            >
                                        <\/div>
                                        <div class="field-hint">Delivery, gas, and other costs<\/div>
                                        <div class="error-message hidden" id="miscellaneousCostError"><\/div>
                                    <\/div>

                                    <div class="form-group">
                                        <label for="invoiceCredits">Invoice Credits<\/label>
                                        <div class="input-field currency-input">
                                            <input 
                                                type="text" 
                                                id="invoiceCredits" 
                                                name="invoiceCredits"
                                                placeholder="0.00"
                                                inputmode="decimal"
                                            >
                                        <\/div>
                                        <div class="field-hint">Credits to deduct<\/div>
                                        <div class="error-message hidden" id="invoiceCreditsError"><\/div>
                                    <\/div>
                                <\/div>
                            <\/div>

                            <div class="total-display mb-8">
                                <div class="label">Total Due<\/div>
                                <div class="amount" id="totalDisplay">$0.00<\/div>
                            <\/div>

                            <div class="flex gap-4 flex-wrap">
                                <button type="submit" class="btn btn-primary flex-1 sm:flex-none">
                                    <i class="fas fa-check-circle"><\/i> Submit Invoice
                                <\/button>
                                <button type="reset" class="btn btn-secondary flex-1 sm:flex-none">
                                    <i class="fas fa-redo"><\/i> Clear Form
                                <\/button>
                            <\/div>
                        <\/form>
                    <\/div>

                    <div id="tab-search" class="tab-content">
                        <h2 class="text-2xl font-bold mb-8 text-gray-800 dark-mode:text-white">
                            Search & Edit Invoices
                        <\/h2>

                        <div class="grid md:grid-cols-2 gap-6 mb-8">
                            <div class="form-group">
                                <label for="searchInvoiceNumber">Search by Invoice Number<\/label>
                                <div class="flex gap-2">
                                    <div class="input-field flex-1">
                                        <input 
                                            type="text" 
                                            id="searchInvoiceNumber" 
                                            placeholder="e.g., INV-2025"
                                        >
                                    <\/div>
                                    <button type="button" class="btn btn-primary" id="searchByNumberBtn">
                                        <i class="fas fa-search"><\/i> Search
                                    <\/button>
                                <\/div>
                            <\/div>

                            <div class="form-group">
                                <label>Search by Date Range<\/label>
                                <div class="flex gap-2 mb-2">
                                    <div class="input-field flex-1">
                                        <input 
                                            type="date" 
                                            id="searchDateFrom" 
                                            placeholder="From"
                                        >
                                    <\/div>
                                    <div class="input-field flex-1">
                                        <input 
                                            type="date" 
                                            id="searchDateTo" 
                                            placeholder="To"
                                        >
                                    <\/div>
                                <\/div>
                                <button type="button" class="btn btn-primary w-full" id="searchByDateBtn">
                                    <i class="fas fa-calendar"><\/i> Search by Date
                                <\/button>
                            <\/div>
                        <\/div>

                        <div id="searchResults" class="mt-8"><\/div>

                        <div id="editFormContainer" class="hidden mt-12 pt-12 border-t border-gray-200 dark-mode:border-gray-700">
                            <h3 class="text-2xl font-bold mb-8 text-gray-800 dark-mode:text-white">
                                <i class="fas fa-edit"><\/i> Edit Invoice
                            <\/h3>

                            <form id="editInvoiceForm" novalidate>
                                <input type="hidden" id="editInvoiceId">

                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="editInvoiceNumber">Invoice Number (Read-only)<\/label>
                                        <div class="input-field">
                                            <input 
                                                type="text" 
                                                id="editInvoiceNumber" 
                                                disabled
                                            >
                                        <\/div>
                                    <\/div>

                                    <div class="form-group">
                                        <label for="editInvoiceDate">Invoice Date<\/label>
                                        <div class="input-field">
                                            <input 
                                                type="date" 
                                                id="editInvoiceDate" 
                                                required
                                            >
                                        <\/div>
                                    <\/div>
                                <\/div>

                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="editVendorSelect">Vendor<\/label>
                                        <div class="input-field vendor-input-wrapper">
                                            <input 
                                                type="text" 
                                                id="editVendorSelect" 
                                                name="editVendorSelect"
                                                placeholder="Select or type vendor name"
                                                autocomplete="off"
                                            >
                                            <ul id="editVendorList" class="vendor-dropdown hidden" role="listbox"><\/ul>
                                        <\/div>
                                        <div class="field-hint">Select from list or type a vendor name<\/div>
                                    <\/div>
                                <\/div>

                                <div class="mb-8">
                                    <h3 class="text-lg font-semibold mb-6 text-gray-800 dark-mode:text-white">
                                        <i class="fas fa-dollar-sign text-pink-500"><\/i> Cost Breakdown
                                    <\/h3>
                                    
                                    <div class="form-grid">
                                        <div class="form-group">
                                            <label for="editFlowerCost">Flower Cost<\/label>
                                            <div class="input-field currency-input">
                                                <input 
                                                    type="text" 
                                                    id="editFlowerCost" 
                                                    inputmode="decimal"
                                                >
                                            <\/div>
                                        <\/div>

                                        <div class="form-group">
                                            <label for="editSuppliesCost">Supplies Cost<\/label>
                                            <div class="input-field currency-input">
                                                <input 
                                                    type="text" 
                                                    id="editSuppliesCost" 
                                                    inputmode="decimal"
                                                >
                                            <\/div>
                                        <\/div>

                                        <div class="form-group">
                                            <label for="editGreensCost">Greens Cost<\/label>
                                            <div class="input-field currency-input">
                                                <input 
                                                    type="text" 
                                                    id="editGreensCost" 
                                                    inputmode="decimal"
                                                >
                                            <\/div>
                                        <\/div>

                                        <div class="form-group">
                                            <label for="editMiscellaneousCost">Miscellaneous Cost<\/label>
                                            <div class="input-field currency-input">
                                                <input 
                                                    type="text" 
                                                    id="editMiscellaneousCost" 
                                                    inputmode="decimal"
                                                >
                                            <\/div>
                                        <\/div>

                                        <div class="form-group">
                                            <label for="editInvoiceCredits">Invoice Credits<\/label>
                                            <div class="input-field currency-input">
                                                <input 
                                                    type="text" 
                                                    id="editInvoiceCredits" 
                                                    inputmode="decimal"
                                                >
                                            <\/div>
                                        <\/div>
                                    <\/div>
                                <\/div>

                                <div class="total-display mb-8">
                                    <div class="label">Updated Total Due<\/div>
                                    <div class="amount" id="editTotalDisplay">$0.00<\/div>
                                <\/div>

                                <div class="flex gap-4 flex-wrap">
                                    <button type="submit" class="btn btn-success flex-1 sm:flex-none">
                                        <i class="fas fa-save"><\/i> Update Invoice
                                    <\/button>
                                    <button type="button" class="btn btn-secondary flex-1 sm:flex-none" id="cancelEditBtn">
                                        <i class="fas fa-times"><\/i> Cancel
                                    <\/button>
                                <\/div>
                            <\/form>
                        <\/div>
                    <\/div>
                <\/div>
            <\/div>

            <div class="text-center mt-12 text-gray-600 dark-mode:text-gray-200 text-sm">
                <p>© 2025 Bonnie's Invoice Manager | Version 0.97<\/p>
                <p class="mt-1 text-xs">Created lovingly by MJE AppWorks<\/p>
            <\/div>
        <\/div>
    <\/div>

    <script>
        const state = {
            currentTab: 'create',
            editingInvoiceId: null,
            searchResults: [],
            vendors: [],
            isDarkMode: localStorage.getItem('darkMode') === 'true'
        };

        document.addEventListener('DOMContentLoaded', initApp);

        function initApp() {
            setupTheme();
            loadVendors();
            setupEventListeners();
            setTodayDate();
        }

        function setupTheme() {
            const body = document.body;
            if (state.isDarkMode) {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"><\/i>';
            } else {
                body.classList.add('light-mode');
                body.classList.remove('dark-mode');
                document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"><\/i>';
            }
        }

        document.getElementById('themeToggle').addEventListener('click', function() {
            state.isDarkMode = !state.isDarkMode;
            localStorage.setItem('darkMode', state.isDarkMode);
            setupTheme();
        });

        function setupEventListeners() {
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.addEventListener('click', switchTab);
            });

            document.getElementById('invoiceForm').addEventListener('submit', handleFormSubmit);
            document.getElementById('invoiceForm').addEventListener('reset', handleFormReset);
            document.getElementById('editInvoiceForm').addEventListener('submit', handleEditSubmit);

            const costInputs = ['#flowerCost', '#suppliesCost', '#greensCost', '#miscellaneousCost', '#invoiceCredits'];
            costInputs.forEach(selector => {
                document.querySelector(selector).addEventListener('input', calculateTotal);
            });

            const editCostInputs = ['#editFlowerCost', '#editSuppliesCost', '#editGreensCost', '#editMiscellaneousCost', '#editInvoiceCredits'];
            editCostInputs.forEach(selector => {
                document.querySelector(selector).addEventListener('input', calculateEditTotal);
            });

            const vendorInput = document.getElementById('vendorSelect');
            const vendorList = document.getElementById('vendorList');
            
            vendorInput.addEventListener('focus', () => {
                if (vendorList.childNodes.length > 0) {
                    vendorList.classList.remove('hidden');
                }
            });

            vendorInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                filterVendorList(searchTerm);
            });

            vendorInput.addEventListener('blur', () => {
                setTimeout(() => {
                    vendorList.classList.add('hidden');
                }, 200);
            });

            const editVendorInput = document.getElementById('editVendorSelect');
            const editVendorList = document.getElementById('editVendorList');
            
            editVendorInput.addEventListener('focus', () => {
                populateEditVendorList();
                if (editVendorList.childNodes.length > 0) {
                    editVendorList.classList.remove('hidden');
                }
            });

            editVendorInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                filterEditVendorList(searchTerm);
            });

            editVendorInput.addEventListener('blur', () => {
                setTimeout(() => {
                    editVendorList.classList.add('hidden');
                }, 200);
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.vendor-input-wrapper')) {
                    vendorList.classList.add('hidden');
                    editVendorList.classList.add('hidden');
                }
            });

            document.getElementById('searchByNumberBtn').addEventListener('click', searchByNumber);
            document.getElementById('searchByDateBtn').addEventListener('click', searchByDate);
            document.getElementById('cancelEditBtn').addEventListener('click', cancelEdit);

            setTodayDate();
        }

        function loadVendors() {
            google.script.run
                .withSuccessHandler(function(vendors) {
                    state.vendors = vendors || [];
                    populateVendorList();
                })
                .withFailureHandler(function(error) {
                    Logger.log('Error loading vendors: ' + error);
                    state.vendors = [];
                })
                .getVendors();
        }

        function populateVendorList() {
            const vendorList = document.getElementById('vendorList');
            vendorList.innerHTML = '';

            state.vendors.forEach(vendor => {
                const li = document.createElement('li');
                li.textContent = vendor;
                li.setAttribute('role', 'option');
                li.addEventListener('click', () => {
                    document.getElementById('vendorSelect').value = vendor;
                    vendorList.classList.add('hidden');
                });
                vendorList.appendChild(li);
            });
        }

        function filterVendorList(searchTerm) {
            const vendorList = document.getElementById('vendorList');
            const items = vendorList.querySelectorAll('li:not(.add-new)');
            let hasVisibleItems = false;

            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = '';
                    hasVisibleItems = true;
                } else {
                    item.style.display = 'none';
                }
            });

            if (searchTerm === '' || hasVisibleItems) {
                vendorList.classList.remove('hidden');
            } else {
                if (searchTerm.length > 0) {
                    vendorList.classList.remove('hidden');
                }
            }
        }

        function populateEditVendorList() {
            const editVendorList = document.getElementById('editVendorList');
            editVendorList.innerHTML = '';

            state.vendors.forEach(vendor => {
                const li = document.createElement('li');
                li.textContent = vendor;
                li.setAttribute('role', 'option');
                li.addEventListener('click', () => {
                    document.getElementById('editVendorSelect').value = vendor;
                    editVendorList.classList.add('hidden');
                });
                editVendorList.appendChild(li);
            });
        }

        function filterEditVendorList(searchTerm) {
            const editVendorList = document.getElementById('editVendorList');
            const items = editVendorList.querySelectorAll('li');
            let hasVisibleItems = false;

            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = '';
                    hasVisibleItems = true;
                } else {
                    item.style.display = 'none';
                }
            });

            if (searchTerm === '' || hasVisibleItems) {
                editVendorList.classList.remove('hidden');
            } else {
                if (searchTerm.length > 0) {
                    editVendorList.classList.remove('hidden');
                }
            }
        }

        function switchTab(e) {
            const tabName = e.target.closest('.tab-button').getAttribute('data-tab');
            
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.closest('.tab-button').classList.add('active');

            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById('tab-' + tabName).classList.add('active');

            state.currentTab = tabName;
        }

        function calculateTotal() {
            const flowerCost = parseFloat(document.getElementById('flowerCost').value) || 0;
            const suppliesCost = parseFloat(document.getElementById('suppliesCost').value) || 0;
            const greensCost = parseFloat(document.getElementById('greensCost').value) || 0;
            const miscellaneousCost = parseFloat(document.getElementById('miscellaneousCost').value) || 0;
            const credits = parseFloat(document.getElementById('invoiceCredits').value) || 0;

            const total = flowerCost + suppliesCost + greensCost + miscellaneousCost - credits;
            displayTotal(total, 'totalDisplay');
        }

        function calculateEditTotal() {
            const flowerCost = parseFloat(document.getElementById('editFlowerCost').value) || 0;
            const suppliesCost = parseFloat(document.getElementById('editSuppliesCost').value) || 0;
            const greensCost = parseFloat(document.getElementById('editGreensCost').value) || 0;
            const miscellaneousCost = parseFloat(document.getElementById('editMiscellaneousCost').value) || 0;
            const credits = parseFloat(document.getElementById('editInvoiceCredits').value) || 0;

            const total = flowerCost + suppliesCost + greensCost + miscellaneousCost - credits;
            displayTotal(total, 'editTotalDisplay');
        }

        function displayTotal(amount, elementId) {
            const element = document.getElementById(elementId);
            element.textContent = formatCurrency(amount);
            
            if (amount < 0) {
                element.classList.add('text-red-500');
            } else {
                element.classList.remove('text-red-500');
            }
        }

        function formatCurrency(amount) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(amount);
        }

        function handleFormReset(e) {
            // Let the form reset happen naturally first
            setTimeout(() => {
                clearErrors();
                setTodayDate();
                displayTotal(0, 'totalDisplay');
            }, 0);
        }

        function handleFormSubmit(e) {
            e.preventDefault();
            clearErrors();

            const invoiceData = {
                vendor: document.getElementById('vendorSelect').value.trim(),
                invoiceNumber: document.getElementById('invoiceNumber').value.trim(),
                invoiceDate: document.getElementById('invoiceDate').value,
                flowerCost: document.getElementById('flowerCost').value.trim(),
                suppliesCost: document.getElementById('suppliesCost').value.trim(),
                greensCost: document.getElementById('greensCost').value.trim(),
                miscellaneousCost: document.getElementById('miscellaneousCost').value.trim(),
                invoiceCredits: document.getElementById('invoiceCredits').value.trim()
            };

            if (!validateForm(invoiceData)) {
                return;
            }

            // Only convert to numbers AFTER validation passes
            invoiceData.flowerCost = parseFloat(invoiceData.flowerCost) || 0;
            invoiceData.suppliesCost = parseFloat(invoiceData.suppliesCost) || 0;
            invoiceData.greensCost = parseFloat(invoiceData.greensCost) || 0;
            invoiceData.miscellaneousCost = parseFloat(invoiceData.miscellaneousCost) || 0;
            invoiceData.invoiceCredits = parseFloat(invoiceData.invoiceCredits) || 0;

            submitToServer(invoiceData);
        }

        function validateForm(data) {
            let isValid = true;

            if (!data.vendor) {
                showError('vendorSelectError', 'Vendor is required');
                isValid = false;
            } else if (data.vendor.length > 100) {
                showError('vendorSelectError', 'Vendor name must be 100 characters or less');
                isValid = false;
            }

            if (!data.invoiceNumber) {
                showError('invoiceNumberError', 'Invoice number is required');
                isValid = false;
            } else if (data.invoiceNumber.length > 50) {
                showError('invoiceNumberError', 'Invoice number must be 50 characters or less');
                isValid = false;
            }

            if (!data.invoiceDate) {
                showError('invoiceDateError', 'Invoice date is required');
                isValid = false;
            } else if (new Date(data.invoiceDate) > new Date()) {
                showError('invoiceDateError', 'Invoice date cannot be in the future');
                isValid = false;
            }

            // Validate Flower Cost - must be numeric or empty
            if (data.flowerCost !== '') {
                const flowerNum = parseFloat(data.flowerCost);
                if (isNaN(flowerNum)) {
                    showError('flowerCostError', 'Amount must be a valid number (e.g., 10.50)');
                    isValid = false;
                } else if (flowerNum < 0) {
                    showError('flowerCostError', 'Amount cannot be negative');
                    isValid = false;
                }
            }

            // Validate Supplies Cost - must be numeric or empty
            if (data.suppliesCost !== '') {
                const suppliesNum = parseFloat(data.suppliesCost);
                if (isNaN(suppliesNum)) {
                    showError('suppliesCostError', 'Amount must be a valid number (e.g., 10.50)');
                    isValid = false;
                } else if (suppliesNum < 0) {
                    showError('suppliesCostError', 'Amount cannot be negative');
                    isValid = false;
                }
            }

            // Validate Greens Cost - must be numeric or empty
            if (data.greensCost !== '') {
                const greensNum = parseFloat(data.greensCost);
                if (isNaN(greensNum)) {
                    showError('greensCostError', 'Amount must be a valid number (e.g., 10.50)');
                    isValid = false;
                } else if (greensNum < 0) {
                    showError('greensCostError', 'Amount cannot be negative');
                    isValid = false;
                }
            }

            // Validate Miscellaneous Cost - must be numeric or empty
            if (data.miscellaneousCost !== '') {
                const miscNum = parseFloat(data.miscellaneousCost);
                if (isNaN(miscNum)) {
                    showError('miscellaneousCostError', 'Amount must be a valid number (e.g., 10.50)');
                    isValid = false;
                } else if (miscNum < 0) {
                    showError('miscellaneousCostError', 'Amount cannot be negative');
                    isValid = false;
                }
            }

            // Validate Invoice Credits - must be numeric or empty
            if (data.invoiceCredits !== '') {
                const creditsNum = parseFloat(data.invoiceCredits);
                if (isNaN(creditsNum)) {
                    showError('invoiceCreditsError', 'Credits must be a valid number (e.g., 10.50)');
                    isValid = false;
                } else if (creditsNum < 0) {
                    showError('invoiceCreditsError', 'Credits cannot be negative');
                    isValid = false;
                }
            }

            return isValid;
        }

        function submitToServer(data) {
            showLoading(true);

            const vendorExists = state.vendors.some(v => v.toLowerCase() === data.vendor.toLowerCase());
            
            const submitCallback = function(result) {
                showLoading(false);
                if (result.success) {
                    showToast('Invoice submitted successfully! ID: ' + result.invoiceId, 'success');
                    document.getElementById('invoiceForm').reset();
                    calculateTotal();
                    setTodayDate();
                    loadVendors();
                } else {
                    showToast(result.message || 'An error occurred', 'error');
                }
            };

            if (!vendorExists) {
                google.script.run
                    .withSuccessHandler(function(vendorResult) {
                        if (vendorResult.success) {
                            google.script.run
                                .withSuccessHandler(submitCallback)
                                .withFailureHandler(function(error) {
                                    showLoading(false);
                                    showToast('Error submitting invoice: ' + error, 'error');
                                })
                                .submitInvoice(data);
                        } else {
                            showLoading(false);
                            showToast('Error adding vendor: ' + vendorResult.message, 'error');
                        }
                    })
                    .withFailureHandler(function(error) {
                        showLoading(false);
                        showToast('Error adding vendor: ' + error, 'error');
                    })
                    .addNewVendor(data.vendor);
            } else {
                google.script.run
                    .withSuccessHandler(submitCallback)
                    .withFailureHandler(function(error) {
                        showLoading(false);
                        showToast('Error: ' + error, 'error');
                    })
                    .submitInvoice(data);
            }
        }

        function searchByNumber() {
            const searchValue = document.getElementById('searchInvoiceNumber').value.trim();

            if (!searchValue) {
                showToast('Please enter an invoice number', 'info');
                return;
            }

            showLoading(true);

            google.script.run
                .withSuccessHandler(function(results) {
                    showLoading(false);
                    displaySearchResults(results);
                })
                .withFailureHandler(function(error) {
                    showLoading(false);
                    showToast('Search error: ' + error, 'error');
                })
                .searchInvoices('number', searchValue);
        }

        function searchByDate() {
            const fromDate = document.getElementById('searchDateFrom').value;
            const toDate = document.getElementById('searchDateTo').value;

            if (!fromDate || !toDate) {
                showToast('Please select both start and end dates', 'info');
                return;
            }

            if (new Date(fromDate) > new Date(toDate)) {
                showToast('Start date must be before end date', 'error');
                return;
            }

            showLoading(true);

            google.script.run
                .withSuccessHandler(function(results) {
                    showLoading(false);
                    displaySearchResults(results);
                })
                .withFailureHandler(function(error) {
                    showLoading(false);
                    showToast('Search error: ' + error, 'error');
                })
                .searchInvoices('dateRange', { from: fromDate, to: toDate });
        }

        function displaySearchResults(results) {
            const container = document.getElementById('searchResults');
            
            if (!results || results.length === 0) {
                container.innerHTML = '<div class="empty-state"><i class="fas fa-search"><\/i><h3 class="text-gray-700 dark-mode:text-gray-300 text-lg font-semibold mt-4">No invoices found<\/h3><p class="text-gray-500 dark-mode:text-gray-400">Try adjusting your search criteria<\/p><\/div>';
                return;
            }

            state.searchResults = results;

            let html = '<div class="overflow-x-auto"><table class="search-result-table"><thead><tr><th>Invoice #<\/th><th>Invoice Date<\/th><th>Vendor<\/th><th>Total<\/th><th>Created<\/th><th>Action<\/th><\/tr><\/thead><tbody>';

            results.forEach((invoice, index) => {
                html += '<tr><td class="font-semibold">' + invoice.invoiceNumber + '<\/td><td>' + formatDate(invoice.invoiceDate) + '<\/td><td>' + (invoice.vendor || 'N/A') + '<\/td><td class="font-semibold">' + formatCurrency(invoice.total) + '<\/td><td class="text-sm text-gray-500 dark-mode:text-gray-400">' + (invoice.createdTimestamp || 'N/A') + '<\/td><td><button class="edit-button" onclick="editInvoice(' + index + ')"><i class="fas fa-edit"><\/i> Edit<\/button><\/td><\/tr>';
            });

            html += '<\/tbody><\/table><\/div>';

            container.innerHTML = html;
        }

        function formatDate(dateString) {
            // Parse YYYY-MM-DD format without timezone conversion
            const parts = dateString.split('-');
            if (parts.length === 3) {
                const year = parts[0];
                const monthNum = parseInt(parts[1]);
                const day = parseInt(parts[2]);
                
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const monthName = months[monthNum - 1];
                
                return monthName + ' ' + day + ', ' + year;
            }
            // Fallback for other formats
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        }

        function editInvoice(index) {
            const invoice = state.searchResults[index];
            state.editingInvoiceId = invoice.id;

            document.getElementById('editInvoiceId').value = invoice.id;
            document.getElementById('editInvoiceNumber').value = invoice.invoiceNumber;
            document.getElementById('editInvoiceDate').value = invoice.invoiceDate;
            document.getElementById('editVendorSelect').value = invoice.vendor || '';
            document.getElementById('editFlowerCost').value = invoice.flowerCost.toFixed(2);
            document.getElementById('editSuppliesCost').value = invoice.suppliesCost.toFixed(2);
            document.getElementById('editGreensCost').value = invoice.greensCost.toFixed(2);
            document.getElementById('editMiscellaneousCost').value = (invoice.miscellaneousCost || 0).toFixed(2);
            document.getElementById('editInvoiceCredits').value = invoice.invoiceCredits.toFixed(2);

            calculateEditTotal();

            document.getElementById('editFormContainer').classList.remove('hidden');
            document.getElementById('editFormContainer').scrollIntoView({ behavior: 'smooth' });
        }

        function handleEditSubmit(e) {
            e.preventDefault();
            clearErrors();

            const updatedData = {
                id: document.getElementById('editInvoiceId').value,
                vendor: document.getElementById('editVendorSelect').value.trim(),
                invoiceDate: document.getElementById('editInvoiceDate').value,
                flowerCost: parseFloat(document.getElementById('editFlowerCost').value) || 0,
                suppliesCost: parseFloat(document.getElementById('editSuppliesCost').value) || 0,
                greensCost: parseFloat(document.getElementById('editGreensCost').value) || 0,
                miscellaneousCost: parseFloat(document.getElementById('editMiscellaneousCost').value) || 0,
                invoiceCredits: parseFloat(document.getElementById('editInvoiceCredits').value) || 0
            };

            // Validate invoice date
            if (!updatedData.invoiceDate || updatedData.invoiceDate === '') {
                showToast('Invoice date is required', 'error');
                return false;
            }

            // Validate costs are not negative
            if (updatedData.flowerCost < 0) {
                showToast('Flower cost cannot be negative', 'error');
                return false;
            }
            if (updatedData.suppliesCost < 0) {
                showToast('Supplies cost cannot be negative', 'error');
                return false;
            }
            if (updatedData.greensCost < 0) {
                showToast('Greens cost cannot be negative', 'error');
                return false;
            }
            if (updatedData.miscellaneousCost < 0) {
                showToast('Miscellaneous cost cannot be negative', 'error');
                return false;
            }
            if (updatedData.invoiceCredits < 0) {
                showToast('Invoice credits cannot be negative', 'error');
                return false;
            }

            showLoading(true);

            google.script.run
                .withSuccessHandler(function(result) {
                    showLoading(false);
                    if (result.success) {
                        showToast('Invoice updated successfully!', 'success');
                        cancelEdit();
                        document.getElementById('searchInvoiceNumber').value = '';
                        document.getElementById('searchResults').innerHTML = '';
                    } else {
                        showToast(result.message || 'An error occurred', 'error');
                    }
                })
                .withFailureHandler(function(error) {
                    showLoading(false);
                    showToast('Error: ' + error, 'error');
                })
                .updateInvoice(updatedData);
        }

        function cancelEdit() {
            document.getElementById('editFormContainer').classList.add('hidden');
            document.getElementById('editInvoiceForm').reset();
            state.editingInvoiceId = null;
        }

        function setTodayDate() {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const dateString = year + '-' + month + '-' + day;
            
            const dateInput = document.getElementById('invoiceDate');
            if (dateInput) {
                dateInput.value = dateString;
            }
        }

        function showError(elementId, message) {
            const errorElement = document.getElementById(elementId);
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.remove('hidden');
            }
        }

        function clearErrors() {
            document.querySelectorAll('.error-message').forEach(el => {
                el.classList.add('hidden');
            });
        }

        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = 'toast ' + type;
            const iconType = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
            toast.innerHTML = '<i class="fas fa-' + iconType + '"><\/i><span>' + message + '<\/span>';
            
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.animation = 'slideUp 0.3s ease reverse';
                setTimeout(() => toast.remove(), 300);
            }, 4000);
        }

        function showLoading(show) {
            const overlay = document.getElementById('loadingOverlay');
            if (show) {
                overlay.classList.add('active');
            } else {
                overlay.classList.remove('active');
            }
        }
    <\/script>
<\/body>
<\/html>
  `;

  return HtmlService.createHtmlOutput(html).setWidth(1024).setHeight(800);
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
      suppliesCost: updatedData.suppliesCost,
      greensCost: updatedData.greensCost,
      miscellaneousCost: updatedData.miscellaneousCost,
      invoiceCredits: updatedData.invoiceCredits,
      total: newTotal
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

function calculateTotal(flowerCost, suppliesCost, greensCost, miscellaneousCost, invoiceCredits) {
  return flowerCost + suppliesCost + greensCost + miscellaneousCost - invoiceCredits;
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
    
    const newRow = [
      invoiceId,
      invoiceData.invoiceNumber,
      invoiceData.invoiceDate,
      invoiceData.vendor,
      invoiceData.flowerCost,
      invoiceData.suppliesCost,
      invoiceData.greensCost,
      invoiceData.miscellaneousCost,
      invoiceData.invoiceCredits,
      invoiceData.total,
      'Active',
      timestamp,
      timestamp,
      userEmail,
      userEmail
    ];
    
    invoiceSheet.appendRow(newRow);
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
        
        invoiceSheet.getRange(rowNumber, 3).setValue(updatedData.invoiceDate); // Invoice Date
        invoiceSheet.getRange(rowNumber, 4).setValue(updatedData.vendor); // Vendor
        invoiceSheet.getRange(rowNumber, 5).setValue(updatedData.flowerCost); // Flower Cost
        invoiceSheet.getRange(rowNumber, 6).setValue(updatedData.suppliesCost); // Supplies Cost
        invoiceSheet.getRange(rowNumber, 7).setValue(updatedData.greensCost); // Greens Cost
        invoiceSheet.getRange(rowNumber, 8).setValue(updatedData.miscellaneousCost); // Miscellaneous Cost
        invoiceSheet.getRange(rowNumber, 9).setValue(updatedData.invoiceCredits); // Invoice Credits
        invoiceSheet.getRange(rowNumber, 10).setValue(updatedData.total); // Total Due
        invoiceSheet.getRange(rowNumber, 13).setValue(timestamp); // Last Modified Timestamp
        invoiceSheet.getRange(rowNumber, 15).setValue(userEmail); // Last Modified By
        
        return true;
      }
    }
    
    throw new Error('Invoice not found');
  } catch (error) {
    Logger.log('Error in updateInvoiceRow: ' + error);
    throw error;
  }
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
        const invoiceDateObj = data[i][2];
        const createdTimestampObj = data[i][11];
        
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
        
        const invoiceObj = {
          id: String(data[i][0]),
          invoiceNumber: String(data[i][1]),
          invoiceDate: invoiceDateStr,
          vendor: String(data[i][3]),
          flowerCost: Number(data[i][4]),
          suppliesCost: Number(data[i][5]),
          greensCost: Number(data[i][6]),
          miscellaneousCost: Number(data[i][7]) || 0,
          invoiceCredits: Number(data[i][8]),
          total: Number(data[i][9]),
          createdTimestamp: createdTimestampStr
        };
        
        plainResults.push(invoiceObj);
        Logger.log('>>> Added invoice: ' + invoiceObj.invoiceNumber);
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
        const invoiceDateObj = data[i][2];
        const createdTimestampObj = data[i][11];
        
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
        
        const invoiceObj = {
          id: String(data[i][0]),
          invoiceNumber: String(data[i][1]),
          invoiceDate: invoiceDateStr,
          vendor: String(data[i][3]),
          flowerCost: Number(data[i][4]),
          suppliesCost: Number(data[i][5]),
          greensCost: Number(data[i][6]),
          miscellaneousCost: Number(data[i][7]) || 0,
          invoiceCredits: Number(data[i][8]),
          total: Number(data[i][9]),
          createdTimestamp: createdTimestampStr
        };
        
        plainResults.push(invoiceObj);
        Logger.log('>>> Added invoice: ' + invoiceObj.invoiceNumber);
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

function testSearchDirect() {
  Logger.log('=== TEST SEARCH DIRECT ===');
  
  // Check sheet exists and has data
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Invoices');
  Logger.log('Sheet exists: ' + (sheet ? 'YES' : 'NO'));
  
  if (sheet) {
    const data = sheet.getDataRange().getValues();
    Logger.log('Total rows in Invoices sheet: ' + data.length);
    
    // Log first few rows
    for (let i = 0; i < Math.min(5, data.length); i++) {
      Logger.log('Row ' + i + ': [' + data[i][0] + ', ' + data[i][1] + ', ' + data[i][2] + ']');
    }
  }
  
  // Test search
  Logger.log('=== TESTING searchByInvoiceNumber ===');
  const results = searchByInvoiceNumber('TEST');
  Logger.log('Search results for "TEST": ' + results.length);
  for (let i = 0; i < results.length; i++) {
    Logger.log('Result ' + i + ': ' + results[i].invoiceNumber);
  }
}

function getDiagnostics() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  const result = {
    spreadsheetName: ss.getName(),
    sheetCount: sheets.length,
    sheets: [],
    invoicesSheetInfo: null
  };
  
  for (let i = 0; i < sheets.length; i++) {
    const sheet = sheets[i];
    const data = sheet.getDataRange().getValues();
    result.sheets.push({
      name: sheet.getName(),
      rows: data.length,
      columns: data.length > 0 ? data[0].length : 0
    });
    
    if (sheet.getName() === 'Invoices') {
      result.invoicesSheetInfo = {
        totalRows: data.length,
        dataRows: Math.max(0, data.length - 1),
        headerRow: data.length > 0 ? data[0] : null,
        firstDataRow: data.length > 1 ? data[1] : null
      };
    }
  }
  
  return result;
}


