// 상담 프롬프트 - DB 의존 타입은 제거하고 순수 인터페이스로 대체

export interface UnifiedPersonalityData {
  mbtiType?: string | null
  mbtiPercentages?: Record<string, number> | null
  varkScores?: Record<string, number> | null
  varkType?: string | null
  sajuFiveElements?: Record<string, number> | null
  zodiacSign?: string | null
  nameGrids?: { won: number; hyung: number; yi: number; jeong: number } | null
}

export interface CounselingSummaryPromptParams {
  studentName: string
  counselingRecords: Array<{
    date: string
    teacherName: string
    content: string
    category?: string
  }>
  personalityData?: UnifiedPersonalityData | null
}

export interface PersonalitySummaryPromptParams {
  studentName: string
  personalityData: UnifiedPersonalityData
}

export function buildCounselingSummaryPrompt(params: CounselingSummaryPromptParams): string {
  const { studentName, counselingRecords, personalityData } = params

  let prompt = `당신은 학원 상담 전문가입니다. ${studentName} 학생의 상담 기록을 요약해주세요.\n\n`

  prompt += `## 상담 기록\n`
  for (const record of counselingRecords) {
    prompt += `- [${record.date}] ${record.teacherName}: ${record.content}\n`
  }

  if (personalityData) {
    prompt += `\n## 학생 성향 데이터\n`
    if (personalityData.mbtiType) prompt += `- MBTI: ${personalityData.mbtiType}\n`
    if (personalityData.varkType) prompt += `- VARK 학습유형: ${personalityData.varkType}\n`
    if (personalityData.zodiacSign) prompt += `- 별자리: ${personalityData.zodiacSign}\n`
  }

  prompt += `\n다음 형식으로 요약해주세요 (Markdown):\n`
  prompt += `1. 핵심 이슈 (최대 3개)\n`
  prompt += `2. 학생 상태 진단\n`
  prompt += `3. 권장 대응 방안\n`
  prompt += `4. 다음 상담 시 확인 사항`

  return prompt
}

export function buildPersonalitySummaryPrompt(params: PersonalitySummaryPromptParams): string {
  const { studentName, personalityData } = params

  let prompt = `당신은 학생 성향 분석 전문가입니다. ${studentName} 학생의 종합 성향을 분석해주세요.\n\n`

  prompt += `## 분석 데이터\n`
  if (personalityData.mbtiType) {
    const pct = personalityData.mbtiPercentages
    prompt += `- MBTI: ${personalityData.mbtiType}`
    if (pct) prompt += ` (${Object.entries(pct).map(([k, v]) => `${k}:${v}%`).join(", ")})`
    prompt += `\n`
  }
  if (personalityData.varkType) {
    prompt += `- VARK: ${personalityData.varkType}`
    if (personalityData.varkScores) {
      prompt += ` (${Object.entries(personalityData.varkScores).map(([k, v]) => `${k}:${v}`).join(", ")})`
    }
    prompt += `\n`
  }
  if (personalityData.sajuFiveElements) {
    prompt += `- 사주 오행: ${Object.entries(personalityData.sajuFiveElements).map(([k, v]) => `${k}:${v}`).join(", ")}\n`
  }
  if (personalityData.zodiacSign) prompt += `- 별자리: ${personalityData.zodiacSign}\n`
  if (personalityData.nameGrids) {
    const g = personalityData.nameGrids
    prompt += `- 성명학: 원${g.won}/형${g.hyung}/이${g.yi}/정${g.jeong}\n`
  }

  prompt += `\n종합 성향 프로필을 Markdown으로 작성해주세요:\n`
  prompt += `1. 핵심 성격 (3줄 이내)\n`
  prompt += `2. 학습 스타일\n`
  prompt += `3. 강점과 성장 포인트\n`
  prompt += `4. 선생님 유의사항`

  return prompt
}
