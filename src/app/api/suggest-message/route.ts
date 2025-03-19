// import OpenAI from "openai";
// import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

// // Create an OpenAI API client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req: Request) {
//   try {
//     const prompt =
//       "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '| |'. These question are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audienve. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? | | If you could have dinner with any historical figure, Who would it be? | | What's a simple thing that makes you happy? '. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//     // Ask OpenAI for a streaming chat completion given the prompt
//     const response = await openai.completions.create({
//       model: "gpt-3.5-turbo",
//       stream: true,
//       prompt,
//     });

//     // Convert the response into a friendly text-stream
//     const stream = OpenAIStream(response);
//     // Respond with the stream
//     return new StreamingTextResponse(stream);
//   } catch (error) {
//     if (error instanceof OpenAI.APIError) {
//       const { name, status, headers, message } = error;
//       return NextResponse.json(
//         {
//           name,
//           status,
//           headers,
//           message,
//         },
//         { status: 500 }
//       );
//     } else {
//       console.error("Error occured in suggest message", error);
//       throw error;
//     }
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const prompt =
//       "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '| |'. These question are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audienve. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? | | If you could have dinner with any historical figure, Who would it be? | | What's a simple thing that makes you happy? '. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//     // Format the prompt according to Llama model's expected input format
//     const formattedPrompt = `[INST] ${prompt} [/INST]`;

//     // Add parameters recommended for Llama inference
//     const parameters = {
//       inputs: formattedPrompt,
//       parameters: {
//         max_length: 200,
//         temperature: 0.7,
//         top_p: 0.95,
//         do_sample: true,
//         return_full_text: false,
//       },
//       options: {
//         wait_for_model: true,
//       },
//     };
//     const response = await fetch(
//       "https://api-inference.huggingface.co/models/meta-llama/Llama-3.3-70B-Instruct",
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         method: "POST",
//         body: JSON.stringify(parameters),
//       }
//     );

//     const result = await response.json();
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     console.log(result);
//     return NextResponse.json({ message: result[0].generated_text });
//   } catch (error) {
//     console.error("Error occurred in suggest message:", error);
//     return NextResponse.json(
//       { error: "Failed to generate message suggestions" },
//       { status: 500 }
//     );
//   }
// }

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
