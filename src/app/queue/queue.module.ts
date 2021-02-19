import { QueueModule as QueueCoreModule } from "@nest-boost/queue";
import { Module, OnApplicationBootstrap } from "@nestjs/common";

import { MultiPixelsQueue } from "./queues/multi-pixels.queue";
import { StickyCartQueue } from "./queues/sticky-cart.queue";

const queues = [MultiPixelsQueue, StickyCartQueue];

@Module({
  imports: [QueueCoreModule],
  providers: [...queues],
  exports: [...queues],
})
export class QueueModule implements OnApplicationBootstrap {
  constructor(
    private multiPixelsQueue: MultiPixelsQueue,
    private stickyCartQueue: StickyCartQueue
  ) {
    return this;
  }

  async onApplicationBootstrap(): Promise<void> {
    await Promise.all(
      [
        // 每天早上 9 点
        { queue: this.multiPixelsQueue, cron: "0 9 * * *" },
        { queue: this.stickyCartQueue, cron: "0 9 * * *" },
      ].map(({ queue, cron }) =>
        (async () => {
          // 清除配置不同的可重复任务
          await Promise.all(
            (await queue.getRepeatableJobs()).map((job) => {
              if (job.cron !== `${cron}`) {
                return queue.removeRepeatableByKey(job.key);
              }

              return null;
            })
          );

          // 添加可重复任务
          await queue.add("", null, { repeat: { cron } });
        })()
      )
    );
  }
}
