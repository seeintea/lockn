// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// BsButtonPermissions is the golang structure for table bs_button_permissions.
type BsButtonPermissions struct {
	ButtonId       int         `json:"buttonId"       orm:"button_id"       description:""`   //
	RouteId        int         `json:"routeId"        orm:"route_id"        description:"ID"` // ID
	ButtonKey      string      `json:"buttonKey"      orm:"button_key"      description:""`   //
	ButtonName     string      `json:"buttonName"     orm:"button_name"     description:""`   //
	PermissionCode string      `json:"permissionCode" orm:"permission_code" description:""`   //
	CreatedAt      *gtime.Time `json:"createdAt"      orm:"created_at"      description:""`   //
}
