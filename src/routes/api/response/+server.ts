import { error } from '@sveltejs/kit';
import getContextualResponse, { type Answer } from '$lib/server/utils/integrations/getContextualResponse';
import type { RequestHandler } from './$types';
import type UnwrapPromise from '$lib/utils/UnwrapPromise';
import type getRelevantPages from '$lib/server/utils/integrations/getRelevantPages';
import createIndex from '$lib/server/utils/pinecone/createIndex';
import deleteAllIndices from '$lib/server/utils/pinecone/deleteAllIndices';
import indexAllPages from '$lib/server/utils/integrations/indexAllPages';

export type StreamEvent = {
  type: 'status',
  status: string,
} | {
  type: 'response',
  response: {
    answers: Answer[],
    pages: UnwrapPromise<ReturnType<typeof getRelevantPages>>['pages'],
    finalPrompt: string,
    userQuery: string,
    vectorQuery: string,
  },
  final: boolean,
};

async function reindexAllPages(
  emit: (event: StreamEvent) => void,
  createDatabaseIndex = false,
) {
  if (createDatabaseIndex) {
    emit({ type: 'status', status: 'Reindexing Pages' });
    await createIndex(); // (only do this if pinecone deleted the index)
  }
  emit({ type: 'status', status: 'Deleting old indices' });
  await deleteAllIndices();
  emit({ type: 'status', status: 'Indexing all pages' });
  await indexAllPages();
}

export const GET = (async ({ url }) => {
  const query = url.searchParams.get('query');

  if (!query) throw error(400, 'Missing Query Parameter');

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event: StreamEvent) => {
        controller.enqueue(`data: ${JSON.stringify(event)}\n\n`);
        if (event.type === 'response' && event.final) controller.close();
      };

      // await reindexAllPages(emit);

      // function below emits the final response
      await getContextualResponse(query, 5, emit);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}) satisfies RequestHandler;
