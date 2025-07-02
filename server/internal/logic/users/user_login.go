package users

import (
	"context"
	"errors"

	"server/internal/dao"
	"server/internal/model/entity"

	"github.com/gogf/gf/v2/crypto/gmd5"
	"github.com/gogf/gf/v2/text/gstr"
)

func (u *Users) Login(ctx context.Context, username, password string) error {
	var user entity.Users
	err := dao.Users.Ctx(ctx).Where("username", username).Scan(&user)
	if err != nil {
		return err
	}
	encryptPassword, err := gmd5.Encrypt(gstr.Join([]string{password, user.Salt}, ""))
	if err != nil {
		return err
	}
	if encryptPassword != user.Password {
		return errors.New("password error")
	}
	return nil
}
