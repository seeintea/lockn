import { NestFactory } from "@nestjs/core"
import { TransformResponseInterceptor } from "@/common/interceptors"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix("api")
  app.useGlobalInterceptors(new TransformResponseInterceptor())
  const port = process.env.PORT ?? 3000
  await app.listen(port)
  console.log(`server on: http://localhost:${port}`)
}
bootstrap()
