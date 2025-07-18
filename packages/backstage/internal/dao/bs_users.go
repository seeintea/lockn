// =================================================================================
// This file is auto-generated by the GoFrame CLI tool. You may modify it as needed.
// =================================================================================

package dao

import (
	"github.com/lockn/packages/backstage/internal/dao/internal"
)

// bsUsersDao is the data access object for the table bs_users.
// You can define custom methods on it to extend its functionality as needed.
type bsUsersDao struct {
	*internal.BsUsersDao
}

var (
	// BsUsers is a globally accessible object for table bs_users operations.
	BsUsers = bsUsersDao{internal.NewBsUsersDao()}
)

// Add your custom methods and functionality below.
