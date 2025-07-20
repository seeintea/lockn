package auth

import (
	"context"

	v1 "github.com/lockn/packages/backstage/api/auth/v1"
)

func (c *ControllerV1) ResetPassword(ctx context.Context, req *v1.ResetPasswordReq) (res *v1.ResetPasswordRes, err error) {
	err = c.auth.ResetPassword(ctx, req.UserId, req.Password)
	if err != nil {
		return nil, err
	}
	return nil, nil
}
