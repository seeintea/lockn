// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// BsOperationLogsDao is the data access object for the table bs_operation_logs.
type BsOperationLogsDao struct {
	table    string                 // table is the underlying table name of the DAO.
	group    string                 // group is the database configuration group name of the current DAO.
	columns  BsOperationLogsColumns // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler     // handlers for customized model modification.
}

// BsOperationLogsColumns defines and stores column names for the table bs_operation_logs.
type BsOperationLogsColumns struct {
	LogId     string //
	UserId    string //
	Action    string //
	TargetId  string // ID
	Detail    string //
	Ip        string //
	CreatedAt string //
}

// bsOperationLogsColumns holds the columns for the table bs_operation_logs.
var bsOperationLogsColumns = BsOperationLogsColumns{
	LogId:     "log_id",
	UserId:    "user_id",
	Action:    "action",
	TargetId:  "target_id",
	Detail:    "detail",
	Ip:        "ip",
	CreatedAt: "created_at",
}

// NewBsOperationLogsDao creates and returns a new DAO object for table data access.
func NewBsOperationLogsDao(handlers ...gdb.ModelHandler) *BsOperationLogsDao {
	return &BsOperationLogsDao{
		group:    "default",
		table:    "bs_operation_logs",
		columns:  bsOperationLogsColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *BsOperationLogsDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *BsOperationLogsDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *BsOperationLogsDao) Columns() BsOperationLogsColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *BsOperationLogsDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *BsOperationLogsDao) Ctx(ctx context.Context) *gdb.Model {
	model := dao.DB().Model(dao.table)
	for _, handler := range dao.handlers {
		model = handler(model)
	}
	return model.Safe().Ctx(ctx)
}

// Transaction wraps the transaction logic using function f.
// It rolls back the transaction and returns the error if function f returns a non-nil error.
// It commits the transaction and returns nil if function f returns nil.
//
// Note: Do not commit or roll back the transaction in function f,
// as it is automatically handled by this function.
func (dao *BsOperationLogsDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
