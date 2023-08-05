import { z } from 'zod';
import getGpt4Completion from '../openai/getGpt4Completion';
import getContextualResponsePrompt from '../prompts/getContextualResponsePrompt';
import getRelevantPages from './getRelevantPages';
import type { StreamEvent } from '../../../../routes/api/response/+server';
import calculateTokens from '../openai/calculateTokens';
import paginatePagesByToken from './paginatePagesByToken';

const answerSchema = z.object({
  answer: z.string(),
  references: z.array(z.object({
    id: z.string(),
    title: z.string(),
    url: z.string(),
  })),
});

export type Answer = z.infer<typeof answerSchema>;

const emptyPromptTokenLength = calculateTokens(getContextualResponsePrompt('', ''), 0.2);

/**
 * @param referenceCount how many notion pages should be used to form the context
 */
export default async function getContextualResponse(
  query: string,
  referenceCount: number,
  emit: (event: StreamEvent) => void,
) {
  const { userQuery, vectorQuery, pages } = await getRelevantPages(query, referenceCount, emit);

  const tokensReservedForAnswers = 1000;
  const queryTokenLength = calculateTokens(userQuery, 0.2);
  // gpt-4 has a 8,192 token limit
  const tokenSpaceForPages = (
    8192 - emptyPromptTokenLength - queryTokenLength - tokensReservedForAnswers
  );

  const pageSnippets = paginatePagesByToken(pages, tokenSpaceForPages);

  const prompts = pageSnippets.map((page) => getContextualResponsePrompt(userQuery, page));

  // todo: dev only, so that we don't hit the openai api limit
  if (prompts.length > 5) throw new Error('Too many prompts');

  const statusAppend = prompts.length > 1 ? `s (1/${prompts.length})` : '';
  emit({ type: 'status', status: `Getting contextual response${statusAppend}` });
  let completedPrompts = 0;

  prompts.forEach(async (prompt) => {
    const response = await getGpt4Completion(prompt);

    let answers: Answer[];
    try {
      answers = z.array(answerSchema).parse(JSON.parse(response));
    } catch {
      throw new Error('Answers from OpenAI API are not valid JSON');
    }

    completedPrompts += 1;

    emit({
      type: 'response',
      final: completedPrompts === prompts.length,
      response: {
        answers,
        finalPrompt: prompt,
        userQuery,
        vectorQuery,
        pages,
      },
    });

    if (completedPrompts !== prompts.length) {
      emit({ type: 'status', status: `Getting contextual responses (${completedPrompts + 1}/${prompts.length})` });
    }
  });
}
