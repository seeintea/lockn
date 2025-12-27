import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { cleanupOpenApiDoc } from "nestjs-zod"
import { AllExceptionsFilter } from "@/common/filters"
import { TransformResponseInterceptor } from "@/common/interceptors"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix("api")
  app.useGlobalInterceptors(new TransformResponseInterceptor())
  app.useGlobalFilters(new AllExceptionsFilter())

  const port = process.env.PORT ?? 3000

  const config = new DocumentBuilder()
    .setTitle("Dashboard API")
    .setDescription("The Dashboard API description")
    .setVersion("1.0")
    .build()

  const documentFactory = cleanupOpenApiDoc(SwaggerModule.createDocument(app, config))
  SwaggerModule.setup("swagger", app, documentFactory, {
    jsonDocumentUrl: "swagger/json",
  })

  await app.listen(port)
  console.log(`server on: http://localhost:${port}`)
  console.log(`swagger on: http://localhost:${port}/swagger`)
  console.log(`json document on: http://localhost:${port}/swagger/json`)
}
bootstrap()
