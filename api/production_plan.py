# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.utils import flt


def validate_warehouse_group(doc, method):
    """
    Validate that the selected warehouse group exists if provided
    """
    if doc.get("warehouse_group"):
        if not frappe.db.exists("Warehouse", {"name": doc.warehouse_group, "is_group": 1}):
            frappe.throw(_("Selected Warehouse Group {0} does not exist or is not a group warehouse").format(
                doc.warehouse_group
            ))


def calculate_mr_items_by_warehouse(doc, method):
    """
    Calculate material request items based on selected warehouse group
    This will recalculate quantities based on actual stock in warehouses
    """
    if not doc.get("warehouse_group"):
        return
    
    # Get all child warehouses under the selected warehouse group
    child_warehouses = get_child_warehouses(doc.warehouse_group)
    
    if not child_warehouses:
        return
    
    # Update MR items with warehouse-specific calculations
    for mr_item in doc.get("mr_items", []):
        if mr_item.item_code:
            # Get total available quantity from child warehouses
            total_available_qty = get_total_available_qty(
                mr_item.item_code,
                child_warehouses,
                doc.company
            )
            
            # Calculate actual required quantity
            actual_required_qty = flt(mr_item.quantity) - flt(total_available_qty)
            
            # Update the item with warehouse calculation details
            mr_item.actual_qty = flt(total_available_qty)
            mr_item.required_qty = flt(actual_required_qty) if actual_required_qty > 0 else 0
            
            # Store warehouse group for reference
            mr_item.warehouse = doc.warehouse_group


def get_child_warehouses(warehouse_group):
    """
    Get all child warehouses under a warehouse group recursively
    """
    if not warehouse_group:
        return []
    
    warehouses = []
    
    # Get direct children
    children = frappe.get_all(
        "Warehouse",
        filters={"parent_warehouse": warehouse_group, "is_group": 0, "disabled": 0},
        pluck="name"
    )
    
    warehouses.extend(children)
    
    # Get warehouse groups under this group and recursively get their children
    warehouse_groups = frappe.get_all(
        "Warehouse",
        filters={"parent_warehouse": warehouse_group, "is_group": 1, "disabled": 0},
        pluck="name"
    )
    
    for wh_group in warehouse_groups:
        warehouses.extend(get_child_warehouses(wh_group))
    
    return warehouses


def get_total_available_qty(item_code, warehouses, company):
    """
    Get total available quantity of an item across multiple warehouses
    """
    if not item_code or not warehouses:
        return 0
    
    total_qty = 0
    
    for warehouse in warehouses:
        bin_data = frappe.db.get_value(
            "Bin",
            {"item_code": item_code, "warehouse": warehouse},
            ["actual_qty", "reserved_qty", "ordered_qty", "planned_qty"],
            as_dict=1
        )
        
        if bin_data:
            # Calculate available quantity (actual - reserved)
            available = flt(bin_data.actual_qty) - flt(bin_data.reserved_qty)
            total_qty += available if available > 0 else 0
    
    return total_qty
