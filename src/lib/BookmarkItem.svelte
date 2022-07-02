<script>
  export let url = {}
</script>

<a class="category" href={url.url} target="_blank">
  {#if url.icon}
    <img src={url.icon} alt="" />
  {:else}
    <img
      src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url.url}&size=16`}
      alt=""
    />
  {/if}
  <span class="ml-2">{url.title}</span>
</a>
