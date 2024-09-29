import dotenv from "dotenv";
import path from "path";
import OpenAI from "openai";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const OpenAIKey = process.env.OPENAI_KEY;
	const openai = new OpenAI({ apiKey: OpenAIKey });
console.log(process.env.OPENAI_KEY);
export async function GetIngredients(title, description) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Here is the title of my dish: ${title} and here is the description: ${description}, from this title and description, generate me a list of produce, dairy, and meat ingredients in this dish. If there is none explicitly mentioned then do not include it. Only return the ingredients separated by ; in one list with all the ingredients, nothing else in your response` },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error in GetIngredients:", error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
}