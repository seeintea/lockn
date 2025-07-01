package main

import (
	_ "server/internal/packed"

	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"

	"github.com/gogf/gf/v2/os/gctx"
	"github.com/yitter/idgenerator-go/idgen"

	"server/internal/cmd"
)

func main() {
	var options = idgen.NewIdGeneratorOptions(16)
	idgen.SetIdGenerator(options)

	cmd.Main.Run(gctx.GetInitCtx())
}
