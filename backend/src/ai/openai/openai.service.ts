import { Injectable } from '@nestjs/common';
import { openai } from './openai.client';

@Injectable()
export class OpenAIService {
  async chat(prompt: string) {
    const completion = await openai.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    return completion.choices[0].message.content;
  }

  async chatCompletion(
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  ) {
    const completion = await openai.chat.completions.create({
      model: 'gpt-5-mini',
      messages,
    });

    const content = completion.choices?.[0]?.message?.content ?? '{}';
    const usage = completion.usage;
    const promptTokens = usage?.prompt_tokens ?? 0;
    const completionTokens = usage?.completion_tokens ?? 0;

    const pricing = {
      input: 0.25, // $ per 1M tokens
      output: 2, // $ per 1M tokens
    };

    const inputCost = (promptTokens / 1_000_000) * pricing.input;
    const outputCost = (completionTokens / 1_000_000) * pricing.output;

    const totalCost = (inputCost + outputCost) * 1000; // Convert to dollars

    return {
      content,
      totalCost,
    };
  }
}
