import z from 'zod';
import type { Actions } from './$types';

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const query = z.string().parse(formData.get('query'));

    console.log('query:', query);

    return {
      query,
      result: 'hello world',
    };
  },
} satisfies Actions;
