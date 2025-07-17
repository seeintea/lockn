// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package user

import (
	"context"

	"github.com/lockn/packages/backstage/api/user/v1"
)

type IUserV1 interface {
	Users(ctx context.Context, req *v1.UsersReq) (res *v1.UsersRes, err error)
}
