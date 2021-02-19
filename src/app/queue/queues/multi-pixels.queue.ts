import { PinoLogger } from "@nest-boost/logger";
import { BaseQueue, Job, Queue } from "@nest-boost/queue";
import knex from "knex";
import ms from "ms";

@Queue({
  defaultJobOptions: {
    removeOnComplete: ms("30m") / 1000,
    removeOnFail: ms("1d") / 1000,
  },
})
export class MultiPixelsQueue extends BaseQueue {
  private pgConnect: knex<any, unknown[]>;

  constructor(readonly logger: PinoLogger) {
    super();

    this.logger.setContext(this.constructor.name);

    this.pgConnect = knex({
      client: "mysql",
      connection: {
        host: "",
        user: "",
        password: "",
        database: "",
      },
    });
  }

  async processor(job: Job): Promise<void> {
    try {
      // eslint-disable-next-line no-console
      console.log("StickyCartQueue job id:", job.id);

      const shops = await this.pgConnect("shop").where("id", "<", "30");

      console.log("shops", shops);
    } catch (err) {
      console.log(err);
    }
  }
}
