import { MBTI_INTERPRETATION_PROMPT } from "./base.js"

export type MbtiPromptId = "default" | "mbti-learning" | "mbti-career" | "mbti-relationship"

export interface MbtiPromptMeta {
  id: MbtiPromptId
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

export interface MbtiPromptDefinition {
  id: MbtiPromptId
  meta: MbtiPromptMeta
  buildPrompt: (mbtiType: string, percentages: Record<string, number>, studentInfo?: StudentInfo) => string
}

const PROMPT_OPTIONS: MbtiPromptMeta[] = [
  { id: "default", name: "기본 MBTI 해석", shortDescription: "MBTI 유형 종합 해석", target: "전체", levels: ["초등", "중등", "고등"], purpose: "성격 유형 전반 파악", recommendedTiming: "최초 검사 시", tags: ["기본", "성격", "유형"] },
  { id: "mbti-learning", name: "MBTI 학습 전략", shortDescription: "유형별 맞춤 학습법", target: "전체", levels: ["중등", "고등"], purpose: "학습 효율 향상", recommendedTiming: "학기 초", tags: ["학습", "전략", "효율"] },
  { id: "mbti-career", name: "MBTI 진로 탐색", shortDescription: "유형별 적성 진로", target: "중고등", levels: ["중등", "고등"], purpose: "진로 방향 탐색", recommendedTiming: "진로 상담 시", tags: ["진로", "적성", "직업"] },
  { id: "mbti-relationship", name: "MBTI 대인관계", shortDescription: "유형별 소통 가이드", target: "전체", levels: ["초등", "중등", "고등"], purpose: "교우/사제 관계 개선", recommendedTiming: "관계 이슈 시", tags: ["관계", "소통", "갈등"] },
]

const PROMPTS: Record<MbtiPromptId, { suffix: string }> = {
  default: { suffix: "성격 특성, 강점, 약점, 학습 스타일을 종합적으로 해석해주세요." },
  "mbti-learning": { suffix: "유형에 맞는 최적 학습 전략, 집중 방법, 암기 전략, 시험 대비법을 제안해주세요." },
  "mbti-career": { suffix: "성격 유형에 맞는 진로 3가지, 추천 학과, 성공 핵심역량을 분석해주세요." },
  "mbti-relationship": { suffix: "다른 유형과의 소통법, 갈등 해결 전략, 팀워크 향상 방법을 설명해주세요." },
}

export function getPromptOptions(): MbtiPromptMeta[] {
  return PROMPT_OPTIONS
}

export function getBuiltInSeedData() {
  return PROMPT_OPTIONS.map((meta) => ({
    id: meta.id, name: meta.name, description: meta.shortDescription, category: "mbti", isBuiltIn: true,
  }))
}

export function getMbtiPrompt(id: MbtiPromptId): MbtiPromptDefinition | undefined {
  const meta = PROMPT_OPTIONS.find((p) => p.id === id)
  if (!meta) return undefined
  const prompt = PROMPTS[id]

  return {
    id,
    meta,
    buildPrompt: (mbtiType, percentages, studentInfo) => {
      let result = MBTI_INTERPRETATION_PROMPT(mbtiType, percentages)
      result += `\n\n${prompt.suffix}`
      if (studentInfo?.name) result += `\n학생 이름: ${studentInfo.name}`
      if (studentInfo?.grade) result += `, 학년: ${studentInfo.grade}`
      return result
    },
  }
}
