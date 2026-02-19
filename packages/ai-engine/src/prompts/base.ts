export const FACE_READING_PROMPT = `당신은 동양 관상학 전문가입니다. 학생의 얼굴 사진을 분석하여 성격과 학습 특성을 파악해주세요.

다음 JSON 형식으로 응답하세요:
{
  "faceShape": "얼굴형 (둥근형/각진형/긴형/하트형/타원형)",
  "features": {
    "eyes": "눈 특징 설명",
    "nose": "코 특징 설명",
    "mouth": "입 특징 설명",
    "forehead": "이마 특징 설명",
    "ears": "귀 특징 설명"
  },
  "personality": ["성격 특성 1", "성격 특성 2", "성격 특성 3"],
  "learningStyle": "학습 스타일 설명",
  "strengths": ["강점 1", "강점 2"],
  "advice": "학습 및 생활 조언",
  "fortune": "전반적인 운세 한 줄"
}`

export const PALM_READING_PROMPT = `당신은 동양 수상학(손금) 전문가입니다. 학생의 손바닥 사진을 분석하여 재능과 잠재력을 파악해주세요.

다음 JSON 형식으로 응답하세요:
{
  "mainLines": {
    "lifeLine": "생명선 분석",
    "headLine": "두뇌선 분석",
    "heartLine": "감정선 분석",
    "fateLine": "운명선 분석 (있는 경우)"
  },
  "secondaryLines": ["부속 손금 특징 1", "부속 손금 특징 2"],
  "specialFeatures": ["특이 사항 1"],
  "talents": ["재능 1", "재능 2"],
  "learningAdvice": "학습 조언",
  "futureOutlook": "미래 전망"
}`

export function SAJU_INTERPRETATION_PROMPT(sajuResult: {
  fourPillars: { year: { heavenlyStem: string; earthlyBranch: string }; month: { heavenlyStem: string; earthlyBranch: string }; day: { heavenlyStem: string; earthlyBranch: string }; hour: { heavenlyStem: string; earthlyBranch: string } }
  fiveElements: Record<string, number>
  tenGods: Record<string, number>
}): string {
  const fp = sajuResult.fourPillars
  const pillarsStr =
    `년주: ${fp.year.heavenlyStem}${fp.year.earthlyBranch}, ` +
    `월주: ${fp.month.heavenlyStem}${fp.month.earthlyBranch}, ` +
    `일주: ${fp.day.heavenlyStem}${fp.day.earthlyBranch}, ` +
    `시주: ${fp.hour.heavenlyStem}${fp.hour.earthlyBranch}`

  const elementsStr = Object.entries(sajuResult.fiveElements)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ")

  const godsStr = Object.entries(sajuResult.tenGods)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ")

  return `당신은 사주팔자 전문가입니다. 다음 사주 데이터를 바탕으로 학생의 성향과 학습 특성을 해석해주세요.

사주 데이터:
- 사주팔자: ${pillarsStr}
- 오행 분포: ${elementsStr}
- 십성 분포: ${godsStr}

상세하고 실용적인 해석을 제공해주세요. 학습 방법, 적성, 대인관계에 대한 조언을 포함하세요.`
}

export function MBTI_INTERPRETATION_PROMPT(
  mbtiType: string,
  percentages: Record<string, number>
): string {
  const pctStr = Object.entries(percentages)
    .map(([k, v]) => `${k}: ${v}%`)
    .join(", ")

  return `당신은 MBTI 전문가입니다. 다음 학생의 MBTI 검사 결과를 해석해주세요.

MBTI 유형: ${mbtiType}
세부 비율: ${pctStr}

성격 특성, 학습 스타일, 강점과 약점, 효과적인 학습 방법을 상세히 설명해주세요.`
}

export const DISCLAIMER_TEXT = {
  saju: "* 본 분석은 동양 철학에 기반한 참고 자료이며, 과학적 근거를 갖추지 않을 수 있습니다.",
  face: "* 관상 분석은 전통 동양 학문에 기반하며, 재미로 참고해주세요.",
  palm: "* 손금 분석은 전통 수상학에 기반하며, 참고 목적으로 활용해주세요.",
  mbti: "* MBTI는 성격 경향을 나타내며, 절대적인 성격 분류가 아닙니다.",
  zodiac: "* 별자리 운세는 엔터테인먼트 목적이며, 실제 운명을 결정하지 않습니다.",
  name: "* 성명학 분석은 전통 학문에 기반하며, 참고 목적으로 활용해주세요.",
}
