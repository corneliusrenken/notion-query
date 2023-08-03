<script lang="ts">
  import Answer from '$lib/components/Answer.svelte';
  import QueryInput from '$lib/components/QueryInput.svelte';
  import QueryStatus from '$lib/components/QueryStatus.svelte';
  import type getContextualResponse from '$lib/server/utils/integrations/getContextualResponse';
  import type UnwrapPromise from '$lib/utils/UnwrapPromise';
  import type { StreamEvent } from './api/response/+server';

  type ResponseType = UnwrapPromise<ReturnType<typeof getContextualResponse>>;

  let data: ResponseType | null = null;
  let status = '';

  let shake: () => void;

  const runQuery = async (query: string) => {
    await new Promise<void>((resolve) => {
      const eventSource = new EventSource(`/api/response?query=${query}`);

      eventSource.onmessage = (e) => {
        const foo = JSON.parse(e.data) as StreamEvent;
        if (foo.type === 'status') {
          status = foo.status;
        } else {
          status = '';
          data = foo.response;

          if (data.answers.length === 0) {
            shake();
          }

          eventSource.close();
          resolve();
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        resolve();
        throw new Error('EventSource failed.');
      };
    });
  };
</script>

<div class="container">
  <QueryStatus status={status} />
  <QueryInput runQuery={runQuery} bind:shake={shake} />
  {#if data}
    {#if data.answers.length === 0}
      <Answer answer={{ answer: 'Unable to generate any relevant answers', references: [] }} style="font-style:italic;" />
    {/if}
    <div>
      {#each data.answers as answer}
        <Answer answer={answer} />
      {/each}
    </div>
    <!-- <h4>
      Pages used as context:
    </h4>
    <ul>
      {#each form.pages as { title, score }}
        <li>
          {title} (score: {score})
        </li>
      {/each}
    </ul>
    <h4>
      Vector Prompt:
    </h4>
    <code>
      {form.vectorQuery}
    </code>
    <h4>
      Answer Prompt:
    </h4>
    <code>
      {form.finalPrompt}
    </code> -->
  {/if}
</div>

<style>
  .container {
    width: var(--app-width);
    margin: 0 var(--margin-horiz-app);
  }
</style>
