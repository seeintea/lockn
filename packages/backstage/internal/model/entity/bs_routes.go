// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// BsRoutes is the golang structure for table bs_routes.
type BsRoutes struct {
	RouteId   int         `json:"routeId"   orm:"route_id"   description:""`     //
	Path      string      `json:"path"      orm:"path"       description:""`     //
	Name      string      `json:"name"      orm:"name"       description:""`     //
	Component string      `json:"component" orm:"component"  description:""`     //
	MetaData  string      `json:"metaData"  orm:"meta_data"  description:""`     //
	ParentId  int         `json:"parentId"  orm:"parent_id"  description:"ID"`   // ID
	OrderNum  int         `json:"orderNum"  orm:"order_num"  description:""`     //
	IsMenu    int         `json:"isMenu"    orm:"is_menu"    description:"1-0-"` // 1-0-
	CreatedAt *gtime.Time `json:"createdAt" orm:"created_at" description:""`     //
}
