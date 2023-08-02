import { z } from 'zod';
import getGpt4Completion from '../openai/getGpt4Completion';
import getContextualResponsePrompt from '../prompts/getContextualResponsePrompt';
import getRelevantPages from './getRelevantPages';

const answerSchema = z.object({
  answer: z.string(),
  references: z.array(z.object({
    id: z.string(),
    title: z.string(),
    url: z.string(),
  })),
});

export type Answer = z.infer<typeof answerSchema>;

/**
 * @param referenceCount how many notion pages should be used to form the context
 */
export default async function getContextualResponse(query: string, referenceCount: number) {
  const { userQuery, vectorQuery, pages } = await getRelevantPages(query, referenceCount);

  const prompt = getContextualResponsePrompt(userQuery, pages);

  const response = await getGpt4Completion(prompt);
  let answers: Answer[];

  try {
    answers = z.array(answerSchema).parse(JSON.parse(response));
  } catch {
    throw new Error('Answers from OpenAI API are not valid JSON');
  }

  // returning all this for development
  return {
    answers,
    finalPrompt: prompt,
    userQuery,
    vectorQuery,
    pages,
  };
}
