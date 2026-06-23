const geminiBaseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
const geminiModel = 'gemini-2.5-flash';

async function callGemini(prompt: string, isJson: boolean = false) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const generationConfig: any = {
    temperature: 0.6
  };
  if (isJson) {
    generationConfig.responseMimeType = 'application/json';
  }

  let response = await fetch(`${geminiBaseUrl}/${geminiModel}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig
    })
  });

  if (response.status === 503) {
    console.warn('Gemini 2.5 is unavailable (503). Waiting 2 seconds and retrying...');
    // Wait for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Retry the exact same model
    response = await fetch(`${geminiBaseUrl}/${geminiModel}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig
      })
    });
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'no body');
    console.error(`Gemini API Error: ${response.status} ${response.statusText}`, errorBody);
    console.error('Requested URL:', `${geminiBaseUrl}/${geminiModel}:generateContent`);
    throw new Error(`Gemini request failed with ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? '').join('') ?? '';

  if (!text) {
    throw new Error('Gemini returned an empty response');
  }

  return text;
}

export async function generateJsonFromGemini<T>(prompt: string, validator: (value: unknown) => T) {
  const raw = await callGemini(prompt, true);
  const parsed = JSON.parse(raw);
  return validator(parsed);
}

export async function generateTextFromGemini(prompt: string) {
  return callGemini(prompt, false);
}
