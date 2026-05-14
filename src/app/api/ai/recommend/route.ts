import { NextResponse } from 'next/server';
import { generateContent } from '@/ai/services/gemini.service';
import { RECOMMENDATION_PROMPT } from '@/ai/prompts';
import { getProductContext, getSingleProductContext } from '@/ai/utils/context-builder';

export async function POST(request: Request) {
  try {
    const { productId, category } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // 1. Get Current Product Context
    const currentProduct = await getSingleProductContext(productId);

    // 2. Get Related Products Context (same category)
    const relatedProducts = await getProductContext({ 
      category: category,
      _id: { $ne: productId } // Exclude current product
    });

    // 3. Build Prompt
    const prompt = `
      You are an expert shopping consultant.
      
      CURRENT PRODUCT BEING VIEWED:
      ${currentProduct}
      
      OTHER AVAILABLE PRODUCTS IN THIS CATEGORY:
      ${relatedProducts}
      
      TASK:
      Based on the product above, provide 2 smart shopping tips or bundle recommendations. 
      Why should the customer consider this product or what should they buy with it?
      Recommend at least one specific product from the "OTHER AVAILABLE PRODUCTS" list.
      Keep it very concise (max 3 sentences per tip).
    `;

    // 4. Get AI Response
    const aiResponse = await generateContent(prompt);

    return NextResponse.json({ 
      success: true, 
      content: aiResponse 
    });

  } catch (error: any) {
    console.error("AI Recommendation API Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to generate AI advice." 
    }, { status: 500 });
  }
}
