package middleware

import (
	"fmt"
	"net/http"

	"github.com/lockn/packages/backstage/internal/consts"

	_ "github.com/gogf/gf/contrib/nosql/redis/v2"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/golang-jwt/jwt/v5"
)

func Auth(req *ghttp.Request) {
	var tokenFromReq = req.Header.Get("Authorization")
	token, err := jwt.Parse(tokenFromReq, func(token *jwt.Token) (interface{}, error) {
		return []byte(consts.JwtKey), nil
	})
	if err != nil || !token.Valid {
		req.Response.WriteStatus(http.StatusForbidden)
		req.Exit()
	}
	// token remove by other way
	hasTokenInRedis, err := g.Redis().Get(req.GetCtx(), tokenFromReq)
	fmt.Println(hasTokenInRedis, err)
	if err != nil || hasTokenInRedis.IsEmpty() {
		req.Response.WriteStatus(http.StatusForbidden)
		req.Exit()
	}
	req.Middleware.Next()
}
