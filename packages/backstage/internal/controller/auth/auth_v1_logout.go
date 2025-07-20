package auth

import (
	"context"

	v1 "github.com/lockn/packages/backstage/api/auth/v1"
)

func (c *ControllerV1) Logout(ctx context.Context, req *v1.LogoutReq) (res *v1.LogoutRes, err error) {
	err = c.auth.Logout(ctx)
	if err != nil {
		return nil, err
	}
	return nil, nil
}
