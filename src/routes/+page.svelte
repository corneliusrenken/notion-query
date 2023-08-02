<script lang="ts">
  import Answer from '$lib/components/Answer.svelte';
  import QueryInput from '$lib/components/QueryInput.svelte';
  import type getContextualResponse from '$lib/server/utils/integrations/getContextualResponse';

  type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
  type ResponseType = UnwrapPromise<ReturnType<typeof getContextualResponse>>;

  let data: ResponseType | null = null;
</script>

<div class="container">
  <QueryInput
    runQuery={async (query) => {
      const res = await fetch(`/api/response?query=${query}`);
      const json = await res.json();
      console.log('data:\n', json);
      data = json;
    }}
  />
  {#if (data)}
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
