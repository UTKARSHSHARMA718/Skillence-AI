type ProfileName =
  | "HR"
  | "DESIGNING"
  | "PRODUCT_MANAGER"
  | "PRESALES"
  | "DEVELOPER"
  | "DEMAND_GENERATION";

type ProfileCount = {
  profile: ProfileName;
  count: number;
};

export interface GetUserAnalyticsResponse {
  totalUsers: number;
  userCompletedAllSessions: number;
  allProfiles: ProfileName[];
  profiles: ProfileCount[];
  userWithZeroSessions: number;
  usersWithSomeSessions: number;
}

export interface GetCostAnalyticsResponse {
  totalCallCost: number;
  averageCallCost: number;
  totalEvaluationCost: number;
  averageEvaluationCost: number;
  totalCost: number;
  averageTotalCost: number;
}

export interface GetSessionAnalyticsResponse {
  totalSessions: number;
  passedSessions: number;
  failedSessions: number;
  last30DaysSessionsWithDate: {
    date: string;
    count: number;
  }[];
}
