<script>
  import ListCategory from "./lib/ListCategory.svelte"
  import ListBookmark from "./lib/ListBookmark.svelte"
  let selectedCategory = 0
  let currentDragParent = null
</script>

<main class="container">
  <ListCategory bind:selectedCategory bind:currentDragParent />
  <ListBookmark bind:selectedCategory bind:currentDragParent />
</main>
