import { isFullPage } from '@notionhq/client';
import formatAndFlattenBlock from './formatAndFlattenBlock';
import formatPage from './formatPage';
import getBlocks from './getBlocks';
import getPage from './getPage';

export default async function getCompletePageContent(
  pageId: string,
) {
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

  const childPages: { id: string, title: string }[] = [];
  const content: string[] = [];

  formattedBlocks.forEach((formattedBlock) => {
    if (formattedBlock.type === 'child_page') {
      childPages.push({ id: formattedBlock.id, title: formattedBlock.childPageTitle });
    } else if ('content' in formattedBlock) {
      content.push(...formattedBlock.content);
    }
  });

  return {
    id: pageId,
    title: formattedPage.title,
    content,
    childPages,
  };
}
