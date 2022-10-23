<script>
  import { onMount, createEventDispatcher } from "svelte"
  let _this
  const dispatch = createEventDispatcher()
  // const setPosition = () => {
  //   if (_this) {
  //     _this.style.top = (innerHeight - _this.clientHeight) / 2 + "px"
  //     _this.style.left = (innerWidth - _this.clientWidth) / 2 + "px"
  //   }
  // }
  onMount(() => {
    document.body.appendChild(_this)
    // setPosition()
  })
  export let title = "Modal"
  const close = () => {
    dispatch("close")
  }
</script>

<div class="ayo-modal-backdrop" bind:this={_this}>
  <div {...$$restProps} class="ayo-modal">
    <div class="modal-header">
      <slot name="header">
        <div class="row p-3">
          <div class="col ai-center pl-1"><b class="modal-title">{title}</b></div>
          <div class="col-auto">
            <button on:click={close} class="close-btn">&times;</button>
          </div>
        </div>
      </slot>
    </div>
    <div class="modal-body"><slot><span>Modal body</span></slot></div>
    {#if $$slots.footer}
      <div class="modal-footer"><slot name="footer" /></div>
    {/if}
  </div>
</div>

<style>
  .ayo-modal-backdrop {
    position: fixed;
    background: rgba(0, 0, 0, 0.37);
    backdrop-filter: blur(3px);
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: var(--text);
  }
  .ayo-modal {
    position: fixed;
    max-width: calc(100% - 1rem);
    width: 400px;
    background: var(--bg);
    backdrop-filter: blur(3px);
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    border: 0 none;
  }
  .modal-body {
    padding: 0 1rem 1rem 1rem;
  }
  .modal-title {
    font-size: 130%;
  }
  .close-btn {
    font-size: 1.5rem;
    border-radius: 3rem;
    color: gray;
    border: none;
    background: transparent;
    cursor: pointer;
    height: 2rem;
    aspect-ratio: 1 / 1;
    transition: all 0.3s linear;
  }
  .close-btn:hover {
    color: red;
    background: rgba(128, 128, 128, 0.284);
  }
</style>
