<script>
  import { flip } from "svelte/animate"
  import { quintOut } from "svelte/easing"
  import { liveQuery } from "dexie"
  import AddCategory from "./AddCategory.svelte"
  import ContextMenu from "./ContextMenu.svelte"
  import UpdateCategory from "./UpdateCategory.svelte"
  import DeleteCategory from "./DeleteCategory.svelte"
  import Icon from "./Icon.svelte"
  import { mdiDelete, mdiDotsHorizontal, mdiBookEdit, mdiPlusCircle } from "@mdi/js"
  let _this

  import db from "./db"
  export let selectedCategory = 0
  export let currentDragParent = null

  let ctxEl
  let actionCategory = 0

  let showAddCategoryModal = false
  let showDeleteModal = false
  let showUpdateModal = false

  $: categories = liveQuery(async () => {
    const cat = await db.table("categories").orderBy("position").toArray()
    if (!selectedCategory) {
      selectedCategory = cat.length === 0 ? 0 : cat[0].id
    }
    return cat
  })
  const toggleAddCategoryModal = () => {
    showAddCategoryModal = !showAddCategoryModal
  }
  let hovering = -1

  const drop = async (event, target) => {
    if (event.currentTarget.parentElement.isSameNode(currentDragParent)) {
      event.dataTransfer.dropEffect = "move"
      const start = parseInt(event.dataTransfer.getData("text/plain"))
      const newTracklist = $categories

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
      db.table("categories")
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
    event.dataTransfer.setData("text/plain", start)
  }
</script>

<div class="container row cols-2 cols-md-4 cols-lg-6" bind:this={_this}>
  {#if $categories}
    {#each $categories as category (category.id)}
      <div
        class="category"
        class:selected={selectedCategory === category.id}
        tabindex="0"
        on:click={() => (selectedCategory = category.id)}
        animate:flip={{ delay: 0, duration: 1050, easing: quintOut }}
        draggable={true}
        on:dragstart={(event) => dragstart(event, category.position)}
        on:drop|preventDefault={(event) => drop(event, category.position)}
        on:dragover|preventDefault={() => true}
        on:dragenter|stopPropagation|capture={(event) => {
          // @ts-ignore
          if (currentDragParent.isSameNode(_this)) {
            hovering = category.position
          }
        }}
        on:dragleave={(e) => {
          // @ts-ignore
          if (!e.currentTarget.contains(e.relatedTarget)) {
            hovering = -1
          }
        }}
        class:is-active={hovering === category.position}
      >
        <span>{category.title}</span><button
          class="menu"
          on:click|preventDefault|stopPropagation={(ev) => {
            actionCategory = category
            ctxEl.open(ev)
          }}><Icon icon={mdiDotsHorizontal} size="24px" /></button
        >
      </div>
    {/each}
  {/if}
  <button on:click={toggleAddCategoryModal} class="category add-new">
    <Icon icon={mdiPlusCircle} size="22px" class="mr-2" /> Add Category</button
  >
  {#if showAddCategoryModal}
    <AddCategory on:close={toggleAddCategoryModal} />
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
    <DeleteCategory
      category={actionCategory}
      on:close={() => (showDeleteModal = false)}
    />
  {/if}
  {#if showUpdateModal}
    <UpdateCategory
      category={actionCategory}
      on:close={() => (showUpdateModal = false)}
    />
  {/if}
</div>
