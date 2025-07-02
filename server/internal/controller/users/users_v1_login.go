package users

import (
	"context"

	"server/api/users/v1"
)

func (c *ControllerV1) Login(ctx context.Context, req *v1.LoginReq) (res *v1.LoginRes, err error) {
	err = c.users.Login(ctx, req.Username, req.Password)
	return nil, err
}
