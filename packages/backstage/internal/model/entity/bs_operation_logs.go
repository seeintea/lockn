// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

import (
	"github.com/gogf/gf/v2/os/gtime"
)

// BsOperationLogs is the golang structure for table bs_operation_logs.
type BsOperationLogs struct {
	LogId     int64       `json:"logId"     orm:"log_id"     description:""`   //
	UserId    uint64      `json:"userId"    orm:"user_id"    description:""`   //
	Action    string      `json:"action"    orm:"action"     description:""`   //
	TargetId  string      `json:"targetId"  orm:"target_id"  description:"ID"` // ID
	Detail    string      `json:"detail"    orm:"detail"     description:""`   //
	Ip        string      `json:"ip"        orm:"ip"         description:""`   //
	CreatedAt *gtime.Time `json:"createdAt" orm:"created_at" description:""`   //
}
