import { Problems, IProblem } from '../models/problems';
import { LeetcodeProblem } from '../packages/problem-extractor/interfaces';
import { logger } from '../logger';
import { FilterQuery, UpdateQuery } from 'mongoose';

export class PopulateProblems {
  public static async populate(problems : LeetcodeProblem[] | null) : Promise<void> {
    if (problems === null) {
      return;
    }

    problems.forEach(async problem => {
      await this.populateRow(problem);
    });

    logger.info("Database has been populated");
  }

  private static async populateRow(problem : LeetcodeProblem) : Promise<void> {
    const filter : FilterQuery<IProblem> = { problemId: problem.stat.question_id };
    const update : UpdateQuery<IProblem> = {
      problemId: problem.stat.question_id,
      title: problem.stat.question__title,
      titleSlug: problem.stat.question__title_slug,
      isPremium: problem.paid_only,
      difficulty: problem.difficulty.level,
      frontEndId: problem.stat.frontend_question_id,
      numSubmitted: problem.stat.total_submitted,
      numAccepted: problem.stat.total_acs
    };

    const p : IProblem = await Problems.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true
    });
    p.save();
  }
}