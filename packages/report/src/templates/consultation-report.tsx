import { Document, Page } from "@react-pdf/renderer"
import { Header } from "./sections/header.js"
import { StudentInfo } from "./sections/student-info.js"
import { AnalysisResults } from "./sections/analysis-results.js"
import { AIRecommendations } from "./sections/ai-recommendations.js"
import { Footer } from "./sections/footer.js"
import { styles } from "../styles.js"
import type { ConsultationReportData } from "../types.js"

export function ConsultationReport({
  student,
  analyses,
  personalitySummary,
  generatedAt,
}: ConsultationReportData) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Header generatedAt={generatedAt} />
        <StudentInfo {...student} />
        <AnalysisResults {...analyses} />
        <AIRecommendations personalitySummary={personalitySummary} />
        <Footer generatedAt={generatedAt} pageNumber={1} totalPages={1} />
      </Page>
    </Document>
  )
}
