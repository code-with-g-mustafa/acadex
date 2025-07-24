// Implements the Genkit flow for answering questions about a document.

'use server';

/**
 * @fileOverview An AI agent for answering questions about the content of an uploaded document.
 *
 * - answerQuestionsAboutDocument - A function that handles the question answering process.
 * - AnswerQuestionsAboutDocumentInput - The input type for the answerQuestionsAboutDocument function.
 * - AnswerQuestionsAboutDocumentOutput - The return type for the answerQuestionsAboutDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsAboutDocumentInputSchema = z.object({
  documentContent: z.string().describe('The content of the uploaded document.'),
  question: z.string().describe('The question to be answered based on the document content.'),
});
export type AnswerQuestionsAboutDocumentInput = z.infer<
  typeof AnswerQuestionsAboutDocumentInputSchema
>;

const AnswerQuestionsAboutDocumentOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the question.'),
});
export type AnswerQuestionsAboutDocumentOutput = z.infer<
  typeof AnswerQuestionsAboutDocumentOutputSchema
>;

export async function answerQuestionsAboutDocument(
  input: AnswerQuestionsAboutDocumentInput
): Promise<AnswerQuestionsAboutDocumentOutput> {
  return answerQuestionsAboutDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionsAboutDocumentPrompt',
  input: {schema: AnswerQuestionsAboutDocumentInputSchema},
  output: {schema: AnswerQuestionsAboutDocumentOutputSchema},
  prompt: `You are an AI assistant that answers questions based on the provided document content.

Document Content: {{{documentContent}}}

Question: {{{question}}}

Answer: `,
});

const answerQuestionsAboutDocumentFlow = ai.defineFlow(
  {
    name: 'answerQuestionsAboutDocumentFlow',
    inputSchema: AnswerQuestionsAboutDocumentInputSchema,
    outputSchema: AnswerQuestionsAboutDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
