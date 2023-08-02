<script lang="ts">
  export let status: string;
</script>

{#if status}
  <div class="query-status font-link">{status}</div>
{/if}

<style>
  .query-status {
    text-decoration: none;
    position: absolute;
    bottom: calc(100% - var(--margin-vert-header) + var(--spacing-vert-small));
    right: calc(var(--margin-horiz-app) + var(--spacing-horiz-main) / 2);
    text-transform: capitalize;
  }
</style>
