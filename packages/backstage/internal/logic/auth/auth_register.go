package auth

import (
	"context"
	"errors"

	"github.com/lockn/packages/backstage/internal/dao"
	"github.com/lockn/packages/backstage/internal/model/do"

	"github.com/gogf/gf/v2/crypto/gmd5"
	"github.com/gogf/gf/v2/text/gstr"
	"github.com/gogf/gf/v2/util/grand"
	"github.com/yitter/idgenerator-go/idgen"
)

func (u *Auth) Register(ctx context.Context, username, password, email string) (id int64, err error) {
	count, err := dao.BsUsers.Ctx(ctx).Where("username", username).WhereOr("email", email).Count()
	if err != nil {
		return 0, err
	}
	if count != 0 {
		return 0, errors.New("user exists")
	}
	salt := grand.S(32)
	encryptPassword, err := gmd5.Encrypt(gstr.Join([]string{password, salt}, ""))
	if err != nil {
		return 0, err
	}
	id = idgen.NextId()
	_, err = dao.BsUsers.Ctx(ctx).Data(do.BsUsers{
		Id:       id,
		Salt:     salt,
		Username: username,
		Password: encryptPassword,
		Email:    email,
	}).Insert()
	if err != nil {
		return 0, err
	}
	return id, nil
}
