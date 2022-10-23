<script>
  import { liveQuery } from "dexie"
  import { flip } from "svelte/animate"
  import { quintOut } from "svelte/easing"
  import AddBookmark from "./AddBookmark.svelte"
  import ContextMenu from "./ContextMenu.svelte"
  import UpdateBookmark from "./UpdateBookmark.svelte"
  import DeleteBookmark from "./DeleteBookmark.svelte"
  import Icon from "./Icon.svelte"
  import { mdiDelete, mdiDotsHorizontal, mdiBookEdit, mdiPlusCircle } from "@mdi/js"
  import db from "./db"

  export let selectedCategory = 0
  export let currentDragParent = null

  let selectedBookmark = {}

  let ctxEl
  let _this
  let showAddUrlModal = false
  let showDeleteModal = false
  let showUpdateModal = false
  $: bookmarks = liveQuery(async () => {
    return await db
      .table("bookmarks")
      .where("category")
      .equals(selectedCategory)
      .sortBy("position")
  })
  const toggleAddUrlModal = () => {
    showAddUrlModal = !showAddUrlModal
  }
  let hovering = -1

  const drop = async (event, target) => {
    if (event.currentTarget.parentElement.isSameNode(currentDragParent)) {
      event.dataTransfer.effectAllowed = "move"
      event.dataTransfer.dropEffect = "move"
      const start = parseInt(event.dataTransfer.getData("text/plain"))
      const newTracklist = $bookmarks

      if (start < target) {
        newTracklist.splice(target, 0, newTracklist[start])
        newTracklist.splice(start, 1)
      } else {
        newTracklist.splice(target - 1, 0, newTracklist[start])
        newTracklist.splice(start + 1, 1)
      }
      hovering = null
      let pos = 0
      const updatedList = newTracklist.map((item) => {
        return { ...item, position: ++pos }
      })
      db.table("bookmarks")
        .bulkPut(updatedList)
        .catch((err) => console.log(err))
    }
  }
  const dragstart = (event, i) => {
    currentDragParent = _this
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.dropEffect = "move"
    const start = i - 1
    event.dataTransfer.setData("text/plain", start)
  }
</script>

<div bind:this={_this} class="container row cols-2 cols-md-3 cols-lg-4 cols-xl-5">
  {#if $bookmarks}
    {#each $bookmarks as bookmark (bookmark.id)}
      <div
        class="bookmark"
        animate:flip={{ delay: 0, duration: 1050, easing: quintOut }}
        draggable={true}
        on:dragstart={(event) => dragstart(event, bookmark.position)}
        on:drop|preventDefault={(event) => drop(event, bookmark.position)}
        on:dragover|preventDefault
        on:dragenter|stopPropagation|capture={(event) => {
          // @ts-ignore
          if (currentDragParent.isSameNode(_this)) {
            hovering = bookmark.position
          }
        }}
        on:dragleave={(e) => {
          // @ts-ignore
          if (!e.currentTarget.contains(e.relatedTarget)) {
            hovering = -1
          }
        }}
        class:is-active={hovering === bookmark.position}
      >
        <a href={bookmark.url} draggable="false">
          <div class="favicon" draggable="false">
            {#if bookmark.icon}
              <img src={bookmark.icon} alt="" draggable="false" />
            {:else}
              <img
                draggable="false"
                src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${bookmark.url}&size=16`}
                alt=""
              />
            {/if}
          </div>
          <span class="ml-2">{bookmark.title}</span>
        </a>
        <button
          class="menu"
          on:click|preventDefault|stopPropagation={(ev) => {
            selectedBookmark = bookmark
            ctxEl.open(ev)
          }}><Icon icon={mdiDotsHorizontal} size="24px" /></button
        >
      </div>
    {/each}
  {/if}
  <button on:click={toggleAddUrlModal} class="bookmark add-new" style:gap="0"
    ><Icon icon={mdiPlusCircle} size="22px" />Add Bookmark</button
  >
  {#if showAddUrlModal}
    <AddBookmark on:close={toggleAddUrlModal} {selectedCategory} />
  {/if}
  <ContextMenu bind:this={ctxEl}>
    <ul>
      <li
        tabindex="0"
        on:click={() => {
          showUpdateModal = true
          ctxEl.close()
        }}
      >
        <Icon icon={mdiBookEdit} size="20px" /><span class="ml-2">Update</span>
      </li>
      <li
        tabindex="0"
        on:click={() => {
          showDeleteModal = true
          ctxEl.close()
        }}
      >
        <Icon icon={mdiDelete} size="20px" /><span class="ml-2">Delete</span>
      </li>
    </ul>
  </ContextMenu>
  {#if showDeleteModal}
    <DeleteBookmark
      bookmark={selectedBookmark}
      on:close={() => (showDeleteModal = false)}
    />
  {/if}
  {#if showUpdateModal}
    <UpdateBookmark
      bookmark={selectedBookmark}
      on:close={() => (showUpdateModal = false)}
    />
  {/if}
</div>
