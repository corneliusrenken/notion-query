<script lang="ts">
  import Answer from '$lib/components/Answer.svelte';
  import QueryInput from '$lib/components/QueryInput.svelte';
  import type { ActionData } from './$types';

  export let form: ActionData;
</script>

<div class="container">
  <QueryInput
    placeholder={form?.userQuery || ''}
  />
  {#if (form)}
    <div>
      {#each form.answers as answer}
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
