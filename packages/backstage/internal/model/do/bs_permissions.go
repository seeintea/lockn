// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
)

// BsPermissions is the golang structure of table bs_permissions for DAO operations like Where/Data.
type BsPermissions struct {
	g.Meta         `orm:"table:bs_permissions, do:true"`
	PermissionId   interface{} //
	PermissionCode interface{} // (:user:create)
	Description    interface{} //
}
