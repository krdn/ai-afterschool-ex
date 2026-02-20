// 타입
export type {
  Assignment,
  DetailedAssignment,
  AutoAssignmentOptions,
  AssignmentSummary,
  LoadStats,
  CompatibilityScore,
  CompatibilityBreakdown,
  FairnessMetrics,
  TeamComposition,
  TeamCompositionAnalysis,
  MBTIDistribution,
  LearningStyleDistribution,
  SajuElementsDistribution,
  ExpertiseCoverage,
  RoleDistribution,
  DiversityScore,
  Recommendation,
  TeacherAnalysisData,
  StudentAnalysisData,
  MbtiPercentages,
  SajuResult,
  NameResult,
  TeacherTeamData,
} from "./types.js"

// 공정성 메트릭
export {
  calculateFairnessMetrics,
  calculateDisparityIndex,
  calculateABROCA,
  calculateDistributionBalance,
} from "./fairness-metrics.js"

// 팀 구성 분석
export {
  analyzeTeamComposition,
  calculateShannonDiversity,
  calculateDiversityScore,
  getTeamRecommendations,
} from "./team-composition.js"

// 자동 배정 알고리즘
export {
  generateAutoAssignment,
  calculateLoadStats,
  summarizeAssignments,
} from "./auto-assignment.js"

export type {
  TeacherCandidate,
  StudentCandidate,
  CompatibilityScoreFn,
} from "./auto-assignment.js"

export * from "./repositories/index.js"
