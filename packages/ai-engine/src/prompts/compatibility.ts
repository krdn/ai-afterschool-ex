export const COMPATIBILITY_SYSTEM_PROMPT = `당신은 학원 학생-선생님 궁합 분석 전문가입니다.
MBTI, 사주, 성명학 데이터를 종합하여 학생과 선생님의 궁합을 분석합니다.
교육적 관점에서 실용적인 조언을 제공하세요.

JSON 형식으로 응답하세요:
{
  "overallScore": 0-100,
  "summary": "한 줄 요약",
  "teacherRankings": [
    {
      "teacherId": "ID",
      "score": 0-100,
      "strengths": ["강점1", "강점2"],
      "cautions": ["주의점1"],
      "advice": "맞춤 조언"
    }
  ],
  "recommendation": "최종 추천 의견"
}`

export interface StudentData {
  id: string
  name: string
  mbtiType?: string | null
  mbtiPercentages?: Record<string, number> | null
  sajuResult?: {
    fourPillars: Record<string, { heavenlyStem: string; earthlyBranch: string }>
    fiveElements: Record<string, number>
  } | null
  nameResult?: {
    grids: { won: number; hyung: number; yi: number; jeong: number }
  } | null
}

export interface TeacherData {
  id: string
  name: string
  role?: string
  mbtiType?: string | null
  mbtiPercentages?: Record<string, number> | null
  sajuResult?: {
    fourPillars: Record<string, { heavenlyStem: string; earthlyBranch: string }>
    fiveElements: Record<string, number>
  } | null
  nameResult?: {
    grids: { won: number; hyung: number; yi: number; jeong: number }
  } | null
}

function formatMbti(type?: string | null, pct?: Record<string, number> | null): string {
  if (!type) return "미측정"
  const pctStr = pct
    ? Object.entries(pct).map(([k, v]) => `${k}:${v}%`).join(" ")
    : ""
  return `${type} (${pctStr})`
}

function formatSaju(saju?: StudentData["sajuResult"] | null): string {
  if (!saju) return "미측정"
  const elements = Object.entries(saju.fiveElements).map(([k, v]) => `${k}:${v}`).join(" ")
  return `오행(${elements})`
}

function formatNameAnalysis(result?: StudentData["nameResult"] | null): string {
  if (!result) return "미측정"
  const g = result.grids
  return `원${g.won}/형${g.hyung}/이${g.yi}/정${g.jeong}`
}

export function buildCompatibilityPrompt(
  student: StudentData,
  teachers: TeacherData[]
): string {
  let prompt = `## 학생 정보\n`
  prompt += `- 이름: ${student.name}\n`
  prompt += `- MBTI: ${formatMbti(student.mbtiType, student.mbtiPercentages)}\n`
  prompt += `- 사주: ${formatSaju(student.sajuResult)}\n`
  prompt += `- 성명학: ${formatNameAnalysis(student.nameResult)}\n\n`

  prompt += `## 선생님 목록\n`
  for (const t of teachers) {
    prompt += `### ${t.name} (${t.role || "담당"})\n`
    prompt += `- MBTI: ${formatMbti(t.mbtiType, t.mbtiPercentages)}\n`
    prompt += `- 사주: ${formatSaju(t.sajuResult)}\n`
    prompt += `- 성명학: ${formatNameAnalysis(t.nameResult)}\n\n`
  }

  prompt += `위 데이터를 종합하여 각 선생님과의 궁합을 분석하고 순위를 매겨주세요.`
  return prompt
}
