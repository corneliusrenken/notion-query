import z from 'zod';
import type { Actions } from './$types';
import getAllSharedPages from '$lib/server/utils/notion/getAllSharedPages';

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const query = z.string().parse(formData.get('query'));

    console.log(`API called with the query: ${query}`);

    const result = await getAllSharedPages();

    return {
      query,
      result,
    };
  },
} satisfies Actions;
