import type { Vector } from '@pinecone-database/pinecone';
import getPageContent from '../notion/getPageContent';
import createEmbedding from '../openai/createEmbedding';
import getIndex from '../pinecone/getIndex';
import paginatePages from './paginatePages';

/**
 * Creates a vector from a notion page and upserts it into pinecone
 */
export default async function indexPage(pageId: string) {
  const pineconeIndex = await getIndex();
  const { title, url, content } = await getPageContent(pageId);

  if (content.length === 0) {
    // console.log(`No content - Skipping indexing of page ${pageId}`);
    return;
  }

  // ada token limit: 2,049
  const paginatedPages = paginatePages([{
    id: pageId,
    title,
    url,
    content,
  }], 2049);

  await Promise.all(paginatedPages.map(async (paginatedPage, index) => {
    const embedding = await createEmbedding(paginatedPage);

    const idAppend = paginatedPages.length > 1 ? `(${index + 1}/${paginatePages.length})` : '';

    const vector: Vector = {
      id: pageId + idAppend,
      values: embedding,
      metadata: {
        pageId,
        title,
        content: paginatedPage,
        url,
        // todo: add last changed here to update indices?
      },
    };

    await pineconeIndex.upsert({
      upsertRequest: {
        vectors: [vector],
      },
    });
  }));
}
