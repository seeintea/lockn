// ==========================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// ==========================================================================

package internal

import (
	"context"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

// BsUsersDao is the data access object for the table bs_users.
type BsUsersDao struct {
	table    string             // table is the underlying table name of the DAO.
	group    string             // group is the database configuration group name of the current DAO.
	columns  BsUsersColumns     // columns contains all the column names of Table for convenient usage.
	handlers []gdb.ModelHandler // handlers for customized model modification.
}

// BsUsersColumns defines and stores column names for the table bs_users.
type BsUsersColumns struct {
	Id         string // ID
	Username   string //
	Password   string //
	Salt       string //
	Status     string //
	Email      string //
	Phone      string //
	Nickname   string //
	CreatedAt  string //
	UpdatedAt  string //
	IsDeleted  string // 0-
	DeleteTime string //
}

// bsUsersColumns holds the columns for the table bs_users.
var bsUsersColumns = BsUsersColumns{
	Id:         "id",
	Username:   "username",
	Password:   "password",
	Salt:       "salt",
	Status:     "status",
	Email:      "email",
	Phone:      "phone",
	Nickname:   "nickname",
	CreatedAt:  "created_at",
	UpdatedAt:  "updated_at",
	IsDeleted:  "is_deleted",
	DeleteTime: "delete_time",
}

// NewBsUsersDao creates and returns a new DAO object for table data access.
func NewBsUsersDao(handlers ...gdb.ModelHandler) *BsUsersDao {
	return &BsUsersDao{
		group:    "default",
		table:    "bs_users",
		columns:  bsUsersColumns,
		handlers: handlers,
	}
}

// DB retrieves and returns the underlying raw database management object of the current DAO.
func (dao *BsUsersDao) DB() gdb.DB {
	return g.DB(dao.group)
}

// Table returns the table name of the current DAO.
func (dao *BsUsersDao) Table() string {
	return dao.table
}

// Columns returns all column names of the current DAO.
func (dao *BsUsersDao) Columns() BsUsersColumns {
	return dao.columns
}

// Group returns the database configuration group name of the current DAO.
func (dao *BsUsersDao) Group() string {
	return dao.group
}

// Ctx creates and returns a Model for the current DAO. It automatically sets the context for the current operation.
func (dao *BsUsersDao) Ctx(ctx context.Context) *gdb.Model {
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
func (dao *BsUsersDao) Transaction(ctx context.Context, f func(ctx context.Context, tx gdb.TX) error) (err error) {
	return dao.Ctx(ctx).Transaction(ctx, f)
}
