<script lang="ts">
  import type * as icon from '$lib/iconPaths';
  import * as iconPaths from '$lib/iconPaths';

  export let path: keyof typeof icon;
</script>

<svg
  width="15"
  height="15"
  viewBox="0 0 15 15"
  fill="none"
  fill-rule="evenodd"
  xmlns="http://www.w3.org/2000/svg"
  >
    <path d={iconPaths[path]} fill="currentColor" clip-rule="evenodd" />
</svg>

<style>
  svg {
    position: relative; /* for correct z index */
    user-select: none;
    pointer-events: none;
  }
</style>
