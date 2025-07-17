// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// BsRolePermissionsDao is the data access object for the table bs_role_permissions.
type BsRolePermissionsDao struct {
	table    string                   // table is the underlying table name of the DAO.
	group    string                   // group is the database configuration group name of the current DAO.
	columns  BsRolePermissionsColumns // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler       // handlers for customized model modification.
}

// BsRolePermissionsColumns defines and stores column names for the table bs_role_permissions.
type BsRolePermissionsColumns struct {
	RoleId       string //
	PermissionId string //
}

// bsRolePermissionsColumns holds the columns for the table bs_role_permissions.
var bsRolePermissionsColumns = BsRolePermissionsColumns{
	RoleId:       "role_id",
	PermissionId: "permission_id",
}

// NewBsRolePermissionsDao creates and returns a new DAO object for table data access.
func NewBsRolePermissionsDao(handlers ...gdb.ModelHandler) *BsRolePermissionsDao {
	return &BsRolePermissionsDao{
		group:    "default",
		table:    "bs_role_permissions",
		columns:  bsRolePermissionsColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *BsRolePermissionsDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *BsRolePermissionsDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *BsRolePermissionsDao) Columns() BsRolePermissionsColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *BsRolePermissionsDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *BsRolePermissionsDao) Ctx(ctx context.Context) *gdb.Model {
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
func (dao *BsRolePermissionsDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
