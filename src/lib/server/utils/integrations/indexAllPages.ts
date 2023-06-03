import getAllSharedPages from '../notion/getAllSharedPages';
import indexPage from './indexPage';

export default async function indexAllPages() {
  const sharedPages = await getAllSharedPages();
  // for now...
  if (sharedPages.length > 20) throw new Error('Too many pages to index at once');
  await Promise.all(sharedPages.map(({ id }) => indexPage(id)));
}
