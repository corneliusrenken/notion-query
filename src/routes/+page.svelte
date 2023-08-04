<script lang="ts">
  import Answer from '$lib/components/Answer.svelte';
  import type { Answer as AnswerType } from '$lib/server/utils/integrations/getContextualResponse';
  import QueryInput from '$lib/components/QueryInput.svelte';
  import QueryStatus from '$lib/components/QueryStatus.svelte';
  import type { StreamEvent } from './api/response/+server';

  let answers: AnswerType[] | null = null;
  let status = '';

  let shake: () => void;

  const runQuery = async (query: string) => {
    answers = null;

    await new Promise<void>((resolve) => {
      const eventSource = new EventSource(`/api/response?query=${query}`);

      eventSource.onmessage = (e) => {
        const response = JSON.parse(e.data) as StreamEvent;
        if (response.type === 'status') {
          status = response.status;
        } else {
          if (response.response.answers.length !== 0) {
            if (answers === null) {
              answers = [];
            }

            answers.push(...response.response.answers);
          }

          if (response.final) {
            if (answers === null || answers.length === 0) {
              shake();
            }

            status = '';
            eventSource.close();
            resolve();
          }
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
  {#if answers !== null}
    {#if answers.length === 0}
      <Answer answer={{ answer: 'Unable to generate any relevant answers', references: [] }} style="font-style:italic;" />
    {/if}
    <div>
      {#each answers as answer}
        <Answer answer={answer} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .container {
    width: var(--app-width);
    margin: 0 var(--margin-horiz-app);
  }
</style>
