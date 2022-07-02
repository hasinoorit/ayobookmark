<script>
  // @ts-nocheck

  import { createEventDispatcher } from "svelte"
  import Modal from "./Modal.svelte"
  import db from "./db"
  export let category = {}
  let localUpdate = { ...category }

  const dispatch = createEventDispatcher()

  const updateCategory = async () => {
    await db.table("categories").put(localUpdate)
    dispatch("close")
  }
</script>

<Modal title="Update category" on:close>
  <form on:submit|preventDefault={updateCategory}>
    <label for="new-category-name">Name</label>
    <input
      type="text"
      id="new-category-name"
      bind:value={localUpdate.title}
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
