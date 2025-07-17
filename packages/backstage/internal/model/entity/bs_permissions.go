// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

// BsPermissions is the golang structure for table bs_permissions.
type BsPermissions struct {
	PermissionId   int    `json:"permissionId"   orm:"permission_id"   description:""`               //
	PermissionCode string `json:"permissionCode" orm:"permission_code" description:"(:user:create)"` // (:user:create)
	Description    string `json:"description"    orm:"description"     description:""`               //
}
