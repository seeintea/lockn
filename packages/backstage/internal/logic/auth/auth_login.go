package auth

import (
	"context"
	"encoding/json"
	"errors"
	"strconv"
	"time"

	v1 "github.com/lockn/packages/backstage/api/auth/v1"
	"github.com/lockn/packages/backstage/internal/consts"
	"github.com/lockn/packages/backstage/internal/dao"
	"github.com/lockn/packages/backstage/internal/model/entity"

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

func (u *Auth) Login(ctx context.Context, username, password string) (res *v1.LoginRes, err error) {
	var user entity.BsUsers
	err = dao.BsUsers.Ctx(ctx).Where("username = ?", username).Scan(&user)
	if err != nil {
		return res, err
	}
	validPassword, err := gmd5.Encrypt(gstr.Join([]string{password, user.Salt}, ""))
	if err != nil {
		return res, err
	}
	if validPassword != user.Password {
		return res, errors.New("password error")
	}
	claims := &jwtClaims{
		Id:       user.Id,
		Username: user.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
		},
	}
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err := jwtToken.SignedString([]byte(consts.JwtKey))
	if err != nil {
		return res, err
	}
	redisUser, err := json.Marshal(user)
	if err != nil {
		return res, err
	}
	userId := strconv.FormatUint(user.Id, 10)
	lastLoginToken, _ := g.Redis().Get(ctx, userId)
	if lastLoginToken != nil {
		_, _ = g.Redis().Del(ctx, userId)
		_, _ = g.Redis().Del(ctx, lastLoginToken.String())
	}
	err = g.Redis().SetEX(ctx, userId, token, consts.JwtExpiresAt) // for delete
	if err != nil {
		return res, err
	}
	err = g.Redis().SetEX(ctx, token, redisUser, consts.JwtExpiresAt) // for permission
	if err != nil {
		_, _ = g.Redis().Del(ctx, userId) // remove
		return res, err
	}
	return &v1.LoginRes{
		Token:    token,
		UserId:   userId,
		Username: user.Username,
		RoleId:   "",
		RoleName: "",
	}, nil
}
