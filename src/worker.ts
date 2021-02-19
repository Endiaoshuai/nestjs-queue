import "dotenv/config";
import "source-map-support/register";

import { startWorker } from "@nest-boost/common";

import { AppModule } from "./app/app.module";

startWorker(AppModule);
