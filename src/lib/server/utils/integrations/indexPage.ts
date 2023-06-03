import type { Vector } from '@pinecone-database/pinecone';
import getPageContent from '../notion/getPageContent';
import createEmbedding from '../openai/createEmbedding';
import getIndex from '../pinecone/getIndex';

/**
 * Creates a vector from a notion page and upserts it into pinecone
 */
export default async function indexPage(pageId: string) {
  const pineconeIndex = await getIndex();
  const { title, content } = await getPageContent(pageId);

  if (content.length === 0) {
    console.log(`No content - Skipping indexing of page ${pageId}`);
    return;
  }

  // todo: need to take OPEN AI TOKEN LIMIT into account here!!!!
  //       if you want to use blocks in the vector instead of a batched page
  //       getPageContent has to include block ids for each content line
  // const batchedPage = [title, ...content].join(' ');
  const batchedPage = [`Title: ${title}.`, 'Content:', ...content].join(' ');

  console.log('batchedPage:\n', batchedPage, '\n');

  const embedding = await createEmbedding(batchedPage);

  const vector: Vector = {
    id: pageId,
    values: embedding,
    metadata: {
      title,
      content,
      // todo: add last changed here to update indices?
    },
  };

  await pineconeIndex.upsert({
    upsertRequest: {
      vectors: [vector],
    },
  });
}
