import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userData } = body;

    const prompt = `
    You are an expert creative web developer and art director. 
    Analyze the following developer profile and generate a theme configuration for their scrollytelling portfolio.
    
    User Profile Data:
    ${JSON.stringify(userData, null, 2)}
    
    Rules for design choices:
    - PAY STRICT ATTENTION TO THE "ROLE".
    - If the role is "Backend Infrastructure Engineer", "DevOps", or similar, YOU MUST pick the "developer" template with green/black colors.
    - If the role contains "Creator", "YouTuber", "Video Editor", or "Vlogger", YOU MUST pick the "creator" template with high-energy colors (e.g., #FF0000 for YouTube red, neon purples, or vibrant yellows).
    - If the role is "Full Stack", "Frontend", or mentions UI/UX/Animation, pick the "bold" template.
    - If the role is "Enterprise", "Corporate", or "Finance", pick the "minimal" template.

    You MUST respond with a raw JSON object using this exact schema:
    {
      "templateName": "minimal" | "bold" | "developer" | "creator",
      "primaryColor": "A valid CSS hex code (e.g., '#ff0000')",
      "backgroundColor": "A very dark CSS hex code for the background (e.g., '#0a0a0a')",
      "fontPairing": "A short string describing two fonts",
      "narrativeFlow": "chronological" | "skill-first" | "project-heavy"
    }
    `;

    // 2. Configure the Gemini Model
    // We use gemini-2.5-flash as it is lightning fast for this kind of structured data task
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json", // Forces clean JSON output
        temperature: 0.7, // Allows for creative color combinations
      },
    });

    // 3. Call Gemini
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) {
      throw new Error("Gemini returned an empty response");
    }

    // 4. Parse and return
    const aiConfig = JSON.parse(responseText);

    return NextResponse.json({ config: aiConfig });
  } catch (error) {
    console.error("Theme Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI theme" },
      { status: 500 },
    );
  }
}
