import { z } from 'zod';
import createEmbedding from '../openai/createEmbedding';
import getIndex from '../pinecone/getIndex';

const metadataSchema = z.object({
  title: z.string(),
  content: z.array(z.string()),
});

export default async function getRelevantPages(query: string, pageCount = 3) {
  const index = await getIndex();

  const embedding = await createEmbedding(query);

  const response = await index.query({
    queryRequest: {
      vector: embedding,
      topK: pageCount,
      includeMetadata: true,
    },
  });

  if (response.matches === undefined) throw new Error('No matches found');

  return response.matches.map((match) => {
    const { id, metadata } = match;
    const { title, content } = metadataSchema.parse(metadata);
    return {
      id,
      title,
      content,
    };
  });
}
