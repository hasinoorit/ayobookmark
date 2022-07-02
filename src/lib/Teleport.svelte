<script>
  import { onMount } from "svelte"
  export let target = document.body
  let _this
  onMount(() => {
    target.appendChild(_this)
  })
</script>

<div bind:this={_this} {...$$restProps}>
  <slot><span>Content</span></slot>
</div>
