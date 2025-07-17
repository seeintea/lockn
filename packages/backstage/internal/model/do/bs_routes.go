// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// BsRoutes is the golang structure of table bs_routes for DAO operations like Where/Data.
type BsRoutes struct {
	g.Meta    `orm:"table:bs_routes, do:true"`
	RouteId   interface{} //
	Path      interface{} //
	Name      interface{} //
	Component interface{} //
	MetaData  interface{} //
	ParentId  interface{} // ID
	OrderNum  interface{} //
	IsMenu    interface{} // 1-0-
	CreatedAt *gtime.Time //
}
