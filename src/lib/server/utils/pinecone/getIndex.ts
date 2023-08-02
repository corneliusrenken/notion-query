import pinecone, { indexName } from '.';

export default async function getIndex() {
  const indices = await pinecone.listIndexes();
  if (!indices.includes(indexName)) throw new Error(`Index with name '${indexName}' doesn't exist!`);

  return pinecone.Index(indexName);
}
