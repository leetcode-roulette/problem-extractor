import cron, { ScheduledTask } from "node-cron";
import { ProblemExtractor } from "../problem-extractor";
import { PopulateProblems } from "../../db/problems";
import { logger } from "../../logger";

export class CronPopulate {
  public static async schedule(cronExpression: string) : Promise<ScheduledTask> {
    return cron.schedule(cronExpression, this.run);
  }

  private static async run() : Promise<void> {
    try {
      const problems = await ProblemExtractor.problems;
      await PopulateProblems.populate(problems);
      logger.info("Successfully updated database through cron job");
    } catch(e) {
      logger.error("Exception caught running cron job: " + e);
    }
  }
}
