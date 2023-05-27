import { isFullPage } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import notion from '../notion';

export default async function getAllSharedPages() {
  const response = await notion.search({
    filter: {
      value: 'page',
      property: 'object',
    },
  });
  response.results = response.results.filter((result) => (
    result && result.object === 'page' && isFullPage(result)
  ));
  return response.results as PageObjectResponse[];
}
