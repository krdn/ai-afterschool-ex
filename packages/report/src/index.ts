// 타입
export type {
  StudentReportData,
  SajuAnalysis,
  NameAnalysis,
  MbtiAnalysis,
  FaceAnalysis,
  PalmAnalysis,
  AnalysesData,
  LearningStrategy,
  CareerGuidance,
  PersonalitySummaryData,
  ConsultationReportData,
  ColorPalette,
} from "./types.js"

// PDF 생성 유틸리티
export {
  pdfToBuffer,
  pdfToFile,
  generateReportFilename,
  getPdfStoragePath,
} from "./generator.js"

// 스타일 & 색상
export { styles, colors } from "./styles.js"

// 폰트
export { fonts, fontWeights } from "./fonts.js"

// 템플릿 컴포넌트
export { ConsultationReport } from "./templates/consultation-report.js"
export { Header } from "./templates/sections/header.js"
export { StudentInfo } from "./templates/sections/student-info.js"
export { AnalysisResults } from "./templates/sections/analysis-results.js"
export { AIRecommendations } from "./templates/sections/ai-recommendations.js"
export { Footer } from "./templates/sections/footer.js"
