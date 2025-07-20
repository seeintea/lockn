package user

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	v1 "github.com/lockn/packages/backstage/api/user/v1"
)

func (c *ControllerV1) Users(ctx context.Context, req *v1.UsersReq) (res *v1.UsersRes, err error) {
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
