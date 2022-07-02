<script>
  import { createEventDispatcher } from "svelte"
  import db from "./db"
  import Modal from "./Modal.svelte"
  import Icon from "./Icon.svelte"
  import { mdiAlertCircle } from "@mdi/js"

  export let category = {}

  const dispatch = createEventDispatcher()

  const close = () => {
    dispatch("close")
  }

  const deleteCategory = async () => {
    await db.table("categories").delete(category.id)
    const bookmarsk = await db
      .table("bookmarks")
      .where("category")
      .equals(category.id)
      .sortBy("position")
    const bookmarkKeys = bookmarsk.map((i) => i.id)
    await db.table("bookmarks").bulkDelete(bookmarkKeys)
    close()
  }
</script>

<Modal title="Delete Category" on:close>
  <div class="row">
    <Icon icon={mdiAlertCircle} size="32px" />
    <div class="col ai-center">Do you want to delete this record?</div>
  </div>
  <div class="ta-right">
    <button class="btn text" on:click|preventDefault={close}>No</button>
    <button class="btn red" on:click|preventDefault={deleteCategory}>Yes</button>
  </div>
</Modal>
