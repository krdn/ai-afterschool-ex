export type VarkPromptId = "default" | "vark-study-plan" | "vark-subject-strategy"

export interface VarkPromptDefinition {
  id: VarkPromptId
  name: string
  shortDescription: string
  systemPrompt: string
  tags: string[]
}

const PROMPTS: Record<VarkPromptId, VarkPromptDefinition> = {
  default: {
    id: "default",
    name: "기본 VARK 해석",
    shortDescription: "학습유형 종합 해석",
    systemPrompt: `당신은 VARK 학습유형 전문가입니다. 학생의 VARK 검사 결과를 바탕으로 학습 특성을 해석해주세요.

각 유형(Visual/Auditory/Read-Write/Kinesthetic)의 점수를 분석하고:
1. 주요 학습유형 설명
2. 효과적인 학습 방법
3. 약한 유형 보완 전략
4. 구체적인 학습 팁`,
    tags: ["VARK", "학습유형", "기본"],
  },
  "vark-study-plan": {
    id: "vark-study-plan",
    name: "VARK 학습 계획표",
    shortDescription: "학습유형 맞춤 시간표",
    systemPrompt: `당신은 학습 코칭 전문가입니다. VARK 학습유형 결과를 바탕으로 맞춤 학습 계획표를 작성해주세요.

1. 일일 학습 시간표 (유형별 최적 시간대)
2. 과목별 학습 방법 (유형 활용)
3. 휴식 및 복습 패턴
4. 주간 학습 루틴 제안`,
    tags: ["학습계획", "시간표", "루틴"],
  },
  "vark-subject-strategy": {
    id: "vark-subject-strategy",
    name: "VARK 과목별 공략법",
    shortDescription: "유형별 과목 학습 전략",
    systemPrompt: `당신은 교육과정 전문가입니다. VARK 학습유형 결과를 바탕으로 과목별 맞춤 전략을 제안해주세요.

1. 국어/영어 학습법
2. 수학/과학 학습법
3. 사회/역사 학습법
4. 예체능 학습법
5. 시험 대비 전략`,
    tags: ["과목", "전략", "시험"],
  },
}

export function getPromptOptions() {
  return Object.values(PROMPTS).map(({ id, name, shortDescription, tags }) => ({ id, name, shortDescription, tags }))
}
export function getBuiltInSeedData() {
  return Object.values(PROMPTS).map((p) => ({ id: p.id, name: p.name, description: p.shortDescription, category: "vark", isBuiltIn: true }))
}
export function getVarkPrompt(id: VarkPromptId): VarkPromptDefinition | undefined {
  return PROMPTS[id]
}
