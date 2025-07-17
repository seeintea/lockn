// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// Users is the golang structure for table users.
type Users struct {
	Id         uint64      `json:"id"         orm:"id"          description:"ID"` // ID
	Username   string      `json:"username"   orm:"username"    description:""`   //
	Password   string      `json:"password"   orm:"password"    description:""`   //
	Salt       string      `json:"salt"       orm:"salt"        description:""`   //
	Status     string      `json:"status"     orm:"status"      description:""`   //
	Email      string      `json:"email"      orm:"email"       description:""`   //
	Phone      string      `json:"phone"      orm:"phone"       description:""`   //
	Nickname   string      `json:"nickname"   orm:"nickname"    description:""`   //
	CreatedAt  *gtime.Time `json:"createdAt"  orm:"created_at"  description:""`   //
	UpdatedAt  *gtime.Time `json:"updatedAt"  orm:"updated_at"  description:""`   //
	IsDeleted  uint        `json:"isDeleted"  orm:"is_deleted"  description:"0-"` // 0-
	DeleteTime *gtime.Time `json:"deleteTime" orm:"delete_time" description:""`   //
}
