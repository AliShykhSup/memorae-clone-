import OpenAI from 'openai';
import { config } from '../config/config';

const openai = new OpenAI({
  apiKey: config.openaiApiKey
});

export class AIService {
  async generateMessage(targetAudience: string): Promise<string> {
    if (!config.openaiApiKey) {
      // Fallback message if no API key is provided
      return `Hi! I noticed you're interested in ${targetAudience}. I'd love to connect and share some valuable insights with you!`;
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at writing personalized, friendly Instagram DM messages. Keep messages under 150 characters, casual, and engaging.'
          },
          {
            role: 'user',
            content: `Generate a personalized Instagram DM for someone interested in: ${targetAudience}`
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      });

      return response.choices[0]?.message?.content || 'Hi! I\'d love to connect with you!';
    } catch (error) {
      console.error('Error generating AI message:', error);
      return `Hi! I noticed you're interested in ${targetAudience}. I'd love to connect and share some valuable insights with you!`;
    }
  }

  async generatePersonalizedMessage(targetAudience: string, leadName: string): Promise<string> {
    if (!config.openaiApiKey) {
      return `Hi ${leadName}! I noticed you're interested in ${targetAudience}. Let's connect!`;
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at writing personalized, friendly Instagram DM messages. Keep messages under 150 characters, casual, and engaging.'
          },
          {
            role: 'user',
            content: `Generate a personalized Instagram DM for ${leadName} who is interested in: ${targetAudience}`
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      });

      return response.choices[0]?.message?.content || `Hi ${leadName}! Let's connect!`;
    } catch (error) {
      console.error('Error generating personalized AI message:', error);
      return `Hi ${leadName}! I noticed you're interested in ${targetAudience}. Let's connect!`;
    }
  }
}

export const aiService = new AIService();
