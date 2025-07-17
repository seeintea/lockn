package v1

import (
	"github.com/gogf/gf/v2/frame/g"
)

type UserList struct {
	Id       string `json:"id"`
	Username string `json:"username"`
}

type UsersReq struct {
	g.Meta `path:"user/list" method:"get" sm:"用户列表" tags:"用户管理"`
	Page   uint32 `json:"page" v:"required" dc:"当前页"`
	Size   uint16 `json:"size" v:"required" dc:"分页大小"`
}

type UsersRes struct {
	Page     uint32     `json:"page" dc:"当前页"`
	Size     uint16     `json:"size" dc:"分页大小"`
	Total    uint32     `json:"total" dc:"总数"`
	UserList []UserList `json:"list" dc:"用户数据"`
}
