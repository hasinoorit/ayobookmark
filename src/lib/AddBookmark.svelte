<script>
  import { createEventDispatcher } from "svelte"
  import { liveQuery } from "dexie"
  import Modal from "./Modal.svelte"
  import db from "./db"
  export let selectedCategory = 1
  $: categories = liveQuery(async () => {
    const cat = await db.table("categories").toArray()
    selectedCategory = cat.length === 0 ? 0 : cat[0].id
    return cat
  })

  const dispatch = createEventDispatcher()
  let newBookmark = { category: selectedCategory, url: "", title: "", icon: "" }

  const addBookmark = async () => {
    const totalBookmark = await db
      .table("bookmarks")
      .where("category")
      .equals(newBookmark.category)
      .reverse()
      .sortBy("position")
    const position = totalBookmark[0] ? totalBookmark[0].position + 1 : 1
    await db.table("bookmarks").add({ ...newBookmark, position })
    newBookmark = { category: 0, url: "", title: "", icon: "" }
    dispatch("close")
  }
</script>

<Modal title="Add new bookmark" on:close>
  <form on:submit|preventDefault={addBookmark}>
    <label for="new-bookmark-category">Category</label>
    <select bind:value={newBookmark.category} class="input" required>
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
      bind:value={newBookmark.title}
      class="input"
      required
    />
    <label for="new-bookmark-url">URL</label>
    <input
      type="url"
      id="new-bookmark-name"
      bind:value={newBookmark.url}
      class="input"
      required
    />
    <div class="ta-right mt-3">
      <button
        class="btn text"
        type="button"
        on:click|preventDefault|stopPropagation={() => dispatch("close")}>Cancel</button
      >
      <button class="btn green">Add</button>
    </div>
  </form>
</Modal>
