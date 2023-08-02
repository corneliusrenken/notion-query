import z from 'zod';
import type { Actions } from './$types';
import getContextualResponse from '$lib/server/utils/integrations/getContextualResponse';

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const query = z.string().parse(formData.get('query'));

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

    return {
      answers,
      finalPrompt,
      userQuery,
      vectorQuery,
      pages: pages.map(({ id, title, score }) => ({ id, title, score })),
    };
  },
} satisfies Actions;
