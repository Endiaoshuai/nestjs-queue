import "source-map-support/register";

import { startHttpServer } from "@nest-boost/common";

import { AppModule } from "./app/app.module";

startHttpServer(AppModule);
