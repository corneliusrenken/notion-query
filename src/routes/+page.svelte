<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  export let form: ActionData;
  // todo: placeholder flashes for a frame after receiving result
  let placeholder = '';
  $: placeholder = form?.query ? form.query : '';

  let awaiting = false;
</script>

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
  </label>
</form>

<style>
  :global(body) {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: min(100vh, 500px);
  }

  label {
    width: 50vw;
    display: flex;
    gap: 1rem;
  }

  input {
    flex: 1;
  }
</style>
