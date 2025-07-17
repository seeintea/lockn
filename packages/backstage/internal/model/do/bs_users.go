// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// BsUsers is the golang structure of table bs_users for DAO operations like Where/Data.
type BsUsers struct {
	g.Meta     `orm:"table:bs_users, do:true"`
	Id         interface{} // ID
	Username   interface{} //
	Password   interface{} //
	Salt       interface{} //
	Status     interface{} //
	Email      interface{} //
	Phone      interface{} //
	Nickname   interface{} //
	CreatedAt  *gtime.Time //
	UpdatedAt  *gtime.Time //
	IsDeleted  interface{} // 0-
	DeleteTime *gtime.Time //
}
