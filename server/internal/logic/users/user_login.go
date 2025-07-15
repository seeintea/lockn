package users

import (
	"context"
	"encoding/json"
	"errors"
	"server/internal/consts"
	"strconv"
	"time"

	"server/internal/dao"
	"server/internal/model/entity"

	_ "github.com/gogf/gf/contrib/nosql/redis/v2"
	"github.com/gogf/gf/v2/crypto/gmd5"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/text/gstr"
	"github.com/golang-jwt/jwt/v5"
)

type jwtClaims struct {
	Id       uint64
	Username string
	jwt.RegisteredClaims
}

func (u *Users) Login(ctx context.Context, username, password string) (tokenString string, err error) {
	var user entity.Users
	err = dao.Users.Ctx(ctx).Where("username", username).Scan(&user)
	if err != nil {
		return "", err
	}
	encryptPassword, err := gmd5.Encrypt(gstr.Join([]string{password, user.Salt}, ""))
	if err != nil {
		return "", err
	}
	if encryptPassword != user.Password {
		return "", errors.New("password error")
	}

	claims := &jwtClaims{
		Id:       user.Id,
		Username: user.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	str, err := token.SignedString([]byte(consts.JwtKey))

	if err != nil {
		return "", err
	}
	nextUser, _ := json.Marshal(user)
	err = g.Redis().SetEX(ctx, strconv.FormatUint(user.Id, 10), str, int64(7*24*60*60)) // for delete
	err = g.Redis().SetEX(ctx, str, nextUser, int64(7*24*60*60))                        // for permission

	if err != nil {
		return "", err
	}

	return str, nil
}
