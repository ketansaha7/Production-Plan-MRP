# Production Warehouse App - Usage Guide

This comprehensive guide explains how to use the Production Warehouse App for effective Material Resource Planning (MRP) with warehouse group selection.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Detailed Workflows](#detailed-workflows)
3. [Use Cases](#use-cases)
4. [Best Practices](#best-practices)
5. [Troubleshooting](#troubleshooting)
6. [FAQs](#faqs)

---

## Quick Start

### Basic Steps

1. **Open Production Plan**
   - Navigate to: **Manufacturing > Production Plan > New**

2. **Select Warehouse Group**
   - Find the "Warehouse Group" field (after "For Warehouse")
   - Select a warehouse group from the dropdown

3. **Get Items**
   - Click "Get Items For Manufacture" or "Get Items for Assembly"
   - Material requirements are populated in the MR Items table

4. **Calculate Stock**
   - Click **Actions > Recalculate by Warehouse**
   - System calculates available stock from selected warehouse group
   - Updates actual quantities and required quantities

5. **Review and Submit**
   - Check the calculated quantities
   - Submit the Production Plan

---

## Detailed Workflows

### Workflow 1: Planning Production with Warehouse Groups

**Scenario**: You want to plan production considering stock from multiple warehouses under a warehouse group.

**Step-by-Step**:

1. **Create Production Plan**
   ```
   Manufacturing > Production Plan > New
   ```

2. **Set Basic Details**
   - Company: Select your company
   - From Date: Start date
   - To Date: End date
   - Get Items From: Material Request

3. **Select Warehouse Group**
   - Warehouse Group: "Main Stores" (example)
   - This will consider all child warehouses under Main Stores

4. **Configure Items to Manufacture**
   - Click "Get Sales Orders" or manually add items
   - Set quantities for each item

5. **Get Material Requirements**
   - Click "Get Items For Manufacture"
   - System populates mr_items table with required materials

6. **Calculate Based on Warehouse**
   - Click **Actions > Recalculate by Warehouse**
   - For each item:
     * Actual Qty shows available stock in warehouse group
     * Required Qty shows what needs to be procured
     * Formula: Required Qty = Original Qty - Actual Qty

7. **Review Warehouse Details**
   - Hover over items to see warehouse-wise breakdown
   - Alert shows stock in each child warehouse

8. **Adjust if Needed**
   - Modify production quantities
   - Click "Recalculate by Warehouse" again
   - Repeat until satisfied

9. **Submit**
   - Click "Submit"
   - Warehouse calculations are saved

---

### Workflow 2: Comparing Multiple Warehouse Groups

**Scenario**: You want to see material requirements from different warehouse groups.

**Step-by-Step**:

1. **Create First Calculation**
   - Create Production Plan
   - Select Warehouse Group: "Main Stores"
   - Click "Recalculate by Warehouse"
   - Note the Required Qty for each item

2. **Change Warehouse Group**
   - Change Warehouse Group to: "Regional Warehouses"
   - Click "Recalculate by Warehouse"
   - Compare Required Qty values

3. **Make Decision**
   - Choose warehouse group with lower requirements
   - This indicates better stock availability

4. **Save and Proceed**
   - Keep the selected warehouse group
   - Submit the Production Plan

---

### Workflow 3: Real-time Stock Checking While Adding Items

**Scenario**: Check stock availability as you add each item.

**Step-by-Step**:

1. **Set Warehouse Group First**
   - Create Production Plan
   - Select Warehouse Group: "Factory Stores"

2. **Add Items to MR Items Table**
   - Click "Get Items For Manufacture"
   - As each item is added:
     * System automatically checks stock
     * Shows popup with available quantity
     * Displays warehouse-wise breakdown

3. **Review Automatic Calculations**
   - Each row shows:
     * Quantity: Required quantity
     * Actual Qty (Warehouse): Available in warehouse group
     * Required Qty: What needs to be procured

4. **Make Procurement Decisions**
   - Items with Required Qty > 0 need procurement
   - Items with Required Qty = 0 have sufficient stock

---

## Use Cases

### Use Case 1: Multi-Location Manufacturing

**Situation**: Company has warehouses in different locations. Need to plan production based on stock availability across all locations.

**Solution**:
1. Create warehouse group "All Locations"
2. Add all location warehouses as children
3. Use this group in Production Plan
4. System calculates total available stock across all locations

**Benefits**:
- Unified view of stock
- Better resource utilization
- Reduced procurement costs

---

### Use Case 2: Department-wise Stock Planning

**Situation**: Different departments have separate warehouses. Need to plan production from a specific department's stock.

**Solution**:
1. Create warehouse group "Production Department"
2. Include only production department warehouses
3. Use in Production Plan
4. Calculates stock only from relevant warehouses

**Benefits**:
- Department-specific planning
- Better cost allocation
- Clearer accountability

---

### Use Case 3: Regional Stock Optimization

**Situation**: Company operates in multiple regions. Want to optimize production based on regional stock levels.

**Solution**:
1. Create warehouse groups: "North Region", "South Region", etc.
2. Create separate Production Plans for each region
3. Compare Required Qty across regions
4. Allocate production to region with best stock availability

**Benefits**:
- Reduced transportation costs
- Better regional inventory management
- Optimized production allocation

---

### Use Case 4: Quality-based Warehouse Selection

**Situation**: Company has separate warehouses for different quality grades. Want to plan production using specific quality stock.

**Solution**:
1. Create warehouse groups: "Grade A Stock", "Grade B Stock"
2. Select appropriate group based on product requirements
3. Calculate material needs from that quality level

**Benefits**:
- Quality compliance
- Better traceability
- Reduced quality issues

---

## Best Practices

### 1. Warehouse Hierarchy Setup

**Best Practice**: Set up a clear warehouse hierarchy before using the app.

```
Main Stores (Group)
├── Factory Warehouse 1
├── Factory Warehouse 2
└── Raw Material Store (Group)
    ├── RM Store A
    └── RM Store B
```

**Why**: Proper hierarchy ensures accurate calculations.

---

### 2. Regular Stock Updates

**Best Practice**: Ensure stock records are updated regularly.

**How**:
- Conduct regular stock reconciliations
- Update Bin records promptly
- Process stock entries timely

**Why**: Calculations are only as good as your stock data.

---

### 3. Recalculate Before Submission

**Best Practice**: Always click "Recalculate by Warehouse" before submitting.

**When**:
- Before final submission
- After modifying quantities
- After changing warehouse group

**Why**: Ensures calculations reflect latest stock levels.

---

### 4. Use Meaningful Warehouse Group Names

**Best Practice**: Name warehouse groups descriptively.

**Good Examples**:
- "All Production Warehouses"
- "Regional - North India"
- "Quality Grade A Stock"

**Bad Examples**:
- "Group 1"
- "WH Group"
- "Misc"

**Why**: Clear names prevent confusion and errors.

---

### 5. Monitor Actual vs Required Quantities

**Best Practice**: Review both Actual Qty and Required Qty columns.

**What to Check**:
- High Required Qty = Low stock, needs procurement
- Zero Required Qty = Sufficient stock available
- Negative values = Check for data issues

**Action**: Plan procurement based on Required Qty values.

---

### 6. Document Your Warehouse Strategy

**Best Practice**: Maintain documentation of which warehouse groups to use for different scenarios.

**Example Document**:
```
Production Type: High Volume
Warehouse Group: All Factory Warehouses
Reason: Need maximum stock availability

Production Type: Custom Orders
Warehouse Group: Finished Goods Store
Reason: Use finished components first
```

---

## Troubleshooting

### Problem 1: Warehouse Group Field Not Visible

**Symptoms**: Can't see Warehouse Group field in Production Plan

**Solutions**:
1. Check if you're looking after "For Warehouse" field
2. Verify custom field is installed (Customize Form)
3. Clear cache and reload page
4. Check user permissions

---

### Problem 2: Incorrect Quantity Calculations

**Symptoms**: Actual Qty or Required Qty seems wrong

**Check**:
1. Warehouse hierarchy is correct
2. Bin records exist for items
3. Child warehouses are not disabled
4. Reserved quantities are up to date

**Fix**:
1. Go to Stock > Bin
2. Verify actual and reserved quantities
3. Run "Repost Item Valuation" if needed
4. Recalculate in Production Plan

---

### Problem 3: Recalculate Button Not Showing

**Symptoms**: "Recalculate by Warehouse" button is missing

**Causes**:
- Warehouse Group not selected
- Document is submitted (can't modify)
- JavaScript not loaded

**Fix**:
1. Select a Warehouse Group
2. Ensure document is in Draft status
3. Refresh page (Ctrl+F5)
4. Check browser console for errors

---

### Problem 4: No Child Warehouses Found

**Symptoms**: Message says "No child warehouses found"

**Check**:
1. Selected warehouse is actually a group (Is Group = Yes)
2. Group has child warehouses
3. Child warehouses are enabled
4. Parent-child relationship is set correctly

**Fix**:
1. Go to Stock > Warehouse
2. Open the warehouse group
3. Verify "Is Group" is checked
4. Check child warehouses have "Parent Warehouse" set

---

### Problem 5: Stock Shows Zero Despite Having Stock

**Symptoms**: Actual Qty shows 0 but stock exists

**Possible Causes**:
1. Stock is in warehouses not under selected group
2. All stock is reserved
3. Bin records not updated
4. Wrong company selected

**Fix**:
1. Check if stock is in correct warehouse
2. Review reserved quantities
3. Run "Repost Stock" from Stock Ledger
4. Verify company matches

---

## FAQs

### Q1: Can I use this with non-group warehouses?

**A**: No, you must select a warehouse group (a warehouse with "Is Group" checked). The app needs a group to fetch child warehouses.

---

### Q2: Does it consider stock in sub-groups?

**A**: Yes! The calculation is recursive - it includes all levels of child warehouses under the selected group.

---

### Q3: How is "Actual Qty" calculated?

**A**: 
```
Actual Qty = Sum of (Actual Qty - Reserved Qty) for all child warehouses
Only positive values are included.
```

---

### Q4: How is "Required Qty" calculated?

**A**:
```
Required Qty = Original Quantity - Actual Qty
If result is negative, Required Qty = 0
```

---

### Q5: Can I manually edit Actual Qty or Required Qty?

**A**: No, these are read-only calculated fields. They're automatically computed based on warehouse stock.

---

### Q6: What happens if I change warehouse group after calculation?

**A**: You need to click "Recalculate by Warehouse" again to update quantities based on the new warehouse group.

---

### Q7: Does this work with batched items?

**A**: Yes, but the calculation is based on total Bin quantity regardless of batches. Batch-specific logic is not included in v1.0.

---

### Q8: Can I use multiple warehouse groups in one Production Plan?

**A**: No, you can select only one warehouse group per Production Plan. To compare multiple groups, create separate plans.

---

### Q9: Does this integrate with Material Request creation?

**A**: Yes, when you create Material Requests from Production Plan, the Required Qty values can guide the requested quantities.

---

### Q10: What if I have overlapping warehouse groups?

**A**: Be careful! If warehouse groups overlap (same child warehouse in multiple groups), select the appropriate group based on your planning needs.

---

## Tips and Tricks

### Tip 1: Quick Stock Check

Instead of going to Stock reports, quickly check item availability by:
1. Adding item to MR Items
2. Warehouse-wise breakdown appears automatically

---

### Tip 2: Zero-Procurement Planning

To plan production without any procurement:
1. Select comprehensive warehouse group
2. Recalculate
3. Only proceed with items where Required Qty = 0

---

### Tip 3: Procurement Priority

Items with highest "Required Qty" should be procured first to avoid production delays.

---

### Tip 4: Warehouse Comparison

Create a spreadsheet comparing Required Qty across different warehouse groups to optimize warehouse selection.

---

### Tip 5: Stock Alerts

If Actual Qty is consistently low, consider:
- Adjusting reorder levels
- Reviewing safety stock
- Improving procurement processes

---

## Advanced Usage

### Scenario: Multi-Stage Production with Different Warehouse Groups

1. **Stage 1: Raw Material Check**
   - Warehouse Group: "Raw Material Stores"
   - Check availability of raw materials

2. **Stage 2: WIP Check**
   - Warehouse Group: "Work in Progress"
   - Check for semi-finished items

3. **Stage 3: Final Assembly**
   - Warehouse Group: "Assembly Line Stores"
   - Plan final assembly requirements

By using different warehouse groups at different stages, you get precise material planning for each production phase.

---

## Conclusion

The Production Warehouse App enhances ERPNext's MRP capabilities by allowing warehouse group-based planning. Follow this guide to maximize its benefits for your production planning process.

For technical details, see README.md
For installation help, see INSTALLATION_GUIDE.md

---

**Happy Planning! 🏭📦**
