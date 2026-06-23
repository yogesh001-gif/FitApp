export function buildFoodAnalysisPrompt(input: { rawInput: string; profileSummary: string }) {
  return `You are a precision nutrition analyst. Interpret the food log and return strict JSON only.

User context: ${input.profileSummary}

Food log:
${input.rawInput}

Return JSON with this shape:
{
  "items": [{"name":"string","quantity":"string","calories":0,"protein":0,"carbohydrates":0,"fat":0,"fiber":0}],
  "summary": {"calories":0,"protein":0,"carbohydrates":0,"fat":0,"fiber":0},
  "assumptions": ["string"],
  "confidence": "low|medium|high"
}

Never include markdown. Use only valid JSON.`;
}

export function buildPlanPrompt(kind: 'diet' | 'workout', context: string) {
  const outputSpec = kind === 'diet'
    ? '{"title":"string","summary":"string","days":[{"day":"string","meals":[{"name":"string","description":"string","estimatedNutrition":{"calories":0,"protein":0,"carbohydrates":0,"fat":0,"fiber":0}}]}],"totals":{"calories":0,"protein":0,"carbohydrates":0,"fat":0,"fiber":0}}'
    : '{"title":"string","summary":"string","weeks":[{"week":"string","sessions":[{"day":"string","focus":"string","exercises":[{"name":"string","sets":0,"reps":"string","restSeconds":0}]}]}]}';

  return `Generate a unique personalized ${kind} plan as strict JSON only.

Context:
${context}

Output shape:
${outputSpec}`;
}

export function buildCoachPrompt(context: string, message: string) {
  return `You are an AI fitness coach. Use the user context and recent history to answer in a practical, personalized way. Avoid generic advice.

User context:
${context}

Message:
${message}

Respond in concise plain text with actionable guidance.`;
}
