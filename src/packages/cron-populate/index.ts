import cron, { ScheduledTask } from "node-cron";
import { ProblemExtractor } from "../problem-extractor";
import { PopulateProblems } from "../../db/problems";
import { logger } from "../../logger";

export class CronJob {
  public scheduledTask : ScheduledTask;

  constructor(cronExpression: string) {
    this.scheduledTask = this.startJob(cronExpression);
  }

  private startJob(cronExpression) : ScheduledTask {
    return cron.schedule(cronExpression, this.job, {
      timezone: process.env.TIMEZONE || "UTC",
      scheduled: process.env.SCHEDULED !== "false"
    });
  }

  private async job() : Promise<void> {
    try {
      const problems = await ProblemExtractor.problems;
      await PopulateProblems.populate(problems);
      logger.info("Successfully updated database through cron job");
    } catch(e) {
      logger.error("Exception caught running cron job: " + e);
    }
  }
}
