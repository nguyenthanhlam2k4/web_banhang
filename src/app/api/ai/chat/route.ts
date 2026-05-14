import { NextResponse } from 'next/server';
import { getGeminiResponse } from '@/ai/services/gemini.service';
import { SYSTEM_PROMPT } from '@/ai/prompts';
import { getProductContext } from '@/ai/utils/context-builder';

// Simple in-memory rate limiting (for demo/development)
const rateLimit = new Map();

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 1. Get Product Context
    let productContext = "";
    try {
      productContext = await getProductContext();
    } catch (ctxError) {
      console.error("Context fetch failed:", ctxError);
      productContext = "Error loading products.";
    }

    // 2. Build Full Prompt with Context
    const fullPrompt = `
      ${SYSTEM_PROMPT}
      
      CURRENT PRODUCT DATA:
      ${productContext}
      
      USER MESSAGE:
      ${message}
    `;

    // 3. Get AI Response
    const aiResponse = await getGeminiResponse(fullPrompt, history);

    return NextResponse.json({ 
      success: true, 
      content: aiResponse 
    });

  } catch (error: any) {
    console.error("AI API Error:", error.message);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Something went wrong with the AI assistant.",
      details: error.stack
    }, { status: 500 });
  }
}
