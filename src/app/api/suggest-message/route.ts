import { NextResponse } from "next/server";

import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HUGGING_FACE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '| |'. These question are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audienve. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? | | If you could have dinner with any historical figure, Who would it be? | | What's a simple thing that makes you happy? '. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const chatCompletion = await client.chatCompletion({
      model: "meta-llama/Llama-3.3-70B-Instruct",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates engaging questions for anonymous messaging platforms. Generate new questions, don't repeat the same questions. Do not cache any results.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      provider: "novita",
      max_tokens: 500,
      temperature: 0.8,
      top_p: 0.95,
    });

    if (
      !chatCompletion.choices ||
      !chatCompletion.choices[0]?.message?.content
    ) {
      throw new Error("Invalid response from the model");
    }

    let message = chatCompletion.choices[0].message.content.trim();
    console.log(message);
    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error occurred in suggest message:", error);
    return NextResponse.json(
      { error: "Failed to generate message suggestions. Please try again." },
      { status: 500 }
    );
  }
}
