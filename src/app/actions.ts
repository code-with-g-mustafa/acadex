"use server";

import { answerQuestionsAboutDocument } from '@/ai/flows/answer-questions-about-document';

export async function getAIAnswer(documentContent: string, question: string): Promise<string> {
  try {
    const result = await answerQuestionsAboutDocument({ documentContent, question });
    return result.answer;
  } catch (error) {
    console.error("Error in getAIAnswer server action:", error);
    throw new Error("Failed to get answer from AI.");
  }
}
