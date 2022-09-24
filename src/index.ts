import { app } from "./app";
import { Database } from "./db/db.config";
import { PopulateProblems } from "./db/problems";
import { logger } from "./logger";

const serve = async () : Promise<void> => {
  const PORT : string | number = process.env.PORT || 3000;

  try {
    await Database.connect();
    await PopulateProblems.populate();
  } catch(e) {
    logger.error("Exception caught populating database: " + e);
  }

  app.listen(PORT, () => {
      logger.info(`Server is listening on port ${PORT}`);
  });
}

serve();