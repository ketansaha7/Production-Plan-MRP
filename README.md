# Production Warehouse App for ERPNext

## Overview
This custom ERPNext app enhances the Production Plan doctype by adding warehouse group selection functionality for Material Resource Planning (MRP). It allows users to select a warehouse group and automatically calculates material requirements based on the actual stock available in all child warehouses under that group.

## Features

### 1. Warehouse Group Selection
- Add a "Warehouse Group" field to the Production Plan form
- Select any warehouse group to base material calculations on
- Automatically fetches all child warehouses recursively

### 2. Intelligent Stock Calculation
- Calculates actual available quantity from all child warehouses
- Considers actual stock minus reserved stock
- Shows warehouse-wise breakdown of available quantities
- Updates Material Request items with accurate requirements

### 3. Enhanced MR Items Table
The `mr_items` table now includes:
- **Actual Qty (Warehouse)**: Total available quantity in the selected warehouse group
- **Required Qty**: Calculated requirement after considering available stock (Original Qty - Actual Qty)
- **Warehouse**: Set to the selected warehouse group for reference

### 4. User-Friendly Interface
- Custom "Recalculate by Warehouse" button to refresh calculations
- Real-time quantity updates when items are added
- Warehouse-wise stock breakdown in alerts
- Visual indicators for warehouse group status

## Installation

### Prerequisites
- ERPNext version 13.x or higher (compatible with v14 and v15)
- Frappe Framework
- Access to bench commands

### Step 1: Get the App
```bash
# Navigate to your frappe-bench directory
cd /path/to/frappe-bench

# Get the app from your repository (replace with actual path)
bench get-app /path/to/production_warehouse_app

# Or if you have it in a git repository
bench get-app https://github.com/yourusername/production_warehouse_app.git
```

### Step 2: Install on Site
```bash
# Install the app on your site
bench --site your-site-name install-app production_warehouse_app

# Migrate the site
bench --site your-site-name migrate
```

### Step 3: Install Custom Fields
```bash
# Import custom fields
bench --site your-site-name import-csv production_warehouse_app/fixtures/custom_field.json
```

### Step 4: Clear Cache and Build
```bash
# Clear cache
bench --site your-site-name clear-cache

# Build assets
bench build --app production_warehouse_app

# Restart bench
bench restart
```

## Manual Installation of Custom Fields

If the automatic installation of custom fields doesn't work, you can add them manually:

### For Production Plan Doctype:

1. Go to: **Customize Form**
2. Select **Production Plan**
3. Add the following field:
   - **Field Name**: warehouse_group
   - **Label**: Warehouse Group
   - **Field Type**: Link
   - **Options**: Warehouse
   - **Insert After**: for_warehouse
   - **Get Query**: `return {filters: {'is_group': 1, 'disabled': 0}}`
   - **Description**: Select a warehouse group to calculate material requirements from all child warehouses

### For Material Request Plan Item (Child Table):

1. Go to: **Customize Form**
2. Select **Material Request Plan Item**
3. Add the following fields:

   a. **actual_qty**
   - **Label**: Actual Qty (Warehouse)
   - **Field Type**: Float
   - **Insert After**: quantity
   - **In List View**: Checked
   - **Read Only**: Checked
   - **Precision**: 2

   b. **required_qty**
   - **Label**: Required Qty
   - **Field Type**: Float
   - **Insert After**: actual_qty
   - **In List View**: Checked
   - **Read Only**: Checked
   - **Bold**: Checked
   - **Precision**: 2

## Usage

### Basic Workflow

1. **Create a Production Plan**
   - Navigate to Manufacturing > Production Plan > New

2. **Select Warehouse Group**
   - In the Production Plan form, find the "Warehouse Group" field
   - Select a warehouse group (only group warehouses will be shown)
   - This field appears after the "For Warehouse" field

3. **Get Material Requirements**
   - Click on "Get Items for Manufacture" or "Get Material for Assembly"
   - The system will populate the MR Items table

4. **Calculate Based on Warehouse**
   - Click the "Recalculate by Warehouse" button in the Actions menu
   - The system will:
     * Fetch stock from all child warehouses under the selected group
     * Calculate actual available quantity
     * Update the "Actual Qty" field
     * Calculate and show "Required Qty" (what you actually need to procure)

5. **Review Calculations**
   - Check the MR Items table
   - "Actual Qty (Warehouse)" shows available stock
   - "Required Qty" shows what needs to be procured
   - Warehouse field is set to the warehouse group

6. **Submit the Production Plan**
   - Review all quantities
   - Submit the document
   - The warehouse-based calculations are saved

### Advanced Features

#### Real-time Item Quantity Check
When you add an item to the MR Items table:
- The system automatically checks stock in the selected warehouse group
- Shows a popup with warehouse-wise breakdown
- Updates actual and required quantities

#### Warehouse-wise Stock Breakdown
The app shows detailed information including:
- Individual warehouse stock levels
- Actual quantity in each warehouse
- Reserved quantity in each warehouse
- Available quantity (Actual - Reserved)

