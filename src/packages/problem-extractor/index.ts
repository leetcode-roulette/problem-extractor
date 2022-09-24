import { AxiosResponse } from 'axios';
import { logger } from '../../logger';
import { axiosClient } from './axios-client';
import { LeetcodeProblem } from './interfaces';

export class ProblemExtractor {
  private static parsedData : Promise<LeetcodeProblem[] | null> | null = null;

  public static get problems() : Promise<LeetcodeProblem[] | null> | null {
    if (this.parsedData === null) {
      this.parsedData = this.makeAPICallAndGetData();
    }

    return this.parsedData;
  }

  private static async makeAPICallAndGetData() : Promise<LeetcodeProblem[] | null> {
    let data : AxiosResponse;

    try {
      data = await axiosClient.get("/api/problems/all");
    } catch(e) {
      logger.error("Exception caught getting data from leetcode API " + e);
      return null;
    }

    const parsedData : LeetcodeProblem[] = data.data.stat_status_pairs;

    return parsedData;
  }
}