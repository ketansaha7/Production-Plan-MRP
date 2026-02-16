// Production Plan Warehouse Group Enhancement
// Adds warehouse group selection and recalculates MR items based on warehouse stock

frappe.ui.form.on('Production Plan', {
    refresh: function(frm) {
        // Add custom button to recalculate based on warehouse
        if (frm.doc.warehouse_group && !frm.doc.docstatus) {
            frm.add_custom_button(__('Recalculate by Warehouse'), function() {
                recalculate_mr_items(frm);
            }, __('Actions'));
        }
    },
    
    onload: function(frm) {
        // Add warehouse group field if it doesn't exist in the form
        add_warehouse_group_field(frm);
    },
    
    warehouse_group: function(frm) {
        if (frm.doc.warehouse_group) {
            // When warehouse group is selected, recalculate all items
            frappe.show_alert({
                message: __('Warehouse Group selected. Click "Recalculate by Warehouse" to update quantities'),
                indicator: 'blue'
            });
        }
    },
    
    before_submit: function(frm) {
        // Validate that if warehouse group is selected, items are calculated
        if (frm.doc.warehouse_group && frm.doc.mr_items && frm.doc.mr_items.length > 0) {
            return new Promise((resolve, reject) => {
                frappe.confirm(
                    __('Have you recalculated the MR items based on the selected warehouse group?'),
                    () => resolve(),
                    () => reject()
                );
            });
        }
    }
});

// Child table event handlers
frappe.ui.form.on('Material Request Plan Item', {
    item_code: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        
        // If warehouse group is selected, get item qty from that warehouse group
        if (frm.doc.warehouse_group && row.item_code) {
            get_item_qty_from_warehouse_group(frm, row);
        }
    }
});

function add_warehouse_group_field(frm) {
    // Check if the field already exists in the doctype
    // If not, we'll add it via customize form or custom field
    
    if (!frm.fields_dict.warehouse_group) {
        // Field needs to be added via Custom Field
        // This is informational - users need to create custom field manually
        console.log('Warehouse Group field needs to be added as a Custom Field');
    }
}

function recalculate_mr_items(frm) {
    if (!frm.doc.warehouse_group) {
        frappe.msgprint(__('Please select a Warehouse Group first'));
        return;
    }
    
    if (!frm.doc.mr_items || frm.doc.mr_items.length === 0) {
        frappe.msgprint(__('No Material Request items to calculate'));
        return;
    }
    
    frappe.call({
        method: 'production_warehouse_app.api.recalculate_mr_items',
        args: {
            production_plan_name: frm.doc.name
        },
        freeze: true,
        freeze_message: __('Recalculating quantities...'),
        callback: function(r) {
            if (r.message) {
                let updated_count = 0;
                
                // Update each row with the calculated values
                r.message.forEach(item => {
                    let row = frm.doc.mr_items.find(d => d.name === item.name);
                    if (row) {
                        frappe.model.set_value(row.doctype, row.name, 'actual_qty', item.actual_qty);
                        frappe.model.set_value(row.doctype, row.name, 'required_qty', item.required_qty);
                        frappe.model.set_value(row.doctype, row.name, 'warehouse', frm.doc.warehouse_group);
                        updated_count++;
                    }
                });
                
                frm.refresh_field('mr_items');
                
                frappe.show_alert({
                    message: __('Updated {0} items based on warehouse stock', [updated_count]),
                    indicator: 'green'
                });
            }
        },
        error: function(r) {
            frappe.msgprint(__('Error recalculating items. Please check if warehouse group is valid.'));
        }
    });
}

function get_item_qty_from_warehouse_group(frm, row) {
    frappe.call({
        method: 'production_warehouse_app.api.get_item_qty_by_warehouse_group',
        args: {
            item_code: row.item_code,
            warehouse_group: frm.doc.warehouse_group,
            company: frm.doc.company
        },
        callback: function(r) {
            if (r.message) {
                // Update the row with available quantity info
                let available_qty = r.message.available_qty || 0;
                let required_qty = row.quantity - available_qty;
                
                // Set values in the child table
                frappe.model.set_value(row.doctype, row.name, 'actual_qty', available_qty);
                frappe.model.set_value(row.doctype, row.name, 'required_qty', required_qty > 0 ? required_qty : 0);
                
                // Show warehouse-wise breakdown in a message
                if (r.message.warehouses && r.message.warehouses.length > 0) {
                    let warehouse_info = r.message.warehouses.map(w => 
                        `${w.warehouse}: ${w.available_qty} (Actual: ${w.actual_qty}, Reserved: ${w.reserved_qty})`
                    ).join('<br>');
                    
                    frappe.show_alert({
                        message: __('Available Qty: {0}<br>{1}', [available_qty, warehouse_info]),
                        indicator: 'blue'
                    }, 10);
                }
            }
        }
    });
}

// Add indicator for warehouse group status
frappe.ui.form.on('Production Plan', {
    refresh: function(frm) {
        if (frm.doc.warehouse_group) {
            frm.dashboard.add_indicator(__('Warehouse Group: {0}', [frm.doc.warehouse_group]), 'blue');
        }
    }
});
