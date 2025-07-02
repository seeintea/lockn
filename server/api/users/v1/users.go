package v1

import (
	"github.com/gogf/gf/v2/frame/g"
)

type RegisterReq struct {
	g.Meta   `path:"/users/register" method:"post" sm:"注册" tags:"用户"`
	Username string `json:"username" v:"required|length:5,32" dc:"用户名"`
	Password string `json:"password" v:"required|length:6,32" dc:"密码"`
	Email    string `json:"email" v:"required|email" dc:"邮箱"`
}

type RegisterRes struct{}

type LoginReq struct {
	g.Meta   `path:"/users/login" method:"post" sm:"登录" tags:"用户"`
	Username string `json:"username" v:"required|length:5,32" dc:"用户名"`
	Password string `json:"password" v:"required|length:6,32" dc:"密码"`
}

type LoginRes struct{}

type DeleteReq struct {
	g.Meta `path:"/users/delete" method:"post" sm:"删除" tags:"用户"`
	Id     string `json:"id" v:"required" dc:"用户ID"`
}

type DeleteRes struct{}
