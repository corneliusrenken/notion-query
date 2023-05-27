import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { z } from 'zod';
import getBlocks from './getBlocks';

/**
 * for nested blocks, the content array will contain the content of all child blocks
 */
export default async function formatAndFlattenBlock(block: BlockObjectResponse): Promise<(
  {
    id: string;
    type: 'child_page';
    childPageTitle: string;
  } | {
    id: string;
    type: Exclude<BlockObjectResponse['type'], 'child_page'>;
    content: string[];
  } | Record<string, never>
)> {
  const { id, type } = block;

  if (type === 'child_page') {
    return {
      id,
      type,
      childPageTitle: block.child_page.title,
    };
  }

  const content: string[] = [];

  const parsed = z.object({
    [type]: z.object({
      rich_text: z.array(z.object({
        plain_text: z.string(),
      })),
    }),
  }).safeParse(block);

  if (!parsed.success) {
    console.error(`Failed to parse block of type: ${type}`);
    return {};
  }

  content.push(...parsed.data[type].rich_text.map(({ plain_text }) => plain_text));

  if (type === 'toggle' || type === 'bulleted_list_item' || type === 'numbered_list_item') {
    const childBlocks = await getBlocks(id);
    const formattedChildren = await Promise.all(childBlocks.map(formatAndFlattenBlock));
    formattedChildren.forEach((formattedChild) => {
      if ('content' in formattedChild) content.push(...formattedChild.content);
    });
  }

  return {
    id,
    type,
    content,
  };
}
