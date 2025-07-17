package boot

import (
	"github.com/yitter/idgenerator-go/idgen"
)

func init() {
	var options = idgen.NewIdGeneratorOptions(1)
	idgen.SetIdGenerator(options)
}
