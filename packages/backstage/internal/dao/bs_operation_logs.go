// =================================================================================
// This file is auto-generated by the GoFrame CLI tool. You may modify it as needed.
// =================================================================================

package dao

import (
	"github.com/lockn/packages/backstage/internal/dao/internal"
)

// bsOperationLogsDao is the data access object for the table bs_operation_logs.
// You can define custom methods on it to extend its functionality as needed.
type bsOperationLogsDao struct {
	*internal.BsOperationLogsDao
}

var (
	// BsOperationLogs is a globally accessible object for table bs_operation_logs operations.
	BsOperationLogs = bsOperationLogsDao{internal.NewBsOperationLogsDao()}
)

// Add your custom methods and functionality below.
