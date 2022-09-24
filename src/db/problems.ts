import { Problems, IProblem } from '../models/problems';
import { LeetcodeProblem } from '../packages/problem-extractor/interfaces';
import { ProblemExtractor } from '../packages/problem-extractor';

export class PopulateProblems {
  private static data : Promise<LeetcodeProblem[] | null> | null = null;

  public static async populate() : Promise<void> {
    const problems = await this.problems;

    if (problems === null) {
      return;
    }

    problems.forEach(async problem => {
      await this.populateRow(problem);
    });

    console.log("Database has been populated");
  }

  private static async populateRow(problem : LeetcodeProblem) : Promise<void> {
    const rowAlreadyExists : boolean = await this.rowAlreadyExists(problem);

    if (rowAlreadyExists) {
      await this.updateProblem(problem);
      return;
    }

    await this.saveProblem(problem);
  }

  private static async rowAlreadyExists(problem : LeetcodeProblem) : Promise<boolean> {
    return await Problems.exists({ problemId: problem.stat.question_id }) !== null;
  }

  private static async updateProblem(problem : LeetcodeProblem) : Promise<void> {
    Problems.findOneAndUpdate({ problemId: problem.stat.question_id}, {
      problemId: problem.stat.question_id,
      title: problem.stat.question__title,
      titleSlug: problem.stat.question__title_slug,
      isPremium: problem.paid_only,
      difficulty: problem.difficulty.level,
      frontEndId: problem.stat.frontend_question_id,
      numSubmitted: problem.stat.total_submitted,
      numAccepted: problem.stat.total_acs
    });
  }

  private static async saveProblem(problem : LeetcodeProblem) : Promise<void> {
    const p : IProblem = await Problems.create({
      problemId: problem.stat.question_id,
      title: problem.stat.question__title,
      titleSlug: problem.stat.question__title_slug,
      isPremium: problem.paid_only,
      difficulty: problem.difficulty.level,
      frontEndId: problem.stat.frontend_question_id,
      numSubmitted: problem.stat.total_submitted,
      numAccepted: problem.stat.total_acs
    });

    await p.save();
  }

  public static get problems() : Promise<LeetcodeProblem[] | null> | null {
    if (this.data === null) {
      this.data = ProblemExtractor.problems;
    }

    return this.data;
  }
}