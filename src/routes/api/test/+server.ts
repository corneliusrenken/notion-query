import { type RequestHandler, json } from '@sveltejs/kit';
import getAllSharedPages from './functions/getAllSharedPages';
import getCompletePageContent from './functions/getCompletePageContent';
import formatError from '../utils/formatError';

export const GET = (async () => {
  try {
    const pages = (await getAllSharedPages());
    const formattedPages = await Promise.all(pages.map(({ id }) => getCompletePageContent(id)));
    return json(formattedPages);
  } catch (e) {
    throw formatError(e);
  }
}) satisfies RequestHandler<{ pageId: string }>;
