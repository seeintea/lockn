package users

import (
	"context"

	"server/api/users/v1"
)

func (c *ControllerV1) Delete(ctx context.Context, req *v1.DeleteReq) (res *v1.DeleteRes, err error) {
	err = c.users.Delete(ctx, req.Id)
	return nil, err
}
