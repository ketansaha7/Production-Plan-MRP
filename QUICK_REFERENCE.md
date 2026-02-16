# Production Warehouse App - Quick Reference Card

## Installation (One-time Setup)
```bash
cd /path/to/frappe-bench
bench get-app /path/to/production_warehouse_app
bench --site your-site-name install-app production_warehouse_app
bench --site your-site-name migrate
bench --site your-site-name clear-cache
bench build --app production_warehouse_app
bench restart
```

## Key Features
- ✅ Select warehouse groups in Production Plan
- ✅ Auto-calculate stock from child warehouses
- ✅ See actual vs required quantities
- ✅ Warehouse-wise stock breakdown
- ✅ One-click recalculation

## Usage Quick Steps

### 1. Create Production Plan
Manufacturing > Production Plan > New

### 2. Select Warehouse Group
Find "Warehouse Group" field → Select group warehouse

### 3. Get Materials
Click "Get Items For Manufacture"

### 4. Calculate Stock
Actions > Recalculate by Warehouse

### 5. Review & Submit
Check quantities → Submit

## New Fields

### Production Plan
| Field | Description |
|-------|-------------|
| Warehouse Group | Select which warehouse group to use for calculations |

### MR Items Table
| Field | Description |
|-------|-------------|
| Actual Qty (Warehouse) | Available stock in selected warehouse group |
| Required Qty | What needs to be procured (Qty - Actual Qty) |

## Formulas

```
Actual Qty = Sum of (Actual Stock - Reserved) across all child warehouses

Required Qty = Original Quantity - Actual Qty
             = Maximum(0, Quantity - Actual Qty)
```

## Common Actions

### Recalculate Quantities
1. Select/change Warehouse Group
2. Click Actions > Recalculate by Warehouse
3. Review updated quantities

### Check Item Stock
1. Add item to MR Items
2. Popup shows warehouse-wise breakdown
3. Actual Qty auto-populated

### Compare Warehouse Groups
1. Select first warehouse group → Recalculate → Note Required Qty
2. Select second warehouse group → Recalculate → Compare
3. Choose group with lower requirements

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Field not visible | Clear cache, reload page |
| Wrong calculations | Check Bin records, warehouse hierarchy |
| Button not showing | Ensure Warehouse Group selected, doc in Draft |
| Zero stock shown | Verify stock in correct warehouse, check reserved qty |

## Best Practices

✅ Set up warehouse hierarchy before use
✅ Select warehouse group before adding items
✅ Recalculate before submission
✅ Use descriptive warehouse group names
✅ Keep stock records updated
✅ Review both Actual Qty and Required Qty

## Keyboard Shortcuts (ERPNext Standard)

| Action | Shortcut |
|--------|----------|
| Save | Ctrl+S |
| Submit | Ctrl+Shift+S |
| Cancel | Ctrl+Shift+C |
| New | Ctrl+K |
| Search | Ctrl+G |

## Support

📖 Full Guide: See README.md
🔧 Installation: See INSTALLATION_GUIDE.md
💡 Usage Examples: See USAGE_GUIDE.md

## Version Info
**App Version**: 1.0.0
**Compatible with**: ERPNext 13.x, 14.x, 15.x
**License**: MIT

---

**Keep this card handy for quick reference! 📋**
