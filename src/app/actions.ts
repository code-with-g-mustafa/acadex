"use server";

import { answerQuestionsAboutDocument } from '@/ai/flows/answer-questions-about-document';
import { summarizeDocument } from '@/ai/flows/summarize-document';
import type { SummarizeDocumentOutput } from '@/ai/flows/summarize-document';

export async function getAIAnswer(documentContent: string, question: string): Promise<string> {
  try {
    const result = await answerQuestionsAboutDocument({ documentContent, question });
    return result.answer;
  } catch (error) {
    console.error("Error in getAIAnswer server action:", error);
    throw new Error("Failed to get answer from AI.");
  }
}

export async function getAISummary(documentText: string): Promise<SummarizeDocumentOutput> {
  try {
    const result = await summarizeDocument({ documentText });
    return result;
  } catch (error) {
    console.error("Error in getAISummary server action:", error);
    throw new Error("Failed to get summary from AI.");
  }
}
