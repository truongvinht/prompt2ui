import { systemPrompt } from "@/app/api/chat/prompt";
import { anthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";

import { CoreMessage, streamText } from "ai";

const OPENAI_KEY = process.env.OPENAI_KEY??undefined;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL??undefined;
const GROQ_KEY = process.env.GROQ_KEY??undefined;
const GROQ_MODEL = process.env.GROQ_MODEL??undefined;

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  if (OLLAMA_MODEL !== undefined) {
    // Ollama
    const openai = createOpenAI({
      baseURL: "http://localhost:11434/v1/",
      apiKey: "ollama"
    });

    const result = await streamText({
      model: openai(OLLAMA_MODEL),
      system: systemPrompt,
      messages,
    });

    return result.toAIStreamResponse();
  } else if (GROQ_KEY !== undefined && GROQ_MODEL !== undefined) {

    const openai = createOpenAI({
      baseURL: "https://api.groq.com/openai/v1/",
      apiKey: GROQ_KEY
    });

    const result = await streamText({
      model: openai(GROQ_MODEL),
      system: systemPrompt,
      messages,
    });

    return result.toAIStreamResponse();
  } else if (OPENAI_KEY !== undefined) {
    // Openai
    const openai = createOpenAI({
      apiKey: OPENAI_KEY
    });

    const result = await streamText({
      model: openai("gpt4o"),
      system: systemPrompt,
      messages,
    });

    return result.toAIStreamResponse();
  } else {
    const result = await streamText({
      model: anthropic("claude-3-5-sonnet-20240620"),
      system: systemPrompt,
      messages,
    });
    return result.toAIStreamResponse();
  }



}
