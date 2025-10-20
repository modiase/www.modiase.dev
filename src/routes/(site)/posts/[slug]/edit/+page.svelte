<script lang="ts">
  import PostPage from '$lib/components/common/PostPage.svelte';
  import type { Post } from '$lib/types';

  interface PageData {
    post: Post;
  }

  export let data: PageData;
</script>

<PostPage post={data.post} isEditMode={true} />
