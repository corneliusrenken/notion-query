import { PineconeClient } from '@pinecone-database/pinecone';
import { PINECONE_ENVIRONMENT, PINECONE_SECRET } from '$env/static/private';

const pinecone = new PineconeClient();

await pinecone.init({
  environment: PINECONE_ENVIRONMENT,
  apiKey: PINECONE_SECRET,
});

export default pinecone;

export const indexName = 'test-index';
