package users

import (
	"context"

	"server/api/users/v1"
)

func (c *ControllerV1) Register(ctx context.Context, req *v1.RegisterReq) (res *v1.RegisterRes, err error) {
	err = c.users.Register(ctx, req.Username, req.Password, req.Email)
	return nil, err
}
