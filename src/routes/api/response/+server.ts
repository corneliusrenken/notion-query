import { error, json } from '@sveltejs/kit';
import getContextualResponse from '$lib/server/utils/integrations/getContextualResponse';
import type { RequestHandler } from './$types';

export const GET = (async ({ url }) => {
  const query = url.searchParams.get('query');

  if (!query) throw error(400, 'Missing query parameter');

  // to reindex all pages:
  // await createIndex(); (only do this if pinecone deleted the index)
  // await deleteAllIndices();
  // await indexAllPages();

  const {
    answers,
    finalPrompt,
    userQuery,
    vectorQuery,
    pages,
  } = await getContextualResponse(query, 5);

  const data = {
    answers,
    finalPrompt,
    userQuery,
    vectorQuery,
    pages: pages.map(({ id, title, score }) => ({ id, title, score })),
  };

  return json(data);
}) satisfies RequestHandler;
