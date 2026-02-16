# Production Warehouse App - Installation Guide

This guide provides detailed step-by-step instructions for installing the Production Warehouse App on your ERPNext instance.

## Prerequisites

Before you begin, ensure you have:

1. **ERPNext Instance Running**
   - ERPNext v13.x, v14.x, or v15.x
   - Frappe Framework installed
   - Access to the server/terminal

2. **Permissions**
   - SSH access to your server
   - Sudo privileges (if required)
   - System Manager role in ERPNext

3. **Knowledge Required**
   - Basic command line usage
   - Understanding of ERPNext bench commands
   - Familiarity with ERPNext Production Plan

## Installation Methods

### Method 1: Install from Local Directory (Recommended for Development)

#### Step 1: Copy the App to Your Server

```bash
# If you have the app files locally, copy them to your server
scp -r production_warehouse_app user@your-server:/tmp/

# SSH into your server
ssh user@your-server
```

#### Step 2: Navigate to Bench Directory

```bash
# Go to your frappe-bench directory
cd /path/to/frappe-bench

# Example paths:
# cd ~/frappe-bench
# cd /home/frappe/frappe-bench
```

#### Step 3: Get the App

```bash
# Get the app from local directory
bench get-app /tmp/production_warehouse_app
```

#### Step 4: Install on Your Site

```bash
# Replace 'your-site-name' with your actual site name
bench --site your-site-name install-app production_warehouse_app
```

#### Step 5: Migrate the Database

```bash
# Run migrations
bench --site your-site-name migrate
```

#### Step 6: Clear Cache and Build

```bash
# Clear cache
bench --site your-site-name clear-cache

# Build assets
bench build --app production_warehouse_app

# Restart bench
bench restart
```

---

### Method 2: Install from Git Repository

#### Step 1: Navigate to Bench Directory

```bash
cd /path/to/frappe-bench
```

#### Step 2: Get App from Git

```bash
# If you have the app in a git repository
bench get-app https://github.com/yourusername/production_warehouse_app.git

# Or if using SSH
bench get-app git@github.com:yourusername/production_warehouse_app.git
```

#### Step 3: Install on Site

```bash
bench --site your-site-name install-app production_warehouse_app
```

#### Step 4: Complete Installation

```bash
# Migrate
bench --site your-site-name migrate

# Clear cache and build
bench --site your-site-name clear-cache
bench build --app production_warehouse_app
bench restart
```

---

## Installing Custom Fields

The app requires custom fields on Production Plan and Material Request Plan Item doctypes.

### Automatic Installation (Preferred)

The custom fields should be installed automatically. To verify:

1. Log into ERPNext
2. Go to **Customize Form**
3. Select **Production Plan**
4. Look for the "Warehouse Group" field

If the fields are not present, proceed with manual installation below.

### Manual Installation of Custom Fields

#### For Production Plan Doctype:

1. Navigate to: **Home > Customization > Customize Form**
2. In "Enter Form Type", select **Production Plan**
3. Scroll down and click **Add Row** in the fields section
4. Enter the following details:

   **Field 1: Warehouse Group**
   - Label: `Warehouse Group`
   - Type: `Link`
   - Options: `Warehouse`
   - Insert After: `for_warehouse`
   - Description: `Select a warehouse group to calculate material requirements from all child warehouses`
   - Get Query: 
     ```javascript
     return {filters: {'is_group': 1, 'disabled': 0}}
     ```
   - Depends On: `eval:doc.get_items_from == 'Material Request'`
   - Bold: ✓ (checked)

5. Click **Update**

#### For Material Request Plan Item Doctype:

1. Navigate to: **Home > Customization > Customize Form**
2. In "Enter Form Type", select **Material Request Plan Item**
3. Add the following fields:

   **Field 1: Actual Qty (Warehouse)**
   - Label: `Actual Qty (Warehouse)`
   - Type: `Float`
   - Insert After: `quantity`
   - Description: `Actual available quantity in selected warehouse group`
   - In List View: ✓ (checked)
   - Read Only: ✓ (checked)
   - Precision: `2`

   **Field 2: Required Qty**
   - Label: `Required Qty`
   - Type: `Float`
   - Insert After: `actual_qty`
   - Description: `Actual quantity required after considering warehouse stock`
   - In List View: ✓ (checked)
   - Read Only: ✓ (checked)
   - Bold: ✓ (checked)
   - Precision: `2`

4. Click **Update**

---

## Verification Steps

After installation, verify that everything is working correctly:

### 1. Check App Installation

```bash
# List all installed apps
bench --site your-site-name list-apps

# You should see 'production_warehouse_app' in the list
```

### 2. Verify Custom Fields

