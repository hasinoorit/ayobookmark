<script>
  import { createEventDispatcher } from "svelte"
  import Modal from "./Modal.svelte"
  import db from "./db"
  const dispatch = createEventDispatcher()

  let newCategoryName = ""
  const addCategory = async () => {
    const allCategory = await db.table("categories").toArray()
    await db
      .table("categories")
      .add({ title: newCategoryName, position: allCategory.length })
    newCategoryName = ""
    dispatch("close")
  }
</script>

<Modal title="Add Category" on:close>
  <form on:submit|preventDefault={addCategory}>
    <label for="new-category-name">Name</label>
    <input
      type="text"
      id="new-category-name"
      bind:value={newCategoryName}
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
