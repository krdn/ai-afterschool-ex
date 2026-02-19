export type ZodiacPromptId = "default" | "zodiac-learning" | "zodiac-relationship"

export interface ZodiacPromptDefinition {
  id: ZodiacPromptId
  name: string
  shortDescription: string
  systemPrompt: string
  tags: string[]
}

const PROMPTS: Record<ZodiacPromptId, ZodiacPromptDefinition> = {
  default: {
    id: "default",
    name: "기본 별자리 해석",
    shortDescription: "별자리 기반 성격 분석",
    systemPrompt: `당신은 서양 점성술 전문가입니다. 학생의 별자리를 바탕으로 성격과 특성을 해석해주세요.

1. 별자리 기본 성향
2. 성격의 강점과 약점
3. 학습 특성
4. 대인관계 경향
5. 이달의 조언`,
    tags: ["별자리", "성격", "기본"],
  },
  "zodiac-learning": {
    id: "zodiac-learning",
    name: "별자리 학습 전략",
    shortDescription: "별자리별 맞춤 학습법",
    systemPrompt: `당신은 교육 점성술 전문가입니다. 학생의 별자리 특성에 맞는 학습 전략을 제안해주세요.

1. 별자리별 학습 스타일
2. 최적 학습 시간대
3. 집중력 향상 방법
4. 시험 대비 전략
5. 이번 달 학업운`,
    tags: ["학습", "전략", "학업운"],
  },
  "zodiac-relationship": {
    id: "zodiac-relationship",
    name: "별자리 대인관계",
    shortDescription: "별자리별 대인관계 가이드",
    systemPrompt: `당신은 관계 점성술 전문가입니다. 학생의 별자리를 바탕으로 대인관계 가이드를 제공해주세요.

1. 궁합이 좋은 별자리
2. 주의해야 할 별자리
3. 친구 관계 팁
4. 선생님과의 소통법
5. 갈등 해결 전략`,
    tags: ["관계", "궁합", "소통"],
  },
}

export function getPromptOptions() {
  return Object.values(PROMPTS).map(({ id, name, shortDescription, tags }) => ({ id, name, shortDescription, tags }))
}
export function getBuiltInSeedData() {
  return Object.values(PROMPTS).map((p) => ({ id: p.id, name: p.name, description: p.shortDescription, category: "zodiac", isBuiltIn: true }))
}
export function getZodiacPrompt(id: ZodiacPromptId): ZodiacPromptDefinition | undefined {
  return PROMPTS[id]
}
