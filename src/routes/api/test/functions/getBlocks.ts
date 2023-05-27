import { isFullBlock } from '@notionhq/client';
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import notion from '../notion';

export default async function getBlocks(parentId: string) {
  const response = await notion.blocks.children.list({
    block_id: parentId,
  });
  response.results = response.results.filter((result) => (
    result && result.object === 'block' && isFullBlock(result)
  ));
  return response.results as BlockObjectResponse[];
}
