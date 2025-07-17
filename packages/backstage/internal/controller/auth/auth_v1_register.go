package auth

import (
	"context"
	"strconv"

	"github.com/lockn/packages/backstage/api/auth/v1"
)

func (c *ControllerV1) Register(ctx context.Context, req *v1.RegisterReq) (res *v1.RegisterRes, err error) {
	id, err := c.auth.Register(ctx, req.Username, req.Password, req.Email)
	return &v1.RegisterRes{
		UserId: strconv.FormatInt(id, 10),
	}, err
}
