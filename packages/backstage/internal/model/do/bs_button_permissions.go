// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// BsButtonPermissions is the golang structure of table bs_button_permissions for DAO operations like Where/Data.
type BsButtonPermissions struct {
	g.Meta         `orm:"table:bs_button_permissions, do:true"`
	ButtonId       interface{} //
	RouteId        interface{} // ID
	ButtonKey      interface{} //
	ButtonName     interface{} //
	PermissionCode interface{} //
	CreatedAt      *gtime.Time //
}
