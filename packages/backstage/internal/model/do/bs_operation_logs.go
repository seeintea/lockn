// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package do

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

// BsOperationLogs is the golang structure of table bs_operation_logs for DAO operations like Where/Data.
type BsOperationLogs struct {
	g.Meta    `orm:"table:bs_operation_logs, do:true"`
	LogId     interface{} //
	UserId    interface{} //
	Action    interface{} //
	TargetId  interface{} // ID
	Detail    interface{} //
	Ip        interface{} //
	CreatedAt *gtime.Time //
}
