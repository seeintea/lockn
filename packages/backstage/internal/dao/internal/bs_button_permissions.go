// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// BsButtonPermissionsDao is the data access object for the table bs_button_permissions.
type BsButtonPermissionsDao struct {
	table    string                     // table is the underlying table name of the DAO.
	group    string                     // group is the database configuration group name of the current DAO.
	columns  BsButtonPermissionsColumns // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler         // handlers for customized model modification.
}

// BsButtonPermissionsColumns defines and stores column names for the table bs_button_permissions.
type BsButtonPermissionsColumns struct {
	ButtonId       string //
	RouteId        string // ID
	ButtonKey      string //
	ButtonName     string //
	PermissionCode string //
	CreatedAt      string //
}

// bsButtonPermissionsColumns holds the columns for the table bs_button_permissions.
var bsButtonPermissionsColumns = BsButtonPermissionsColumns{
	ButtonId:       "button_id",
	RouteId:        "route_id",
	ButtonKey:      "button_key",
	ButtonName:     "button_name",
	PermissionCode: "permission_code",
	CreatedAt:      "created_at",
}

// NewBsButtonPermissionsDao creates and returns a new DAO object for table data access.
func NewBsButtonPermissionsDao(handlers ...gdb.ModelHandler) *BsButtonPermissionsDao {
	return &BsButtonPermissionsDao{
		group:    "default",
		table:    "bs_button_permissions",
		columns:  bsButtonPermissionsColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *BsButtonPermissionsDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *BsButtonPermissionsDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *BsButtonPermissionsDao) Columns() BsButtonPermissionsColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *BsButtonPermissionsDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *BsButtonPermissionsDao) Ctx(ctx context.Context) *gdb.Model {
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
func (dao *BsButtonPermissionsDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
