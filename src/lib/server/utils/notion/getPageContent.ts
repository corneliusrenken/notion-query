import { isFullPage } from '@notionhq/client';
import formatAndFlattenBlock from './formatAndFlattenBlock';
import formatPage from './formatPage';
import getBlocks from './getBlocks';
import getPage from './getPage';

export default async function getPageContent(
  pageId: string,
) {
  // todo: broke when having a database and table pages
  const [formattedPage, formattedBlocks] = await Promise.all([
    (async () => {
      const page = await getPage(pageId);
      if (!isFullPage(page)) throw new Error('page is not full page');
      return formatPage(page, { title: true });
    })(),
    (async () => {
      const blocks = await getBlocks(pageId);
      return Promise.all(blocks.map(async (block) => (
        formatAndFlattenBlock(block)
      )));
    })(),
  ]);

  const content: string[] = [];

  formattedBlocks.forEach((formattedBlock) => {
    if ('content' in formattedBlock) {
      content.push(...formattedBlock.content);
    }
  });

  return {
    id: pageId,
    title: formattedPage.title,
    content,
  };
}
