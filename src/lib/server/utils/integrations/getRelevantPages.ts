import { z } from 'zod';
import createEmbedding from '../openai/createEmbedding';
import getIndex from '../pinecone/getIndex';
import getGpt4Completion from '../openai/getGpt4Completion';
import getQueryEnhancementPrompt from '../prompts/getQueryEnhancementPrompt';

const metadataSchema = z.object({
  title: z.string(),
  content: z.array(z.string()),
});

export default async function getRelevantPages(query: string, pageCount = 3) {
  const index = await getIndex();

  const modifiedQuery = await getGpt4Completion(getQueryEnhancementPrompt(query));

  const embedding = await createEmbedding(modifiedQuery);

  const response = await index.query({
    queryRequest: {
      vector: embedding,
      topK: pageCount,
      includeMetadata: true,
    },
  });

  if (response.matches === undefined) throw new Error('No matches found');

  return {
    // todo: returning modified query for development
    userQuery: query,
    vectorQuery: modifiedQuery,
    pages: response.matches.map((match) => {
      const { id, metadata, score } = match;
      const { title, content } = metadataSchema.parse(metadata);
      return {
        id,
        score,
        title,
        content,
      };
    }),
  };
}
