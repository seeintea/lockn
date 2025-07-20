package auth

import (
	"context"

	v1 "github.com/lockn/packages/backstage/api/auth/v1"
)

func (c *ControllerV1) Login(ctx context.Context, req *v1.LoginReq) (res *v1.LoginRes, err error) {
	res, err = c.auth.Login(ctx, req.Username, req.Password)
	if err != nil {
		return nil, err
	}
	return res, nil
}
