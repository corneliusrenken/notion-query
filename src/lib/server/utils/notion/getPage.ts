import notion from '.';

export default function getPage(id: string) {
  return notion.pages.retrieve({ page_id: id });
}
