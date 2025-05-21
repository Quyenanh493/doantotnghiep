# Applying Permission Checks to All Pages

This document provides step-by-step instructions for adding permission checks to all remaining pages in the admin application.

## Step 1: Import the usePermissions hook

In each page component, add this import:

```javascript
import { usePermissions } from '../../contexts/PermissionContext';
```

## Step 2: Set up permission variables

Inside your component function, add these lines:

```javascript
// Get permission utilities
const { canCreate, canUpdate, canDelete, isLoading: permissionLoading } = usePermissions();
const hasCreatePermission = canCreate('resourceName'); // Replace 'resourceName' with your resource (e.g., 'users', 'roles', 'bookings')
const hasUpdatePermission = canUpdate('resourceName');
const hasDeletePermission = canDelete('resourceName');
```

## Step 3: Update the action buttons in your table columns

Wrap the Edit button with permission check:
```javascript
{hasUpdatePermission && (
  <Button 
    type="default" 
    icon={<EditOutlined />} 
    size="small" 
    onClick={() => handleEdit(record)}
  />
)}
```

Wrap the Delete button with permission check:
```javascript
{hasDeletePermission && (
  <Button 
    type="primary" 
    danger 
    icon={<DeleteOutlined />} 
    size="small" 
    onClick={() => showDeleteConfirm(record.id)}
  />
)}
```

## Step 4: Update the "Add" button

Wrap the add button with permission check:
```javascript
extra={
  hasCreatePermission && (
    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
      Thêm mới
    </Button>
  )
}
```

## Step 5: Update the Table component

Filter out the action column if the user has no action permissions:
```javascript
<Table
  columns={columns.filter(col => {
    // Always show all columns except action if no permissions
    if (col.key !== 'action') return true;
    // Only show action column if user has at least one action permission
    return hasUpdatePermission || hasDeletePermission;
  })}
  dataSource={filteredData}
  rowKey="id"
  loading={loading || permissionLoading}
  pagination={{
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total) => `Tổng cộng ${total} items`,
  }}
/>
```

## Step 6: Update the view modal footer

Apply permissions to the modal footer:
```javascript
footer={[
  <Button key="back" onClick={handleCancel}>
    Đóng
  </Button>,
  hasUpdatePermission && (
    <Button 
      key="edit" 
      type="primary" 
      onClick={() => {
        handleCancel();
        handleEdit(currentRecord);
      }}
    >
      Chỉnh sửa
    </Button>
  ),
].filter(Boolean)} // This removes any false/undefined values from the array
```

## Step 7: Update the backend routes

For each route file:
1. Import the permission middleware:
```javascript
import permissionMiddleware from "../middleware/permissionMiddleware";
```

2. Replace role-based checks with permission checks:
```javascript
// Before
router.post('/', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin', 'staff']),
  controller.createItem
);

// After
router.post('/', 
  authMiddleware.verifyToken,
  permissionMiddleware.canCreate('resourceName'),
  controller.createItem
);
```

Apply these steps to each page and route file in your project to implement consistent permission checks throughout the application. 