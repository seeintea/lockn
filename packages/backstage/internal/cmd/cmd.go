package cmd

import (
	"context"

	"github.com/lockn/packages/backstage/internal/logic/middleware"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/os/gcmd"

	"github.com/lockn/packages/backstage/internal/controller/auth"
)

var (
	Main = gcmd.Command{
		Name:  "main",
		Usage: "main",
		Brief: "start http server",
		Func: func(ctx context.Context, parser *gcmd.Parser) (err error) {
			s := g.Server()
			s.Group("/", func(group *ghttp.RouterGroup) {
				group.Middleware(ghttp.MiddlewareHandlerResponse)
				group.Bind(
					auth.NewV1().Register,
					auth.NewV1().Login,
				)
				group.Group("/", func(group *ghttp.RouterGroup) {
					group.Middleware(middleware.Auth)
					group.Bind(
						auth.NewV1().ResetPassword,
						auth.NewV1().Logout,
					)
				})
			})
			s.Run()
			return nil
		},
	}
)
