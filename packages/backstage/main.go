package main

import (
	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"
	"github.com/gogf/gf/v2/os/gctx"

	_ "github.com/lockn/packages/backstage/internal/boot"
	"github.com/lockn/packages/backstage/internal/cmd"
	_ "github.com/lockn/packages/backstage/internal/packed"
)

func main() {
	cmd.Main.Run(gctx.GetInitCtx())
}
