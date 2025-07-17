package users

import (
	"context"
	"server/internal/dao"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

func (u *Users) Delete(ctx context.Context, id string) error {
	_, err := dao.Users.Ctx(ctx).Data(g.Map{"is_deleted": 1, "delete_time": gtime.Now().Format("Y-m-d H:i:s")}).Where("id", id).Update()
	if err != nil {
		return err
	}
	return nil
}
