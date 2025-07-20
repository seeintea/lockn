package auth

import (
	"context"

	_ "github.com/gogf/gf/contrib/nosql/redis/v2"
	"github.com/gogf/gf/v2/crypto/gmd5"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/text/gstr"
	"github.com/gogf/gf/v2/util/grand"
	"github.com/lockn/packages/backstage/internal/dao"
)

func (u *Auth) ResetPassword(ctx context.Context, userId, password string) (err error) {
	count, err := dao.BsUsers.Ctx(ctx).Where("id = ?", userId).Count()
	if err != nil || count == 0 {
		return err
	}
	salt := grand.S(32)
	nextPassword, err := gmd5.Encrypt(gstr.Join([]string{password, salt}, ""))
	if err != nil {
		return err
	}
	_, err = dao.BsUsers.Ctx(ctx).Data(g.Map{
		"salt":     salt,
		"password": nextPassword,
	}).Where("id = ?", userId).Update()
	if err != nil {
		return err
	}
	// clear auth status
	lastLoginToken, _ := g.Redis().Get(ctx, userId)
	if lastLoginToken != nil {
		_, _ = g.Redis().Del(ctx, userId)
		_, _ = g.Redis().Del(ctx, lastLoginToken.String())
	}
	return nil
}
