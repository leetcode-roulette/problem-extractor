import { app } from "./app";
import { Database } from "./db/db.config";
import { logger } from "./logger";
import { CronJob } from "./packages/cron-populate";

const serve = async () : Promise<void> => {
  const PORT : string | number = process.env.PORT || 3000;

  try {
    await Database.connect();
  } catch(e) {
    logger.error("Exception caught connecting to database: " + e);
  }

  app.listen(PORT, () => {
      logger.info(`Server is listening on port ${PORT}`);
  });

  const populate = new CronJob(process.env.CRON_EXPRESSION || "0 * * * *");
}

serve();