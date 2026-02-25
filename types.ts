
export interface PainPoint {
  id: string;
  issue: string;
  perceivedImpact: number; // 1-100
}

export interface BusinessData {
  industry: string;
  problemStatement: string;
  grossRevenue: number;
  netMargin: number;
  nrr: number;
  cac: number;
  painPoints: PainPoint[];
}

export interface Benchmark {
  metric: string;
  userValue: number;
  industryMedian: number;
  percentile: number;
}

export interface RootCauseInsight {
  cause: string;
  impactWeight: number;
  isParetoCritical: boolean;
}

export interface DashboardReport {
  executiveSummary: string;
  benchmarks: Benchmark[];
  rootCauses: RootCauseInsight[];
  aiChallenge: string;
}

export interface SavedReport {
  id: string;
  timestamp: number;
  data: BusinessData;
  report: DashboardReport;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  reportHistory: SavedReport[];
}
