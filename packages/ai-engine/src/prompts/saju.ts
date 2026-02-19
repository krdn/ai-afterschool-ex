import { SAJU_INTERPRETATION_PROMPT } from "./base.js"

export type AnalysisPromptId =
  | "default"
  | "learning-dna"
  | "exam-slump"
  | "career-navi"
  | "subject-strategy"
  | "mental-energy"

export interface AnalysisPromptMeta {
  id: AnalysisPromptId
  name: string
  shortDescription: string
  target: string
  levels: string[]
  purpose: string
  recommendedTiming: string
  tags: string[]
}

export interface StudentInfo {
  name?: string
  grade?: string
  school?: string
}

export interface AnalysisPromptDefinition {
  id: AnalysisPromptId
  meta: AnalysisPromptMeta
  buildPrompt: (
    sajuResult: Parameters<typeof SAJU_INTERPRETATION_PROMPT>[0],
    studentInfo?: StudentInfo,
    additionalRequest?: string
  ) => string
}

const PROMPT_OPTIONS: AnalysisPromptMeta[] = [
  {
    id: "default",
    name: "기본 사주 해석",
    shortDescription: "사주팔자 전반적 해석",
    target: "전체",
    levels: ["초등", "중등", "고등"],
    purpose: "학생의 전반적인 성향과 특성 파악",
    recommendedTiming: "최초 상담 시",
    tags: ["기본", "성향", "전반"],
  },
  {
    id: "learning-dna",
    name: "학습 체질 분석",
    shortDescription: "오행 기반 학습 특성 분석",
    target: "전체",
    levels: ["초등", "중등", "고등"],
    purpose: "개인별 최적 학습 방법 도출",
    recommendedTiming: "학기 초",
    tags: ["학습", "체질", "오행"],
  },
  {
    id: "exam-slump",
    name: "시험운 & 슬럼프 극복",
    shortDescription: "시험 성적 저조 원인 분석 및 극복법",
    target: "중고등",
    levels: ["중등", "고등"],
    purpose: "성적 하락기 원인 파악 및 대응",
    recommendedTiming: "성적 하락 시",
    tags: ["시험", "슬럼프", "극복"],
  },
  {
    id: "career-navi",
    name: "진로 나침반",
    shortDescription: "사주 기반 적성 및 진로 탐색",
    target: "중고등",
    levels: ["중등", "고등"],
    purpose: "적성에 맞는 진로 방향 제시",
    recommendedTiming: "진로 상담 시",
    tags: ["진로", "적성", "직업"],
  },
  {
    id: "subject-strategy",
    name: "과목별 전략",
    shortDescription: "오행 기반 과목별 학습 전략",
    target: "중고등",
    levels: ["중등", "고등"],
    purpose: "과목별 맞춤 학습법 제안",
    recommendedTiming: "학기 초 / 과목 선택 시",
    tags: ["과목", "전략", "학습법"],
  },
  {
    id: "mental-energy",
    name: "멘탈 에너지 관리",
    shortDescription: "오행 균형 기반 심리 에너지 관리",
    target: "전체",
    levels: ["초등", "중등", "고등"],
    purpose: "학습 스트레스 관리 및 동기 부여",
    recommendedTiming: "스트레스 호소 시",
    tags: ["멘탈", "스트레스", "에너지"],
  },
]

const PROMPT_TEMPLATES: Record<AnalysisPromptId, string> = {
  default: `{BASE_PROMPT}

학생의 전반적인 성향, 학습 특성, 대인관계 경향을 종합적으로 해석해주세요.
응답은 다음 섹션으로 구성하세요:
1. 사주 총평
2. 성격 및 성향
3. 학습 특성
4. 대인관계
5. 선생님께 드리는 조언`,

  "learning-dna": `{BASE_PROMPT}

학생의 오행 분포를 바탕으로 학습 체질을 분석해주세요:
1. 학습 체질 유형 (목/화/토/금/수 중 강한 기운)
2. 최적 학습 시간대
3. 효과적인 학습 환경
4. 집중력 패턴
5. 과목별 친화도
6. 맞춤 학습 전략 3가지`,

  "exam-slump": `{BASE_PROMPT}

시험 성적이 저조한 학생의 원인을 사주 관점에서 분석해주세요:
1. 현재 운기가 학업에 미치는 영향
2. 기운 불균형이 집중력에 미치는 영향
3. 슬럼프 극복을 위한 오행 보충 방법
4. 당장 실천할 수 있는 3가지 조언
5. 장기적 학업운 전망`,

  "career-navi": `{BASE_PROMPT}

학생의 적성과 진로를 사주 관점에서 탐색해주세요:
1. 타고난 재능과 적성 분야
2. 추천 직업/분야 (3가지)
3. 피해야 할 분야
4. 성공을 위한 핵심 역량
5. 진로 탐색 시 주의사항`,

  "subject-strategy": `{BASE_PROMPT}

오행 분포를 바탕으로 과목별 학습 전략을 제안해주세요:
1. 국어/영어 (목 기운 관련)
2. 수학/과학 (금 기운 관련)
3. 사회/역사 (토 기운 관련)
4. 예체능 (화 기운 관련)
5. 종합 과목 선택 가이드`,

  "mental-energy": `{BASE_PROMPT}

학생의 오행 균형 상태를 분석하여 멘탈 관리법을 제안해주세요:
1. 현재 에너지 상태 진단
2. 스트레스 원인 (오행 관점)
3. 에너지 충전 방법 3가지
4. 감정 관리 팁
5. 동기부여 방법`,
}

export function getPromptOptions(): AnalysisPromptMeta[] {
  return PROMPT_OPTIONS
}

export function getPromptDefinition(id: AnalysisPromptId): AnalysisPromptDefinition {
  const meta = PROMPT_OPTIONS.find((p) => p.id === id) || PROMPT_OPTIONS[0]
  const template = PROMPT_TEMPLATES[id] || PROMPT_TEMPLATES.default

  return {
    id,
    meta,
    buildPrompt: (sajuResult, studentInfo, additionalRequest) => {
      return buildPromptFromTemplate(template, sajuResult, studentInfo, additionalRequest)
    },
  }
}

export function buildPromptFromTemplate(
  template: string,
  sajuResult: Parameters<typeof SAJU_INTERPRETATION_PROMPT>[0],
  studentInfo?: StudentInfo,
  additionalRequest?: string
): string {
  const basePrompt = SAJU_INTERPRETATION_PROMPT(sajuResult)
  let result = template.replace("{BASE_PROMPT}", basePrompt)

  if (studentInfo) {
    const info: string[] = []
    if (studentInfo.name) info.push(`이름: ${studentInfo.name}`)
    if (studentInfo.grade) info.push(`학년: ${studentInfo.grade}`)
    if (studentInfo.school) info.push(`학교: ${studentInfo.school}`)
    if (info.length > 0) result += `\n\n학생 정보: ${info.join(", ")}`
  }

  if (additionalRequest) {
    result += `\n\n추가 요청: ${additionalRequest}`
  }

  return result
}

export function getBuiltInSeedData() {
  return PROMPT_OPTIONS.map((meta) => ({
    id: meta.id,
    name: meta.name,
    description: meta.shortDescription,
    category: "saju",
    isBuiltIn: true,
  }))
}

export function getPromptPreviewText(id: AnalysisPromptId): string {
  return PROMPT_TEMPLATES[id] || PROMPT_TEMPLATES.default
}

export function getTemplatePreviewText(template: string): string {
  return template.replace("{BASE_PROMPT}", "[사주 데이터 기반 기본 프롬프트]")
}
