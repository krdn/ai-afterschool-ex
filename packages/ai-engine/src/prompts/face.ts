import { FACE_READING_PROMPT } from "./base.js"

export type FacePromptId = "default" | "face-personality" | "face-academic"

export interface FacePromptMeta {
  id: FacePromptId
  name: string
  shortDescription: string
  tags: string[]
}

export interface StudentInfo { name?: string; grade?: string }

export interface FacePromptDefinition {
  id: FacePromptId
  meta: FacePromptMeta
  systemPrompt: string
}

const PROMPT_OPTIONS: FacePromptMeta[] = [
  { id: "default", name: "기본 관상 해석", shortDescription: "얼굴 특징 기반 성격 분석", tags: ["관상", "성격"] },
  { id: "face-personality", name: "성격 심층 분석", shortDescription: "관상 기반 심층 성격 탐구", tags: ["성격", "심층"] },
  { id: "face-academic", name: "학업 적성", shortDescription: "관상 기반 학업 적성 분석", tags: ["학업", "적성"] },
]

const PROMPTS: Record<FacePromptId, string> = {
  default: FACE_READING_PROMPT,
  "face-personality": FACE_READING_PROMPT + "\n\n특히 성격의 강점과 약점, 내면의 잠재력에 집중하여 분석해주세요.",
  "face-academic": FACE_READING_PROMPT + "\n\n특히 학업 적성, 집중력 특성, 효과적인 학습 환경에 집중하여 분석해주세요.",
}

export function getPromptOptions(): FacePromptMeta[] { return PROMPT_OPTIONS }
export function getBuiltInSeedData() {
  return PROMPT_OPTIONS.map((m) => ({ id: m.id, name: m.name, description: m.shortDescription, category: "face", isBuiltIn: true }))
}
export function getFacePrompt(id: FacePromptId): FacePromptDefinition | undefined {
  const meta = PROMPT_OPTIONS.find((p) => p.id === id)
  if (!meta) return undefined
  return { id, meta, systemPrompt: PROMPTS[id] }
}
