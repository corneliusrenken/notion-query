<script lang="ts">
  import { onMount } from 'svelte';
  import { linear } from 'svelte/easing';
  import { tweened } from 'svelte/motion';

  // eyeballed these two so that it's a continuous loop
  const length = 150;
  const gap = 1090;

  const duration = 2500;
  const startingProgress = Math.random();

  const progress = tweened(startingProgress, {
    duration,
    easing: linear,
  });

  onMount(() => {
    progress.set(1, { duration: duration * (1 - startingProgress) });
  });

  $: {
    if ($progress === 1) {
      progress.set(0, { duration: 0 });
      progress.set(1);
    }
  }

  let rect: SVGRectElement;
</script>

<svg>
  <rect
    x="0.5"
    y="0.5"
    rx="20"
    ry="20"
    fill="none"
    stroke-width="1"
    stroke-dasharray="{length} {gap}"
    stroke-dashoffset={(length + gap) * -$progress}
    bind:this={rect}
  />
</svg>

<style>
  @keyframes fade-in {
    0% {
      stroke: transparent;
    }

    100% {
      stroke: black;
    }
  }

  svg {
    position: absolute;
    inset: 0;
    animation: fade-in 1s ease-out forwards;
    width: 100%;
    height: 100%;
  }

  rect {
    height: calc(100% - 1px);
    width: calc(100% - 1px);
  }
</style>
