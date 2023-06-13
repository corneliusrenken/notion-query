<script lang="ts">
    import { enhance } from '$app/forms';
  import AnimatedBorder from './AnimatedBorder.svelte';
  import Icon from './Icon.svelte';

  export let placeholder = '';
  export let querying = false;

  let form: HTMLFormElement;
  let shakeTimeout: ReturnType<typeof setTimeout>;

  function shake() {
    if (shakeTimeout) clearTimeout(shakeTimeout);

    if (!form) return;

    const duration = 250;
    form.style.animation = '';
    // trigger reflow
    form.offsetHeight; // eslint-disable-line @typescript-eslint/no-unused-expressions
    form.style.animation = `shake ${duration}ms ease-out forwards`;
    shakeTimeout = setTimeout(() => {
      form.style.animation = '';
    }, duration);
  }
</script>

<form
  bind:this={form}
  class={`
    query-bar
    ${querying ? 'disabled' : ''}
  `}
  method="POST"
  use:enhance={({ formData, cancel }) => {
    if (formData.get('query') === '' || querying) {
      shake();
      cancel();
      return undefined;
    }

    querying = true;
    return async ({ update }) => {
      querying = false;
      update();
    };
  }}
>
  {#if querying}
    <AnimatedBorder />
  {/if}
  <div class="query-icon"><Icon path="query" /></div>
  <input
    class="font-main"
    placeholder={placeholder || 'Query your Notion'}
    disabled={querying}
    name="query"
    type="text"
  />
</form>

<style>
  @keyframes -global-shake {
    0% {
      transform: translateX(0) translateY(0);
    }
    25% {
      transform: translateX(-4px) translateY(-2px);
    }
    50% {
      transform: translateX(2px) translateY(1px);
    }
    75% {
      transform: translateX(-1px) translateY(0);
    }
    100% {
      transform: translateX(0) translateY(0);
    }
  }

  .query-bar {
    position: relative;
    margin-top: var(--margin-vert-header);
    height: 40px;
    border-radius: 20px;
    width: 100%;
  }

  .query-icon {
    position: absolute;
    height: 100%;
    left: var(--spacing-horiz-main);
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .disabled .query-icon {
    color: var(--font-tertiary);
  }

  input {
    background-color: var(--secondary);
    border: none;
    height: 100%;
    width: 100%;
    border-radius: inherit;
    padding: 0 var(--spacing-horiz-main);
    /* eyeballed to leave space between icon and text*/
    padding-left: calc(15px + 1.7 * var(--spacing-horiz-main));
  }

  input::placeholder {
    color: var(--font-secondary);
  }

  input:disabled,
  input:disabled::placeholder {
    color: var(--font-tertiary);
  }
</style>
