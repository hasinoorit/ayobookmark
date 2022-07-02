<script>
  import ListCategory from "./lib/ListCategory.svelte"
  import ListBookmark from "./lib/ListBookmark.svelte"
  import Icon from "./lib/Icon.svelte"
  import Settings from "./lib/Settings.svelte"
  import { mdiCog } from "@mdi/js"
  let selectedCategory = 0
  let currentDragParent = null
  let showSettingModal = false
  const toggleSettings = () => {
    showSettingModal = !showSettingModal
  }
</script>

<main class="container">
  <ListCategory bind:selectedCategory bind:currentDragParent />
  <ListBookmark bind:selectedCategory bind:currentDragParent />
  <button class="menu-btn" on:click|preventDefault={toggleSettings}
    ><Icon icon={mdiCog} size="2rem" /></button
  >
  {#if showSettingModal}
    <Settings on:close={toggleSettings} />
  {/if}
</main>
