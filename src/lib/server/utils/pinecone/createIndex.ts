import pinecone, { indexName } from '.';
import createEmbedding from '../openai/createEmbedding';

export default async function createIndex() {
  const indices = await pinecone.listIndexes();

  if (indices.includes(indexName)) throw new Error(`Index with name '${indexName}' already exists!`);

  const sampleEmbedding = await createEmbedding('Hello world!');

  await pinecone.createIndex({
    createRequest: {
      name: indexName,
      dimension: sampleEmbedding.length,
      metric: 'cosine',
    },
  });
}
