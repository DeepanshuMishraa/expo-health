import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyANBo-oHX55PdZq4056Qvx9B-qQC8r-n4E");

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image?.inlineData?.data) {
      throw new Error("No image data provided");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    // Remove the data URL prefix if it exists
    const base64Data = image.inlineData.data.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `Analyze this food image and provide detailed nutritional information in the following JSON format:
    {
      "foodAnalysis": {
        "identifiedFood": "Name and detailed description of what you see in the image",
        "portionSize": "Estimated portion size in grams",
        "recognizedServingSize": "Estimated serving size in grams",
        "nutritionFactsPerPortion": {
          "calories": "Estimated calories",
          "protein": "Estimated protein in grams",
          "carbs": "Estimated carbs in grams",
          "fat": "Estimated fat in grams",
          "fiber": "Estimated fiber in grams",
          "sugar": "Estimated sugar in grams",
          "sodium": "Estimated sodium in mg",
          "cholesterol": "Estimated cholesterol in mg"
        },
        "nutritionFactsPer100g": {
          "calories": "Calories per 100g",
          "protein": "Protein in grams per 100g",
          "carbs": "Carbs in grams per 100g",
          "fat": "Fat in grams per 100g",
          "fiber": "Fiber in grams per 100g",
          "sugar": "Sugar in grams per 100g",
          "sodium": "Sodium in mg per 100g",
          "cholesterol": "Cholesterol in mg per 100g"
        },
        "additionalNotes": [
          "Any notable nutritional characteristics",
          "Presence of allergens",
          "Whether it's vegetarian/vegan/gluten-free if applicable"
        ]
      }
    }`;

    const parts = [
      { text: prompt },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data
        }
      }
    ];

    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();

    return Response.json({
      response: text,
      status: 200,
      message: "Image analyzed successfully"
    });
  } catch (err) {
    console.error("Analysis error:", err);
    return Response.json({
      response: null,
      status: 500,
      message: "Error analyzing image",
      error: {
        message: err instanceof Error ? err.message : "Unknown error",
        stack: err instanceof Error ? err.stack : undefined
      }
    });
  }
}
