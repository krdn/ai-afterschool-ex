import type { UnifiedPersonalityData } from "./counseling.js"

export interface StudentInfo {
  name: string
  grade?: string
  school?: string
}

export function buildLearningStrategyPrompt(
  data: UnifiedPersonalityData,
  studentInfo: StudentInfo
): string {
  let prompt = `당신은 맞춤 학습 전략 전문가입니다. ${studentInfo.name} 학생의 종합 성향 데이터를 분석하여 최적 학습 전략을 제안해주세요.\n\n`

  prompt += buildDataSection(data)

  if (studentInfo.grade) prompt += `- 학년: ${studentInfo.grade}\n`
  if (studentInfo.school) prompt += `- 학교: ${studentInfo.school}\n`

  prompt += `\nJSON 형식으로 응답해주세요:
{
  "overallStrategy": "전체 학습 전략 요약",
  "dailyRoutine": {
    "morning": "아침 학습 루틴",
    "afternoon": "오후 학습 루틴",
    "evening": "저녁 학습 루틴"
  },
  "subjectStrategies": [
    { "subject": "과목명", "method": "학습법", "tools": ["도구1"] }
  ],
  "weaknessImprovement": ["약점 보완 방법 1", "약점 보완 방법 2"],
  "motivationTips": ["동기부여 팁 1", "동기부여 팁 2"]
}`

  return prompt
}

export function buildCareerGuidancePrompt(
  data: UnifiedPersonalityData,
  studentInfo: StudentInfo
): string {
  let prompt = `당신은 진로 가이던스 전문가입니다. ${studentInfo.name} 학생의 종합 성향을 바탕으로 진로를 제안해주세요.\n\n`

  prompt += buildDataSection(data)

  if (studentInfo.grade) prompt += `- 학년: ${studentInfo.grade}\n`

  prompt += `\nJSON 형식으로 응답해주세요:
{
  "aptitude": ["적성 분야 1", "적성 분야 2", "적성 분야 3"],
  "recommendedCareers": [
    { "career": "직업명", "reason": "추천 이유", "requiredSkills": ["필요 역량"] }
  ],
  "educationPath": "추천 교육 경로",
  "strengthsToLeverage": ["활용할 강점 1", "활용할 강점 2"],
  "areasToExplore": ["탐색할 분야 1"],
  "nextSteps": ["다음 단계 1", "다음 단계 2"]
}`

  return prompt
}

function buildDataSection(data: UnifiedPersonalityData): string {
  let section = `## 성향 데이터\n`
  if (data.mbtiType) section += `- MBTI: ${data.mbtiType}\n`
  if (data.varkType) section += `- VARK: ${data.varkType}\n`
  if (data.sajuFiveElements) {
    section += `- 사주 오행: ${Object.entries(data.sajuFiveElements).map(([k, v]) => `${k}:${v}`).join(", ")}\n`
  }
  if (data.zodiacSign) section += `- 별자리: ${data.zodiacSign}\n`
  if (data.nameGrids) {
    const g = data.nameGrids
    section += `- 성명학: 원${g.won}/형${g.hyung}/이${g.yi}/정${g.jeong}\n`
  }
  section += `\n`
  return section
}
