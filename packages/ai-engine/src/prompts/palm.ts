import { PALM_READING_PROMPT } from "./base.js"

export type PalmPromptId = "default" | "palm-talent" | "palm-future"

export interface PalmPromptMeta { id: PalmPromptId; name: string; shortDescription: string; tags: string[] }
export interface StudentInfo { name?: string; grade?: string }
export interface PalmPromptDefinition { id: PalmPromptId; meta: PalmPromptMeta; systemPrompt: string }

const PROMPT_OPTIONS: PalmPromptMeta[] = [
  { id: "default", name: "기본 손금 해석", shortDescription: "손금 기반 종합 분석", tags: ["손금", "기본"] },
  { id: "palm-talent", name: "재능 발견", shortDescription: "손금으로 보는 숨은 재능", tags: ["재능", "적성"] },
  { id: "palm-future", name: "미래 운세", shortDescription: "손금으로 보는 미래 전망", tags: ["운세", "미래"] },
]

const PROMPTS: Record<PalmPromptId, string> = {
  default: PALM_READING_PROMPT,
  "palm-talent": PALM_READING_PROMPT + "\n\n특히 두뇌선과 운명선을 중심으로 학생의 숨은 재능과 적성을 집중 분석해주세요.",
  "palm-future": PALM_READING_PROMPT + "\n\n특히 운명선과 생명선을 중심으로 미래 전망과 성장 가능성에 집중 분석해주세요.",
}

export function getPromptOptions(): PalmPromptMeta[] { return PROMPT_OPTIONS }
export function getBuiltInSeedData() {
  return PROMPT_OPTIONS.map((m) => ({ id: m.id, name: m.name, description: m.shortDescription, category: "palm", isBuiltIn: true }))
}
export function getPalmPrompt(id: PalmPromptId): PalmPromptDefinition | undefined {
  const meta = PROMPT_OPTIONS.find((p) => p.id === id)
  if (!meta) return undefined
  return { id, meta, systemPrompt: PROMPTS[id] }
}
