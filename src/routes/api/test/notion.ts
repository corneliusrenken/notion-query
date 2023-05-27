import { Client } from '@notionhq/client';
import { NOTION_SECRET } from '$env/static/private';

const notion = new Client({ auth: NOTION_SECRET });

export default notion;
