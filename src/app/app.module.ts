import { LoggerModule } from "@nest-boost/logger";
import { RedisModule } from "@nest-boost/redis";
import { Module, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { QueueModule } from "./queue/queue.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    LoggerModule.register({
      exclude: [{ method: RequestMethod.ALL, path: "health" }],
    }),
    QueueModule,
    RedisModule,
  ],
})
export class AppModule {}
