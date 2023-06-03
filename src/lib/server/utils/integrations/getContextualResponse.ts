import getGpt4Completion from '../openai/getGpt4Completion';
import getContextualResponsePrompt from '../prompts/getContextualResponsePrompt';
import getRelevantPages from './getRelevantPages';

/**
 * @param referenceCount how many notion pages should be used to form the context
 */
export default async function getContextualResponse(query: string, referenceCount: number) {
  const { userQuery, vectorQuery, pages } = await getRelevantPages(query, referenceCount);

  const prompt = getContextualResponsePrompt(userQuery, pages);

  const response = await getGpt4Completion(prompt);

  // returning all this for development
  return {
    response,
    finalPrompt: prompt,
    userQuery,
    vectorQuery,
    pages,
  };
}
