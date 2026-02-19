export type NamePromptId = "default" | "name-meaning" | "name-fortune"

export interface NamePromptDefinition {
  id: NamePromptId
  name: string
  shortDescription: string
  systemPrompt: string
  tags: string[]
}

const PROMPTS: Record<NamePromptId, NamePromptDefinition> = {
  default: {
    id: "default",
    name: "기본 이름풀이",
    shortDescription: "성명학 기반 이름 분석",
    systemPrompt: `당신은 성명학(작명학) 전문가입니다. 학생의 이름을 분석하여 성명학적 특성을 해석해주세요.

분석 항목:
1. 원격/형격/이격/정격 수리 해석
2. 음양 균형
3. 이름이 나타내는 성격 특성
4. 이름의 에너지와 잠재력
5. 조언 및 보완점`,
    tags: ["이름", "성명학", "기본"],
  },
  "name-meaning": {
    id: "name-meaning",
    name: "이름 의미 심층",
    shortDescription: "한자별 의미 심층 분석",
    systemPrompt: `당신은 한자학과 성명학 전문가입니다. 학생 이름의 한자 하나하나의 의미를 심층 분석해주세요.

1. 각 한자의 뜻과 유래
2. 한자 조합의 시너지
3. 이름이 담고 있는 부모의 소망
4. 성명학적 길흉 해석
5. 이름의 숨겨진 잠재력`,
    tags: ["한자", "의미", "심층"],
  },
  "name-fortune": {
    id: "name-fortune",
    name: "이름 운세",
    shortDescription: "이름 기반 운세 분석",
    systemPrompt: `당신은 성명학 운세 전문가입니다. 학생의 이름 수리를 바탕으로 운세를 분석해주세요.

1. 전반적 운세
2. 학업운
3. 대인관계운
4. 건강운
5. 이번 학기 주의사항 및 조언`,
    tags: ["운세", "학업운", "관계운"],
  },
}

export function getPromptOptions() {
  return Object.values(PROMPTS).map(({ id, name, shortDescription, tags }) => ({ id, name, shortDescription, tags }))
}
export function getBuiltInSeedData() {
  return Object.values(PROMPTS).map((p) => ({ id: p.id, name: p.name, description: p.shortDescription, category: "name", isBuiltIn: true }))
}
export function getNamePrompt(id: NamePromptId): NamePromptDefinition | undefined {
  return PROMPTS[id]
}
