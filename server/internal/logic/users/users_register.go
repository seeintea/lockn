package users

import (
	"context"
	"errors"
	"server/internal/dao"
	"server/internal/model/do"

	"github.com/gogf/gf/v2/crypto/gmd5"
	"github.com/gogf/gf/v2/text/gstr"
	"github.com/gogf/gf/v2/util/grand"
	"github.com/yitter/idgenerator-go/idgen"
)

func (u *Users) Register(ctx context.Context, username, password, email string) error {
	count, err := dao.Users.Ctx(ctx).Where("username", username).WhereOr("email", email).Count()
	if err != nil {
		return err
	}
	if count != 0 {
		return errors.New("user exists")
	}
	salt := grand.S(32)
	encryptPassword, err := gmd5.Encrypt(gstr.Join([]string{password, salt}, ""))
	if err != nil {
		return err
	}
	_, err = dao.Users.Ctx(ctx).Data(do.Users{
		Id:       idgen.NextId(),
		Salt:     salt,
		Username: username,
		Password: encryptPassword,
		Email:    email,
	}).Insert()
	if err != nil {
		return err
	}
	return nil
}
