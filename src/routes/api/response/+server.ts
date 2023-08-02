import { error } from '@sveltejs/kit';
import getContextualResponse from '$lib/server/utils/integrations/getContextualResponse';
import type { RequestHandler } from './$types';

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export type StreamEvent = {
  type: 'status',
  status: string,
} | {
  type: 'response',
  response: UnwrapPromise<ReturnType<typeof getContextualResponse>>,
};

export const GET = (async ({ url }) => {
  // to reindex all pages:
  // await createIndex(); // (only do this if pinecone deleted the index)
  // await deleteAllIndices();
  // await indexAllPages();

  const query = url.searchParams.get('query');

  if (!query) throw error(400, 'Missing Query Parameter');

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event: StreamEvent) => {
        controller.enqueue(`data: ${JSON.stringify(event)}\n\n`);
        if (event.type === 'response') controller.close();
      };

      const response = await getContextualResponse(query, 5, emit);
      emit({ type: 'response', response });
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
