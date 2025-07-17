package v1

import (
	"github.com/gogf/gf/v2/frame/g"
)

type LoginReq struct {
	g.Meta   `path:"/auth/login" method:"post" sm:"登录" tags:"用户认证"`
	Username string `json:"username" v:"required|length:5,32" dc:"用户名"`
	Password string `json:"password" v:"required|length:6,32" dc:"密码"`
}

type LoginRes struct {
	Token    string `json:"token" dc:"在需要鉴权的接口中 header 加入 Authorization: token"`
	UserId   string `json:"userId" dc:"用户ID"`
	Username string `json:"username" dc:"用户名"`
	RoleId   string `json:"roleId" dc:"用户角色ID"`
	RoleName string `json:"roleName" dc:"用户角色"`
}

type LogoutReq struct {
	g.Meta `path:"/auth/logout" method:"get" sm:"退出登录" tags:"用户认证"`
}

type LogoutRes struct{}

type RegisterReq struct {
	g.Meta   `path:"/auth/register" method:"post" sm:"注册" tags:"用户认证"`
	Username string `json:"username" v:"required|length:5,32" dc:"用户名"`
	Password string `json:"password" v:"required|length:6,32" dc:"密码"`
	Email    string `json:"email" v:"required|email" dc:"邮箱"`
}

type RegisterRes struct {
	UserId string `json:"userId" dc:"用户ID"`
}

type ResetPasswordReq struct {
	g.Meta `path:"/auth/reset" method:"post" sm:"重置密码" tags:"用户认证"`
	UserId string `json:"userId" dc:"用户ID"`
}

type ResetPasswordRes struct{}
