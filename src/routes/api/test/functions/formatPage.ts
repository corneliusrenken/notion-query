import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { z } from 'zod';

type PageFormat = {
  id: string;
  title: string;
  url: string;
  parentId: string;
};

type PageFormatWhitelist = {
  [K in keyof PageFormat]: true;
};

export default function formatPage<T extends Partial<PageFormatWhitelist>>(
  page: PageObjectResponse,
  format: T,
): Pick<PageFormat, keyof T & keyof PageFormat> {
  const {
    id,
    url,
    properties,
    parent,
  } = page;

  const title = (
    properties.title
    && properties.title.type === 'title'
    && properties.title.title[0].type === 'text'
    && properties.title.title[0].text.content
  );

  const parentId = (
    parent.type === 'page_id'
    && parent.page_id
  );

  return {
    ...(format.id && { id: z.string().parse(id) }),
    ...(format.title && { title: z.string().parse(title) }),
    ...(format.url && { url: z.string().parse(url) }),
    ...(format.parentId && { parentId: z.string().parse(parentId) }),
  } as Pick<PageFormat, keyof T & keyof PageFormat>;
}
