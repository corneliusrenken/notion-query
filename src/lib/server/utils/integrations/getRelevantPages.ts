import { z } from 'zod';
import createEmbedding from '../openai/createEmbedding';
import getIndex from '../pinecone/getIndex';
import getGpt4Completion from '../openai/getGpt4Completion';
import getQueryEnhancementPrompt from '../prompts/getQueryEnhancementPrompt';
import type { StreamEvent } from '../../../../routes/api/response/+server';

const metadataSchema = z.object({
  title: z.string(),
  url: z.string(),
  content: z.array(z.string()),
});

export default async function getRelevantPages(
  query: string,
  pageCount = 3,
  emit?: (event: StreamEvent) => void,
) {
  emit?.({ type: 'status', status: 'Getting Index' });
  const index = await getIndex();

  emit?.({ type: 'status', status: 'Optimizing Query' });
  const modifiedQuery = await getGpt4Completion(getQueryEnhancementPrompt(query));

  emit?.({ type: 'status', status: 'Creating Vector' });
  const embedding = await createEmbedding(modifiedQuery);

  emit?.({ type: 'status', status: 'Fetching Pelevant Pages' });
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
      const { title, url, content } = metadataSchema.parse(metadata);
      return {
        id,
        score,
        title,
        url,
        content,
      };
    }),
  };
}
