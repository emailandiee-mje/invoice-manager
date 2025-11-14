/**
 * HTML.gs - Frontend Template with Modern UI/UX
 * Renders responsive form with Tailwind CSS, animations, and real-time calculations
 */

function getHtmlOutput() {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bonnie's Invoice Manager</title>
    <script src="https://cdn.tailwindcss.com"></script>
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
        <i class="fas fa-moon"></i>
    </button>

    <div class="loading-overlay" id="loadingOverlay">
        <div class="loading-content">
            <div class="spinner" style="margin: 0 auto 16px;"></div>
            <p class="text-gray-600">Processing your request...</p>
        </div>
    </div>

    <div class="min-h-screen py-8 px-4">
        <div class="max-w-4xl mx-auto">
            <!-- Header -->
            <div class="text-center mb-12 animate-fade-in">
                <h1 class="gradient-text text-5xl font-bold mb-4">
                    <i class="fas fa-receipt"></i> Bonnie's Invoice Manager
                </h1>
                <p class="text-gray-600 dark-mode:text-gray-400 text-lg">
                    Professional invoice management for your business
                </p>
            </div>

            <!-- Main Card -->
            <div class="glass-effect rounded-2xl overflow-hidden shadow-2xl">
                <!-- Tabs -->
                <div class="border-b border-gray-200 dark-mode:border-gray-700 px-6 pt-6">
                    <div class="flex gap-4 overflow-x-auto">
                        <button class="tab-button active" data-tab="create">
                            <i class="fas fa-plus-circle"></i> New Invoice
                        </button>
                        <button class="tab-button" data-tab="search">
                            <i class="fas fa-search"></i> Search & Edit
                        </button>
                    </div>
                </div>

                <!-- Tab Content -->
                <div class="p-8">
                    <!-- Tab 1: New Invoice -->
                    <div id="tab-create" class="tab-content active">
                        <h2 class="text-2xl font-bold mb-8 text-gray-800 dark-mode:text-white">
                            Create New Invoice
                        </h2>

                        <form id="invoiceForm" novalidate>
                            <!-- Invoice Number -->
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="invoiceNumber">Invoice Number *</label>
                                    <div class="input-field">
                                        <input 
                                            type="text" 
                                            id="invoiceNumber" 
                                            name="invoiceNumber"
                                            placeholder="e.g., INV-2025-001"
                                            required
                                        >
                                    </div>
                                    <div class="field-hint">Unique identifier for this invoice</div>
                                    <div class="error-message hidden" id="invoiceNumberError"></div>
                                </div>

                                <!-- Invoice Date -->
                                <div class="form-group">
                                    <label for="invoiceDate">Invoice Date *</label>
                                    <div class="input-field">
                                        <input 
                                            type="date" 
                                            id="invoiceDate" 
                                            name="invoiceDate"
                                            required
                                        >
                                    </div>
                                    <div class="field-hint">When was this invoice issued?</div>
                                    <div class="error-message hidden" id="invoiceDateError"></div>
                                </div>
                            </div>

                            <!-- Vendor Selection -->
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="vendorSelect">Vendor *</label>
                                    <div class="input-field vendor-input-wrapper">
                                        <input 
                                            type="text" 
                                            id="vendorSelect" 
                                            name="vendorSelect"
                                            placeholder="Select or type vendor name"
                                            autocomplete="off"
                                            required
                                        >
                                        <ul id="vendorList" class="vendor-dropdown hidden" role="listbox"></ul>
                                    </div>
                                    <div class="field-hint">Select from list or type a new vendor name</div>
                                    <div class="error-message hidden" id="vendorSelectError"></div>
                                </div>
                            </div>

                            <!-- Cost Breakdown Section -->
                            <div class="mb-8">
                                <h3 class="text-lg font-semibold mb-6 text-gray-800 dark-mode:text-white">
                                    <i class="fas fa-dollar-sign text-pink-500"></i> Cost Breakdown
                                </h3>
                                
                                <div class="form-grid">
                                    <!-- Flower Cost -->
                                    <div class="form-group">
                                        <label for="flowerCost">Flower Cost</label>
                                        <div class="input-field currency-input">
                                            <input 
                                                type="number" 
                                                id="flowerCost" 
                                                name="flowerCost"
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                                value="0"
                                            >
                                        </div>
                                        <div class="field-hint">Cost of flowers</div>
                                        <div class="error-message hidden" id="flowerCostError"></div>
                                    </div>

                                    <!-- Supplies Cost -->
                                    <div class="form-group">
                                        <label for="suppliesCost">Supplies Cost</label>
                                        <div class="input-field currency-input">
                                            <input 
                                                type="number" 
                                                id="suppliesCost" 
                                                name="suppliesCost"
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                                value="0"
                                            >
                                        </div>
                                        <div class="field-hint">Cost of supplies</div>
                                        <div class="error-message hidden" id="suppliesCostError"></div>
                                    </div>

                                    <!-- Greens Cost -->
                                    <div class="form-group">
                                        <label for="greensCost">Greens Cost</label>
                                        <div class="input-field currency-input">
                                            <input 
                                                type="number" 
                                                id="greensCost" 
                                                name="greensCost"
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                                value="0"
                                            >
                                        </div>
                                        <div class="field-hint">Cost of greens</div>
                                        <div class="error-message hidden" id="greensCostError"></div>
                                    </div>

                                    <!-- Invoice Credits -->
                                    <div class="form-group">
                                        <label for="invoiceCredits">Invoice Credits</label>
                                        <div class="input-field currency-input">
                                            <input 
                                                type="number" 
                                                id="invoiceCredits" 
                                                name="invoiceCredits"
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                                value="0"
                                            >
                                        </div>
                                        <div class="field-hint">Credits to deduct</div>
                                        <div class="error-message hidden" id="invoiceCreditsError"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- Total Due Display -->
                            <div class="total-display mb-8">
                                <div class="label">Total Due</div>
                                <div class="amount" id="totalDisplay">$0.00</div>
                            </div>

                            <!-- Form Actions -->
                            <div class="flex gap-4 flex-wrap">
                                <button type="submit" class="btn btn-primary flex-1 sm:flex-none">
                                    <i class="fas fa-check-circle"></i> Submit Invoice
                                </button>
                                <button type="reset" class="btn btn-secondary flex-1 sm:flex-none">
                                    <i class="fas fa-redo"></i> Clear Form
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Tab 2: Search & Edit -->
                    <div id="tab-search" class="tab-content">
                        <h2 class="text-2xl font-bold mb-8 text-gray-800 dark-mode:text-white">
                            Search & Edit Invoices
                        </h2>

                        <!-- Search Options -->
                        <div class="grid md:grid-cols-2 gap-6 mb-8">
                            <!-- Search by Invoice Number -->
                            <div class="form-group">
                                <label for="searchInvoiceNumber">Search by Invoice Number</label>
                                <div class="flex gap-2">
                                    <div class="input-field flex-1">
                                        <input 
                                            type="text" 
                                            id="searchInvoiceNumber" 
                                            placeholder="e.g., INV-2025"
                                        >
                                    </div>
                                    <button type="button" class="btn btn-primary" id="searchByNumberBtn">
                                        <i class="fas fa-search"></i> Search
                                    </button>
                                </div>
                            </div>

                            <!-- Search by Date Range -->
                            <div class="form-group">
                                <label>Search by Date Range</label>
                                <div class="flex gap-2 mb-2">
                                    <div class="input-field flex-1">
                                        <input 
                                            type="date" 
                                            id="searchDateFrom" 
                                            placeholder="From"
                                        >
                                    </div>
                                    <div class="input-field flex-1">
                                        <input 
                                            type="date" 
                                            id="searchDateTo" 
                                            placeholder="To"
                                        >
                                    </div>
                                </div>
                                <button type="button" class="btn btn-primary w-full" id="searchByDateBtn">
                                    <i class="fas fa-calendar"></i> Search by Date
                                </button>
                            </div>
                        </div>

                        <!-- Search Results -->
                        <div id="searchResults" class="mt-8"></div>

                        <!-- Edit Invoice Form (Hidden by default) -->
                        <div id="editFormContainer" class="hidden mt-12 pt-12 border-t border-gray-200 dark-mode:border-gray-700">
                            <h3 class="text-2xl font-bold mb-8 text-gray-800 dark-mode:text-white">
                                <i class="fas fa-edit"></i> Edit Invoice
                            </h3>

                            <form id="editInvoiceForm">
                                <input type="hidden" id="editInvoiceId">

                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="editInvoiceNumber">Invoice Number (Read-only)</label>
                                        <div class="input-field">
                                            <input 
                                                type="text" 
                                                id="editInvoiceNumber" 
                                                disabled
                                            >
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label for="editInvoiceDate">Invoice Date</label>
                                        <div class="input-field">
                                            <input 
                                                type="date" 
                                                id="editInvoiceDate" 
                                                required
                                            >
                                        </div>
                                    </div>
                                </div>

                                <!-- Vendor Selection in Edit Form -->
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="editVendorSelect">Vendor</label>
                                        <div class="input-field vendor-input-wrapper">
                                            <input 
                                                type="text" 
                                                id="editVendorSelect" 
                                                name="editVendorSelect"
                                                placeholder="Select or type vendor name"
                                                autocomplete="off"
                                            >
                                            <ul id="editVendorList" class="vendor-dropdown hidden" role="listbox"></ul>
                                        </div>
                                        <div class="field-hint">Select from list or type a vendor name</div>
                                    </div>
                                </div>

                                <div class="mb-8">
                                    <h3 class="text-lg font-semibold mb-6 text-gray-800 dark-mode:text-white">
                                        <i class="fas fa-dollar-sign text-pink-500"></i> Cost Breakdown
                                    </h3>
                                    
                                    <div class="form-grid">
                                        <div class="form-group">
                                            <label for="editFlowerCost">Flower Cost</label>
                                            <div class="input-field currency-input">
                                                <input 
                                                    type="number" 
                                                    id="editFlowerCost" 
                                                    min="0"
                                                    step="0.01"
                                                >
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="editSuppliesCost">Supplies Cost</label>
                                            <div class="input-field currency-input">
                                                <input 
                                                    type="number" 
                                                    id="editSuppliesCost" 
                                                    min="0"
                                                    step="0.01"
                                                >
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="editGreensCost">Greens Cost</label>
                                            <div class="input-field currency-input">
                                                <input 
                                                    type="number" 
                                                    id="editGreensCost" 
                                                    min="0"
                                                    step="0.01"
                                                >
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="editInvoiceCredits">Invoice Credits</label>
                                            <div class="input-field currency-input">
                                                <input 
                                                    type="number" 
                                                    id="editInvoiceCredits" 
                                                    min="0"
                                                    step="0.01"
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="total-display mb-8">
                                    <div class="label">Updated Total Due</div>
                                    <div class="amount" id="editTotalDisplay">$0.00</div>
                                </div>

                                <div class="flex gap-4 flex-wrap">
                                    <button type="submit" class="btn btn-success flex-1 sm:flex-none">
                                        <i class="fas fa-save"></i> Update Invoice
                                    </button>
                                    <button type="button" class="btn btn-secondary flex-1 sm:flex-none" id="cancelEditBtn">
                                        <i class="fas fa-times"></i> Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="text-center mt-12 text-gray-600 dark-mode:text-gray-400 text-sm">
                <p>© 2025 Bonnie's Invoice Manager. All data is securely stored in Google Sheets.</p>
            </div>
        </div>
    </div>

    <script>
        // ============================================
        // GLOBAL STATE & CONFIGURATION
        // ============================================
        const state = {
            currentTab: 'create',
            editingInvoiceId: null,
            searchResults: [],
            vendors: [],
            isDarkMode: localStorage.getItem('darkMode') === 'true'
        };

        // Initialize
        document.addEventListener('DOMContentLoaded', initApp);

        function initApp() {
            setupTheme();
            loadVendors();
            setupEventListeners();
            setTodayDate();
        }

        // ============================================
        // THEME MANAGEMENT
        // ============================================
        function setupTheme() {
            const body = document.body;
            if (state.isDarkMode) {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                body.classList.add('light-mode');
                body.classList.remove('dark-mode');
                document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i>';
            }
        }

        document.getElementById('themeToggle').addEventListener('click', function() {
            state.isDarkMode = !state.isDarkMode;
            localStorage.setItem('darkMode', state.isDarkMode);
            setupTheme();
        });

        // ============================================
        // EVENT LISTENERS
        // ============================================
        function setupEventListeners() {
            // Tab switching
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.addEventListener('click', switchTab);
            });

            // Form submission
            document.getElementById('invoiceForm').addEventListener('submit', handleFormSubmit);
            document.getElementById('editInvoiceForm').addEventListener('submit', handleEditSubmit);

            // Real-time calculation
            const costInputs = ['#flowerCost', '#suppliesCost', '#greensCost', '#invoiceCredits'];
            costInputs.forEach(selector => {
                document.querySelector(selector).addEventListener('input', calculateTotal);
            });

            const editCostInputs = ['#editFlowerCost', '#editSuppliesCost', '#editGreensCost', '#editInvoiceCredits'];
            editCostInputs.forEach(selector => {
                document.querySelector(selector).addEventListener('input', calculateEditTotal);
            });

            // Vendor dropdown
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

            // Edit Vendor dropdown
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

            // Search buttons
            document.getElementById('searchByNumberBtn').addEventListener('click', searchByNumber);
            document.getElementById('searchByDateBtn').addEventListener('click', searchByDate);

            // Cancel edit
            document.getElementById('cancelEditBtn').addEventListener('click', cancelEdit);

            // Set today's date for new invoices
            setTodayDate();
        }

        // ============================================
        // VENDOR MANAGEMENT
        // ============================================
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

            // Show/hide dropdown based on search results
            if (searchTerm === '' || hasVisibleItems) {
                vendorList.classList.remove('hidden');
            } else {
                // If no matching vendors but text entered, still show for potential "add new"
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

            // Show/hide dropdown based on search results
            if (searchTerm === '' || hasVisibleItems) {
                editVendorList.classList.remove('hidden');
            } else {
                if (searchTerm.length > 0) {
                    editVendorList.classList.remove('hidden');
                }
            }
        }

        // ============================================
        // TAB MANAGEMENT
        // ============================================
        function switchTab(e) {
            const tabName = e.target.closest('.tab-button').getAttribute('data-tab');
            
            // Update buttons
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.closest('.tab-button').classList.add('active');

            // Update content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(\`tab-\${tabName}\`).classList.add('active');

            state.currentTab = tabName;
        }

        // ============================================
        // FORM CALCULATIONS
        // ============================================
        function calculateTotal() {
            const flowerCost = parseFloat(document.getElementById('flowerCost').value) || 0;
            const suppliesCost = parseFloat(document.getElementById('suppliesCost').value) || 0;
            const greensCost = parseFloat(document.getElementById('greensCost').value) || 0;
            const credits = parseFloat(document.getElementById('invoiceCredits').value) || 0;

            const total = flowerCost + suppliesCost + greensCost - credits;
            displayTotal(total, 'totalDisplay');
        }

        function calculateEditTotal() {
            const flowerCost = parseFloat(document.getElementById('editFlowerCost').value) || 0;
            const suppliesCost = parseFloat(document.getElementById('editSuppliesCost').value) || 0;
            const greensCost = parseFloat(document.getElementById('editGreensCost').value) || 0;
            const credits = parseFloat(document.getElementById('editInvoiceCredits').value) || 0;

            const total = flowerCost + suppliesCost + greensCost - credits;
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

        // ============================================
        // FORM SUBMISSION
        // ============================================
        function handleFormSubmit(e) {
            e.preventDefault();
            clearErrors();

            const invoiceData = {
                vendor: document.getElementById('vendorSelect').value.trim(),
                invoiceNumber: document.getElementById('invoiceNumber').value.trim(),
                invoiceDate: document.getElementById('invoiceDate').value,
                flowerCost: parseFloat(document.getElementById('flowerCost').value) || 0,
                suppliesCost: parseFloat(document.getElementById('suppliesCost').value) || 0,
                greensCost: parseFloat(document.getElementById('greensCost').value) || 0,
                invoiceCredits: parseFloat(document.getElementById('invoiceCredits').value) || 0
            };

            if (!validateForm(invoiceData)) {
                return;
            }

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

            if (data.flowerCost < 0) {
                showError('flowerCostError', 'Amount cannot be negative');
                isValid = false;
            }

            if (data.suppliesCost < 0) {
                showError('suppliesCostError', 'Amount cannot be negative');
                isValid = false;
            }

            if (data.greensCost < 0) {
                showError('greensCostError', 'Amount cannot be negative');
                isValid = false;
            }

            if (data.invoiceCredits < 0) {
                showError('invoiceCreditsError', 'Credits cannot be negative');
                isValid = false;
            }

            return isValid;
        }

        function submitToServer(data) {
            showLoading(true);

            // Check if vendor needs to be added (not in current list)
            const vendorExists = state.vendors.some(v => v.toLowerCase() === data.vendor.toLowerCase());
            
            const submitCallback = function(result) {
                showLoading(false);
                if (result.success) {
                    showToast('Invoice submitted successfully! ID: ' + result.invoiceId, 'success');
                    document.getElementById('invoiceForm').reset();
                    calculateTotal();
                    setTodayDate();
                    // Reload vendors in case a new one was added
                    loadVendors();
                } else {
                    showToast(result.message || 'An error occurred', 'error');
                }
            };

            if (!vendorExists) {
                // Add new vendor first, then submit invoice
                google.script.run
                    .withSuccessHandler(function(vendorResult) {
                        if (vendorResult.success) {
                            // Vendor added successfully, now submit invoice
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
                // Vendor already exists, just submit invoice
                google.script.run
                    .withSuccessHandler(submitCallback)
                    .withFailureHandler(function(error) {
                        showLoading(false);
                        showToast('Error: ' + error, 'error');
                    })
                    .submitInvoice(data);
            }
        }

        // ============================================
        // SEARCH FUNCTIONALITY
        // ============================================
        function searchByNumber() {
            const searchValue = document.getElementById('searchInvoiceNumber').value.trim();
            console.log('=== searchByNumber CALLED ===');
            console.log('searchValue:', searchValue);

            if (!searchValue) {
                console.log('Search value is empty, showing toast');
                showToast('Please enter an invoice number', 'info');
                return;
            }

            console.log('Showing loading overlay');
            showLoading(true);
            console.log('About to call google.script.run.searchInvoices');

            google.script.run
                .withSuccessHandler(function(response) {
                    try {
                        console.log('=== SUCCESS HANDLER FIRED ===');
                        console.log('Raw response:', response);
                        console.log('Response type:', typeof response);
                        console.log('Is array:', Array.isArray(response));
                        
                        // Response is now returned directly as an array
                        let results = [];
                        
                        if (Array.isArray(response)) {
                            results = response;
                            console.log('Response is directly an array with ' + results.length + ' items');
                        } else if (response && typeof response === 'object' && response.data && Array.isArray(response.data)) {
                            // Fallback for wrapped response format
                            results = response.data;
                            console.log('Response has data property with array');
                        } else {
                            console.log('WARNING: Response is not an array');
                            results = [];
                        }
                        
                        console.log('Final results:', results);
                        console.log('Final results is array:', Array.isArray(results));
                        console.log('Final results length:', results.length);
                        
                        showLoading(false);
                        displaySearchResults(results);
                    } catch (err) {
                        console.log('ERROR in success handler:', err);
                        console.log('Error message:', err.message);
                        console.log('Error stack:', err.stack);
                        showLoading(false);
                        showToast('Error processing search results: ' + err.message, 'error');
                    }
                })
                .withFailureHandler(function(error) {
                    console.log('=== FAILURE HANDLER FIRED ===');
                    console.log('FAILURE HANDLER - Error:', error);
                    showLoading(false);
                    showToast('Search error: ' + error, 'error');
                })
                .searchInvoices('number', searchValue);
        }

        function searchByDate() {
            const fromDate = document.getElementById('searchDateFrom').value;
            const toDate = document.getElementById('searchDateTo').value;

            console.log('=== DATE SEARCH INITIATED ===');
            console.log('From Date:', fromDate);
            console.log('To Date:', toDate);

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
                .withSuccessHandler(function(response) {
                    try {
                        console.log('=== DATE SEARCH RESPONSE ===');
                        console.log('Response:', response);
                        console.log('Response type:', typeof response);
                        console.log('Is array:', Array.isArray(response));
                        console.log('Response length:', response ? response.length : 'N/A');
                        
                        if (Array.isArray(response) && response.length > 0) {
                            console.log('First result:', response[0]);
                            console.log('First result invoice date:', response[0].invoiceDate);
                        }
                        
                        let results = [];
                        if (Array.isArray(response)) {
                            results = response;
                        } else if (response && response.data && Array.isArray(response.data)) {
                            results = response.data;
                        }
                        
                        console.log('Final results count:', results.length);
                        showLoading(false);
                        displaySearchResults(results);
                    } catch (err) {
                        console.log('Error in date search handler:', err);
                        showLoading(false);
                        showToast('Error: ' + err.message, 'error');
                    }
                })
                .withFailureHandler(function(error) {
                    console.log('Date search failure handler - error:', error);
                    showLoading(false);
                    showToast('Search error: ' + error, 'error');
                })
                .searchInvoices('dateRange', { from: fromDate, to: toDate });
        }

        function displaySearchResults(results) {
            try {
                console.log('=== DISPLAY SEARCH RESULTS CALLED ===');
                console.log('results:', results);
                console.log('results type:', typeof results);
                console.log('Array.isArray(results):', Array.isArray(results));
                
                const container = document.getElementById('searchResults');
                
                // Ensure results is an array
                if (!Array.isArray(results)) {
                    console.log('WARNING: results is not an array, converting to empty array');
                    results = [];
                }
                
                if (!results || results.length === 0) {
                    console.log('No results or empty array - showing empty state');
                    container.innerHTML = \`
                        <div class="empty-state">
                            <i class="fas fa-search"></i>
                            <h3 class="text-gray-700 dark-mode:text-gray-300 text-lg font-semibold mt-4">No invoices found</h3>
                            <p class="text-gray-500 dark-mode:text-gray-400">Try adjusting your search criteria</p>
                        </div>
                    \`;
                    return;
                }

                console.log('Building table with ' + results.length + ' results');
                state.searchResults = results;
                
                // ALERT BOX DEBUG - show first invoice date
                if (results.length > 0) {
                    alert('First invoice raw date value: ' + results[0].invoiceDate + '\\n\\nType: ' + typeof results[0].invoiceDate);
                }

                let html = \`
                    <div class="overflow-x-auto">
                        <table class="search-result-table">
                            <thead>
                                <tr>
                                    <th>Invoice #</th>
                                    <th>Date</th>
                                    <th>Vendor</th>
                                    <th>Total</th>
                                    <th>Created</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                \`;

                results.forEach((invoice, index) => {
                    html += \`
                        <tr>
                            <td class="font-semibold">\${invoice.invoiceNumber}</td>
                            <td>\${formatDate(invoice.invoiceDate)}</td>
                            <td>\${invoice.vendor || 'N/A'}</td>
                            <td class="font-semibold">\${formatCurrency(invoice.total)}</td>
                            <td class="text-sm text-gray-500 dark-mode:text-gray-400">\${invoice.createdTimestamp}</td>
                            <td>
                                <button class="edit-button" onclick="editInvoice(\${index})">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                            </td>
                        </tr>
                    \`;
                });

                html += \`
                            </tbody>
                        </table>
                    </div>
                \`;

                console.log('Setting innerHTML');
                container.innerHTML = html;
                console.log('displaySearchResults complete');
            } catch (err) {
                console.log('ERROR in displaySearchResults:', err);
                console.log('Error message:', err.message);
                console.log('Error stack:', err.stack);
                document.getElementById('searchResults').innerHTML = '<div class="error-message">Error displaying results: ' + err.message + '</div>';
            }
        }

        function formatDate(dateString) {
            console.log('formatDate called with:', dateString);
            // Parse YYYY-MM-DD format without timezone conversion
            const parts = dateString.split('-');
            console.log('Date parts:', parts);
            if (parts.length === 3) {
                const year = parts[0];
                const monthNum = parseInt(parts[1]);
                const day = parseInt(parts[2]);
                
                console.log('Parsed - Year:', year, 'Month:', monthNum, 'Day:', day);
                
                // Create month name array
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const monthName = months[monthNum - 1];
                
                // Return formatted string directly without Date object conversion
                const result = monthName + ' ' + day + ', ' + year;
                console.log('formatDate result:', result);
                return result;
            }
            // Fallback for other formats
            console.log('Using fallback date parsing');
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        }

        function formatDateTime(dateTimeString) {
            if (!dateTimeString || dateTimeString === 'N/A') return 'N/A';
            const date = new Date(dateTimeString);
            return date.toLocaleString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }

        // ============================================
        // EDIT FUNCTIONALITY
        // ============================================
        function editInvoice(index) {
            const invoice = state.searchResults[index];
            state.editingInvoiceId = invoice.id;

            document.getElementById('editInvoiceId').value = invoice.id;
            document.getElementById('editInvoiceNumber').value = invoice.invoiceNumber;
            
            // Invoice date should already be in YYYY-MM-DD format from backend
            document.getElementById('editInvoiceDate').value = invoice.invoiceDate || '';
            
            document.getElementById('editVendorSelect').value = invoice.vendor || '';
            document.getElementById('editFlowerCost').value = invoice.flowerCost.toFixed(2);
            document.getElementById('editSuppliesCost').value = invoice.suppliesCost.toFixed(2);
            document.getElementById('editGreensCost').value = invoice.greensCost.toFixed(2);
            document.getElementById('editInvoiceCredits').value = invoice.invoiceCredits.toFixed(2);

            calculateEditTotal();

            document.getElementById('editFormContainer').classList.remove('hidden');
            document.getElementById('editFormContainer').scrollIntoView({ behavior: 'smooth' });
        }

        function handleEditSubmit(e) {
            e.preventDefault();
            
            // Validate invoice date
            const dateField = document.getElementById('editInvoiceDate');
            const invoiceDate = dateField.value;
            
            if (!invoiceDate || invoiceDate === '') {
                showToast('Invoice date is required', 'error');
                dateField.style.borderColor = '#ef4444';
                dateField.style.borderWidth = '3px';
                dateField.focus();
                return false;
            }
            
            // Clear error styling if valid
            dateField.style.borderColor = '';
            dateField.style.borderWidth = '';

            const updatedData = {
                id: document.getElementById('editInvoiceId').value,
                vendor: document.getElementById('editVendorSelect').value.trim(),
                invoiceDate: invoiceDate,
                flowerCost: parseFloat(document.getElementById('editFlowerCost').value) || 0,
                suppliesCost: parseFloat(document.getElementById('editSuppliesCost').value) || 0,
                greensCost: parseFloat(document.getElementById('editGreensCost').value) || 0,
                invoiceCredits: parseFloat(document.getElementById('editInvoiceCredits').value) || 0
            };

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

        // ============================================
        // UTILITY FUNCTIONS
        // ============================================
        function setTodayDate() {
            const today = new Date().toISOString().split('T')[0];
            const dateInput = document.getElementById('invoiceDate');
            if (dateInput && !dateInput.value) {
                dateInput.value = today;
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
            toast.className = \`toast \${type}\`;
            toast.innerHTML = \`
                <i class="fas fa-\${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>\${message}</span>
            \`;
            
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
    </script>
</body>
</html>
  `;

  return HtmlService.createHtmlOutput(html).setWidth(1024).setHeight(800);
}
