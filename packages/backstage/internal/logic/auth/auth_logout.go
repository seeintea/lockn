package auth

import (
	"context"
	"encoding/json"
	"strconv"

	"github.com/lockn/packages/backstage/internal/model/entity"

	_ "github.com/gogf/gf/contrib/nosql/redis/v2"
	"github.com/gogf/gf/v2/frame/g"
)

func (u *Auth) Logout(ctx context.Context) (err error) {
	token := g.RequestFromCtx(ctx).Request.Header.Get("Authorization")

	jsonUser, err := g.Redis().Get(ctx, token)
	if err != nil {
		return err
	}
	var user entity.BsUsers
	err = json.Unmarshal(jsonUser.Bytes(), &user)
	if err != nil {
		return err
	}
	_, err = g.Redis().Del(ctx, token)
	if err != nil {
		return err
	}
	_, err = g.Redis().Del(ctx, strconv.FormatInt(int64(user.Id), 10))
	if err != nil {
		return err
	}
	return nil
}