#### Recalculation
You can recalculate at any time before submission:
- Change the warehouse group
- Click "Recalculate by Warehouse"
- All quantities are updated based on the new warehouse group

## Configuration

### App Configuration
The app uses the following hooks in `hooks.py`:

```python
# JavaScript includes
doctype_js = {
    "Production Plan": "public/js/production_plan_warehouse.js"
}

# Document events
doc_events = {
    "Production Plan": {
        "validate": "production_warehouse_app.api.production_plan.validate_warehouse_group",
        "on_submit": "production_warehouse_app.api.production_plan.calculate_mr_items_by_warehouse"
    }
}
```

### Customization Options

You can customize the behavior by modifying:

1. **Stock Calculation Logic** (`api/production_plan.py`)
   - Modify `get_total_available_qty()` to change how available qty is calculated
   - Currently uses: Actual Qty - Reserved Qty

2. **Warehouse Hierarchy** (`api/production_plan.py`)
   - Modify `get_child_warehouses()` to change how child warehouses are fetched
   - Currently recursive - fetches all levels

3. **Client-side Behavior** (`public/js/production_plan_warehouse.js`)
   - Modify alerts and messages
   - Change button positions
   - Customize field validations

## API Methods

The app provides the following whitelisted API methods:

### 1. get_warehouse_groups()
```python
frappe.call({
    method: 'production_warehouse_app.api.get_warehouse_groups',
    callback: function(r) {
        // Returns list of warehouse groups
    }
});
```

### 2. get_item_qty_by_warehouse_group()
```python
frappe.call({
    method: 'production_warehouse_app.api.get_item_qty_by_warehouse_group',
    args: {
        item_code: 'ITEM-001',
        warehouse_group: 'Main Store',
        company: 'Your Company'
    },
    callback: function(r) {
        // Returns available qty and warehouse-wise breakdown
    }
});
```

### 3. recalculate_mr_items()
```python
frappe.call({
    method: 'production_warehouse_app.api.recalculate_mr_items',
    args: {
        production_plan_name: 'PP-00001'
    },
    callback: function(r) {
        // Returns updated items with calculations
    }
});
```

## Troubleshooting

### Issue: Custom fields not appearing
**Solution**: 
- Run `bench --site your-site clear-cache`
- Check Customize Form to ensure fields are added
- Verify field names match exactly

### Issue: JavaScript not loading
**Solution**:
- Run `bench build --app production_warehouse_app`
- Clear browser cache
- Check browser console for errors

### Issue: Warehouse group showing non-group warehouses
**Solution**:
- Ensure the get_query filter is set correctly in Custom Field
- Filter should be: `{'is_group': 1, 'disabled': 0}`

### Issue: Quantities not calculating correctly
**Solution**:
- Verify Bin records exist for items
- Check if warehouses are enabled
- Ensure warehouse hierarchy is set up correctly

### Issue: "Recalculate by Warehouse" button not showing
**Solution**:
- Ensure warehouse_group field has a value
- Check that document is in draft state (not submitted)
- Verify JavaScript file is loaded

## Technical Details

### File Structure
```
production_warehouse_app/
├── __init__.py
├── hooks.py
├── api/
│   ├── __init__.py
│   └── production_plan.py
├── public/
│   └── js/
│       └── production_plan_warehouse.js
└── fixtures/
    └── custom_field.json
```

### Database Schema Changes
No database tables are created. The app only adds custom fields to existing doctypes:
- Production Plan: 1 new field (warehouse_group)
- Material Request Plan Item: 2 new fields (actual_qty, required_qty)

### Performance Considerations
- Warehouse hierarchy is fetched recursively (may be slow for deep hierarchies)
- Stock quantities are calculated from Bin doctype
- Calculations happen on-demand (when button is clicked)
- Consider indexing if dealing with large warehouse structures

## Compatibility

- **ERPNext Version**: 13.x, 14.x, 15.x
- **Frappe Version**: 13.x, 14.x, 15.x
- **Python Version**: 3.7+
- **Database**: MariaDB, PostgreSQL

## Support and Contribution

### Reporting Issues
If you encounter any issues:
1. Check the troubleshooting section above
2. Review error logs: `bench --site your-site console`
3. Check browser console for JavaScript errors

### Contributing
Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
MIT License

## Credits
Developed for ERPNext MRP enhancement
- Adds warehouse group selection to Production Plan
- Calculates material requirements based on actual warehouse stock
- Improves accuracy of material planning

## Version History

### v1.0.0 (Current)
- Initial release
- Warehouse group selection
- Automatic stock calculation from child warehouses
- MR items recalculation feature
- Real-time quantity updates
- Warehouse-wise stock breakdown

## Future Enhancements
- [ ] Add warehouse group-based stock reservation
- [ ] Include forecasted/planned quantities in calculations
- [ ] Add reports for warehouse group analysis
- [ ] Support for multi-company warehouse groups
- [ ] Batch-wise stock consideration
- [ ] Integration with Production Plan material transfer

---

For more information about ERPNext, visit: https://erpnext.com
For Frappe Framework documentation: https://frappeframework.com
