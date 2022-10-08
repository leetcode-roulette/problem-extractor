import { AxiosResponse } from 'axios';
import { logger } from '../../logger';
import { axiosClient } from './axios-client';
import { LeetcodeProblem } from './interfaces';

export class ProblemExtractor {
  public static get problems() : Promise<LeetcodeProblem[] | null> | null {
    return this.makeAPICallAndGetData();
  }

  private static async makeAPICallAndGetData() : Promise<LeetcodeProblem[] | null> {
    try {
      const data : AxiosResponse = await axiosClient.get("/api/problems/all");
      const parsedData : LeetcodeProblem[] = data.data.stat_status_pairs;
      return parsedData;
    } catch(e) {
      logger.error("Exception caught getting data from leetcode API " + e);
      return null;
    }
  }
}