1. Log into ERPNext
2. Go to **Manufacturing > Production Plan > New**
3. Check for the "Warehouse Group" field
4. Click "Get Items For Manufacture"
5. Check if the MR Items table shows "Actual Qty (Warehouse)" and "Required Qty" columns

### 3. Test Functionality

1. Create a new Production Plan
2. Select a Warehouse Group (must be a group warehouse)
3. Add some items via "Get Items For Manufacture"
4. Click the "Recalculate by Warehouse" button (in Actions menu)
5. Verify that quantities are calculated correctly

---

## Troubleshooting Installation Issues

### Issue 1: App Not Found in List

**Problem**: After installation, the app doesn't appear in `list-apps`

**Solution**:
```bash
# Try reinstalling
bench --site your-site-name uninstall-app production_warehouse_app --force
bench --site your-site-name install-app production_warehouse_app
bench restart
```

### Issue 2: Custom Fields Not Showing

**Problem**: Warehouse Group field is not visible in Production Plan

**Solution**:
```bash
# Clear cache thoroughly
bench --site your-site-name clear-cache
bench --site your-site-name clear-website-cache

# Rebuild
bench build --app production_warehouse_app

# Restart
bench restart

# If still not working, add fields manually (see above)
```

### Issue 3: JavaScript Not Loading

**Problem**: The "Recalculate by Warehouse" button is not showing

**Solution**:
```bash
# Rebuild assets
bench build --app production_warehouse_app --force

# Clear browser cache
# In Chrome/Firefox: Ctrl+Shift+Del, clear cached images and files

# Check browser console for errors
# Right-click > Inspect > Console tab
```

### Issue 4: Permission Denied Errors

**Problem**: Cannot install app due to permission errors

**Solution**:
```bash
# Set proper ownership
sudo chown -R frappe:frappe /path/to/frappe-bench/apps/production_warehouse_app

# Or use your user
sudo chown -R $USER:$USER /path/to/frappe-bench/apps/production_warehouse_app

# Then retry installation
```

### Issue 5: Migration Errors

**Problem**: Errors during `bench migrate`

**Solution**:
```bash
# Check the error log
bench --site your-site-name console

# Try migrating with verbose output
bench --site your-site-name migrate --verbose

# If specific errors occur, check:
# 1. Database connectivity
# 2. Custom field conflicts
# 3. Existing data issues
```

### Issue 6: Build Errors

**Problem**: Errors during `bench build`

**Solution**:
```bash
# Try force build
bench build --force

# Or build just this app
bench build --app production_warehouse_app

# Check for JavaScript syntax errors in:
# production_warehouse_app/public/js/production_plan_warehouse.js
```

---

## Multi-Site Installation

If you have multiple sites on the same bench:

```bash
# Install on specific sites
bench --site site1.domain.com install-app production_warehouse_app
bench --site site2.domain.com install-app production_warehouse_app

# Or install on all sites
bench --all install-app production_warehouse_app
```

---

## Uninstallation

If you need to uninstall the app:

```bash
# Uninstall from site
bench --site your-site-name uninstall-app production_warehouse_app

# Remove the app from bench (optional)
bench remove-app production_warehouse_app

# Note: Custom fields will remain unless manually deleted
```

---

## Production Server Considerations

### For Production Servers:

1. **Backup Before Installation**
   ```bash
   bench --site your-site-name backup --with-files
   ```

2. **Test on Staging First**
   - Install on a staging environment
   - Test thoroughly
   - Then deploy to production

3. **Supervisor/Systemd**
   ```bash
   # If using supervisor
   sudo supervisorctl restart all

   # If using systemd
   sudo systemctl restart frappe-bench-web frappe-bench-worker
   ```

4. **Nginx Configuration**
   ```bash
   # Usually not needed, but if assets don't load:
   bench setup nginx
   sudo service nginx reload
   ```

---

## Post-Installation Configuration

### 1. Set Permissions

Ensure users have proper permissions:
- Manufacturing Manager: Full access to Production Plan
- Manufacturing User: Access to view and edit

### 2. Configure Warehouse Hierarchy

Make sure your warehouse structure is set up:
1. Go to **Stock > Warehouse**
2. Create warehouse groups with proper parent-child relationships
3. Ensure "Is Group" is checked for parent warehouses

### 3. User Training

Train your users on:
- How to select warehouse groups
- Understanding the calculation logic
- Using the "Recalculate by Warehouse" feature

---

## Getting Help

If you encounter issues not covered here:

1. Check the main README.md file
2. Review error logs: `bench --site your-site-name console`
3. Check browser console for JavaScript errors
4. Verify ERPNext version compatibility

---

## Next Steps

After successful installation:

1. Review the README.md for usage instructions
2. Set up your warehouse hierarchy
3. Create a test Production Plan
4. Train your team on the new functionality

---

**Installation Complete!** You're now ready to use the Production Warehouse App for enhanced MRP planning.
