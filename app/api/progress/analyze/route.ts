import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { beforePhotoUrl, afterPhotoUrl } = await req.json();

    if (!beforePhotoUrl || !afterPhotoUrl) {
      return Response.json({ error: 'Missing photo URLs' }, { status: 400 });
    }

    // Fetch images and convert to base64
    const [beforeRes, afterRes] = await Promise.all([
      fetch(beforePhotoUrl),
      fetch(afterPhotoUrl)
    ]);

    if (!beforeRes.ok || !afterRes.ok) {
      throw new Error("Failed to fetch images from URL");
    }

    const beforeBuffer = await beforeRes.arrayBuffer();
    const afterBuffer = await afterRes.arrayBuffer();

    const beforeBase64 = Buffer.from(beforeBuffer).toString('base64');
    const afterBase64 = Buffer.from(afterBuffer).toString('base64');

    const prompt = `You are a professional fitness coach and body composition expert.
Analyze these two progress photos of the same person.
Image 1 is the "Before" photo. Image 2 is the "After" photo.
Compare the two and provide a highly encouraging, short (2-3 sentences), professional analysis of the visible physical changes (e.g., "Chest appears larger and more defined", "Waist appears noticeably slimmer"). If it's hard to tell, encourage them to keep going. Do not mention lighting or angles unless it completely obscures the view. Focus on muscle definition and body fat.`;

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image', image: `data:image/jpeg;base64,${beforeBase64}` },
            { type: 'image', image: `data:image/jpeg;base64,${afterBase64}` },
          ]
        }
      ]
    });

    return Response.json({ analysis: text });

  } catch (err: any) {
    console.error("AI Analysis error:", err);
    return Response.json({ error: 'Analysis failed: ' + err.message }, { status: 500 });
  }
}
