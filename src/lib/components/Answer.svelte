<script lang="ts">
  import type { Answer } from '$lib/server/utils/integrations/getContextualResponse';

  export let answer: Answer;
</script>

<div class="answer">
  <div class="font-main">{answer.answer}</div>
  <div class="references">
    {#each answer.references as { title, url }, index}
      <a class="font-link" href={url} target="_blank">{title}</a>
      {#if index !== answer.references.length - 1}
        <div class="font-link separator">&nbsp;</div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .answer {
    margin: 0 var(--spacing-horiz-main);
    margin-top: var(--spacing-vert-main);
  }

  .answer:last-of-type {
    margin-bottom: var(--spacing-vert-main);
  }

  .references {
    margin-top: var(--spacing-vert-small);
    /* to remove unwanted spacing between a and separator elements */
    font-size: 0px;
  }

  .separator {
    display: inline;
    text-decoration: none;
    cursor: default;
  }
</style>
