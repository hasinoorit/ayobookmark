<script>
  // @ts-nocheck
  import { createEventDispatcher } from "svelte"
  import db from "./db"
  import Modal from "./Modal.svelte"
  export let colorTheme = "auto"
  const dispatch = createEventDispatcher()
  const downloadBackup = async () => {
    const categories = await db.table("categories").toArray()
    const bookmarks = await db.table("bookmarks").toArray()
    const backup = { categories, bookmarks }
    const jsonStr = JSON.stringify(backup)
    let element = document.createElement("a")
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(jsonStr)
    )
    element.setAttribute("download", "AyoBookmarksBackup.json")
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    dispatch("close")
  }
  const onChange = (event) => {
    var reader = new FileReader()
    reader.onload = onReaderLoad
    reader.readAsText(event.target.files[0])
  }

  const onReaderLoad = async (event) => {
    const backup = JSON.parse(event.target.result)
    await db.table("categories").bulkPut(backup.categories)
    await db.table("bookmarks").bulkPut(backup.bookmarks)
    dispatch("close")
  }
</script>

<Modal title="Manage Bookmarks" on:close>
  <label class="theme">
    <span>Theme</span>
    <select bind:value={colorTheme} class="input">
      <option value="auto">Auto</option>
      <option value="dark">Dark</option>
      <option value="light">light</option>
    </select>
  </label>
  <label class="file mt-4">
    <input
      type="file"
      id="file"
      aria-label="File browser example"
      on:change={onChange}
    />
    <span class="file-custom" />
  </label>
  <h4 class="ta-center my-3">Or</h4>
  <button class="btn-export" on:click|preventDefault={downloadBackup}
    >Download backup file</button
  >
</Modal>
