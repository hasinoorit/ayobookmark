<script>
  // @ts-nocheck

  import { createEventDispatcher } from "svelte"
  import { liveQuery } from "dexie"
  import Modal from "./Modal.svelte"
  import db from "./db"
  export let bookmark = {}
  let localUpdate = { ...bookmark }
  $: categories = liveQuery(async () => {
    return await db.table("categories").toArray()
  })

  const dispatch = createEventDispatcher()

  const updateBookmark = async () => {
    if (bookmark.category != localUpdate.category) {
      const totalBookmark = await db.table("bookmarks").toArray()
      localUpdate.position = totalBookmark.length
    }
    await db.table("bookmarks").put(localUpdate)
    dispatch("close")
  }
</script>

<Modal title="Update bookmark" on:close>
  <form on:submit|preventDefault={updateBookmark}>
    <label for="new-bookmark-category">Category</label>
    <select bind:value={localUpdate.category} class="input">
      {#if $categories}
        {#each $categories as category}
          <option value={category.id}>
            {category.title}
          </option>
        {/each}
      {/if}
    </select>
    <label for="new-bookmark-name">Name</label>
    <input
      type="text"
      id="new-bookmark-name"
      bind:value={localUpdate.title}
      class="input"
    />
    <label for="new-bookmark-url">URL</label>
    <input
      type="text"
      id="new-bookmark-name"
      bind:value={localUpdate.url}
      class="input"
    />
    <div class="ta-right mt-3">
      <button
        class="btn text"
        type="button"
        on:click|preventDefault|stopPropagation={() => dispatch("close")}>Cancel</button
      >
      <button class="btn green">Save</button>
    </div>
  </form>
</Modal>
