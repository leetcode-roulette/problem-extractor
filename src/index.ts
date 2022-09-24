import { app } from "./app";
import { Database } from "./db/db.config";
import { logger } from "./logger";
import { CronPopulate } from "./packages/cron-populate";

const serve = async () : Promise<void> => {
  const PORT : string | number = process.env.PORT || 3000;

  try {
    await Database.connect();
    CronPopulate.schedule("* * * * *");
  } catch(e) {
    logger.error("Exception caught scheduling cron job: " + e);
  }

  app.listen(PORT, () => {
      logger.info(`Server is listening on port ${PORT}`);
  });
}

serve();