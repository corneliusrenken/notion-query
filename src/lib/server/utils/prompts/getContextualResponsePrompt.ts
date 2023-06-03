/* eslint-disable max-len */

import type getRelevantPages from '../integrations/getRelevantPages';

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export default function getContextualResponsePrompt(
  query: string,
  pages: UnwrapPromise<ReturnType<typeof getRelevantPages>>['pages'],
) {
  return `Please find any answers to this query using only the provided context. Format the answer(s) as a json array of objects with the following shape: { answer: string, references: { id: string, title: string }[] }. If you can not find any answer, return an empty array. For the answer strings, try to be concise and pertain to the query. An answer without at least one reference is invalid, as the answers should only be answered using the provided context. Here's the query: ${query}. Here's the context: ${JSON.stringify(pages.map(({ id, title, content }) => ({ id, title, content })))}`;
}
