<script>
  import { tick } from "svelte"
  let show = false
  let ctx
  const clickoutside = (ev) => {
    if (ctx && (ev.target.isSameNode(ctx) || !ctx.contains(ev.target))) {
      window.removeEventListener("pointerdown", clickoutside)
      show = false
    }
  }
  export const close = () => {
    show = false
  }
  export const open = async (ev) => {
    ev.preventDefault()
    show = true
    await tick()
    if (ev.y + ctx.clientHeight < innerHeight) {
      ctx.style.top = ev.pageY + "px"
    } else {
      ctx.style.top = ev.pageY - ctx.clientHeight + "px"
    }
    if (ev.x + ctx.clientWidth < innerWidth) {
      ctx.style.left = ev.pageX + "px"
    } else {
      ctx.style.left = ev.pageX - ctx.clientWidth + "px"
    }
    document.body.appendChild(ctx)
    window.addEventListener("pointerdown", clickoutside)
  }
</script>

{#if show}
  <div bind:this={ctx} class="ctx-menu">
    <slot />
  </div>
{/if}

<style>
  .ctx-menu {
    position: absolute;
  }
</style>
