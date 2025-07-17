// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// BsRoutesDao is the data access object for the table bs_routes.
type BsRoutesDao struct {
	table    string             // table is the underlying table name of the DAO.
	group    string             // group is the database configuration group name of the current DAO.
	columns  BsRoutesColumns    // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler // handlers for customized model modification.
}

// BsRoutesColumns defines and stores column names for the table bs_routes.
type BsRoutesColumns struct {
	RouteId   string //
	Path      string //
	Name      string //
	Component string //
	MetaData  string //
	ParentId  string // ID
	OrderNum  string //
	IsMenu    string // 1-0-
	CreatedAt string //
}

// bsRoutesColumns holds the columns for the table bs_routes.
var bsRoutesColumns = BsRoutesColumns{
	RouteId:   "route_id",
	Path:      "path",
	Name:      "name",
	Component: "component",
	MetaData:  "meta_data",
	ParentId:  "parent_id",
	OrderNum:  "order_num",
	IsMenu:    "is_menu",
	CreatedAt: "created_at",
}

// NewBsRoutesDao creates and returns a new DAO object for table data access.
func NewBsRoutesDao(handlers ...gdb.ModelHandler) *BsRoutesDao {
	return &BsRoutesDao{
		group:    "default",
		table:    "bs_routes",
		columns:  bsRoutesColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *BsRoutesDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *BsRoutesDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *BsRoutesDao) Columns() BsRoutesColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *BsRoutesDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *BsRoutesDao) Ctx(ctx context.Context) *gdb.Model {
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
func (dao *BsRoutesDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
