<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  export let form: ActionData;
  // todo: placeholder flashes for a frame after receiving result
  let placeholder = '';
  $: placeholder = form?.userQuery ? form.userQuery : '';

  $: if (form) {
    console.log('form:', form);
  }

  let awaiting = false;
</script>

<div>
  <form
    method="POST"
    use:enhance={({ formData, cancel }) => {
      if (formData.get('query') === '') {
        cancel();
      }
      awaiting = true;
      return async ({ update }) => {
        awaiting = false;
        update();
      };
    }}
  >
    <label>
      Query
      <input
        name="query"
        type="text"
        placeholder={placeholder}
        disabled={awaiting}
      />
      <!-- <input
        name="pageCount"
        type="number"
        value="5"
        min="1"
        max="10"
        disabled={awaiting}
      />  -->
    </label>
  </form>
  {#if (form)}
    <h3>
      Responses:
    </h3>
    <ul>
      {#each form.answers as { answer, references }}
        <li>
          {answer} ({references.map(({ title }) => title).join(', ')})
        </li>
      {/each}
    </ul>
    <h4>
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
    </code>
  {/if}
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 10vh 25vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  label {
    width: 50vw;
    display: flex;
    gap: 1rem;
  }

  input {
    flex: 1;
  }

  /* input[type='number'] {
    width: 2rem;
    flex: none;
  } */
</style>
