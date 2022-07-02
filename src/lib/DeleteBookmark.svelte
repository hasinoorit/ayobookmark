<script>
  import { createEventDispatcher } from "svelte"
  import db from "./db"
  import Modal from "./Modal.svelte"
  import Icon from "./Icon.svelte"
  import { mdiAlertCircle } from "@mdi/js"

  export let bookmark = {}

  const dispatch = createEventDispatcher()

  const close = () => {
    dispatch("close")
  }

  const deleteBookmark = async () => {
    await db.table("bookmarks").delete(bookmark.id)
    close()
  }
</script>

<Modal title="Delete Bookmark" on:close>
  <div class="row">
    <Icon icon={mdiAlertCircle} size="32px" />
    <div class="col ai-center">Do you want to delete this record?</div>
  </div>
  <div class="ta-right">
    <button class="btn text" on:click|preventDefault={close}>No</button>
    <button class="btn red" on:click|preventDefault={deleteBookmark}>Yes</button>
  </div>
</Modal>
