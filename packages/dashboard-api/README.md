## 目录结构

```plaintext
src/
├── main.ts                              // 启动入口
├── app.module.ts                        // 根模块，聚合所有功能模块
├── common/                              // 通用模块（全局）
│   ├── guards/                          // 守卫（权限、认证）
│   ├── interceptors/                    // 拦截器（日志、响应包装）
│   ├── filters/                         // 异常过滤器
│   ├── pipes/                           // 数据校验管道
│   ├── decorators/                      // 自定义装饰器（如 @CurrentUser()）
│   ├── utils/                           // 工具函数
│   └── constants/                       // 常量（如角色、状态码）
│
├── modules/
│   ├── auth/                            // 认证模块（登录、JWT）
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── strategies/                  // Passport 策略（如 JWTStrategy）
│   │
│   ├── user/                            // 用户管理（运营后台核心）
│   │   ├── user.module.ts
│   │   ├── user.controller.ts           // REST API：/users
│   │   ├── user.service.ts
│   │   └── dto/                         // DTO（Data Transfer Object）
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
│   │
│   ├── role/                            // 角色权限管理
│   ├── permission/                      // 权限点管理
│   ├── dashboard/                       // 仪表盘（统计、概览）
│   ├── content/                         // 内容管理（文章、广告等）
│   ├── audit-log/                       // 操作日志
│   └── system-config/                   // 系统配置
│
├── database/
│   ├── entities/                        // TypeORM 实体（类似 JPA Entity）
│   ├── migrations/                      // 数据库迁移
│   ├── seeds/                           // 初始数据
│   └── database.module.ts               // 数据库连接封装（可选）
│
├── shared/                              // 共享模块（跨模块复用）
│   ├── shared.module.ts                 // 导出通用服务（如 Redis、Mail）
│   ├── mail.service.ts
│   └── redis.service.ts
│
└── config/                              // 配置文件（env、模块配置）
    ├── env.validation.ts                // 环境变量校验
    └── app.config.ts                    // 应用配置服务
```

# .env

```
# example
PORT=8193
MYSQL_DATABASE_URL="mysql://root:123456@127.0.0.1:3306/goi"
REDIS_DATABASE_URL="redis://:123456@127.0.0.1:6379/0"
JWT_SECRET="uIjEnNOD6nX$yDIsY%w"
TOKEN_EXPIRE_TIME=604800
```
