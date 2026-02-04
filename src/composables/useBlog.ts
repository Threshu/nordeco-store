/**
 * Blog composable
 * Provides reactive access to blog post data from Contentful
 */

import { computed, ref, watch, type Ref, type ComputedRef } from 'vue';
import { useAsyncData, type AsyncDataState } from './useAsyncData';
import {
  getBlogPosts,
  getBlogPostBySlug,
  type BlogPost,
} from '@/services/contentful/graphql';

// ============================================================================
// Types
// ============================================================================

interface BlogPostsData {
  posts: BlogPost[];
  total: number;
}

export interface UseBlogReturn extends AsyncDataState<BlogPostsData> {
  /** All blog posts */
  posts: ComputedRef<BlogPost[]>;
  /** Total count */
  total: ComputedRef<number>;
  /** Filter posts by tag */
  filterByTag: (tag: string|null) => void;
  /** Currently active tag filter */
  activeTag: Ref<string|null>;
  /** Filtered posts based on active tag */
  filteredPosts: ComputedRef<BlogPost[]>;
  /** All unique tags from posts */
  allTags: ComputedRef<string[]>;
}

export interface UseBlogPostReturn extends AsyncDataState<BlogPost|null> {
  /** Single blog post */
  post: ComputedRef<BlogPost|null>;
}

// ============================================================================
// Composables
// ============================================================================

/**
 * Get all blog posts with optional tag filtering
 */
export function useBlog (): UseBlogReturn {
  const asyncData=useAsyncData<BlogPostsData>(() => getBlogPosts());

  const activeTag=ref<string|null>(null);

  const posts=computed(() => asyncData.data.value?.posts??[]);
  const total=computed(() => asyncData.data.value?.total??0);

  const filteredPosts=computed(() => {
    if(!activeTag.value) {
      return posts.value;
    }
    return posts.value.filter((post) =>
      (post.tags??[]).some((tag) => tag.toLowerCase()===activeTag.value?.toLowerCase()),
    );
  });

  const allTags=computed(() => {
    const tagsSet=new Set<string>();
    posts.value.forEach((post) => {
      ; (post.tags??[]).forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  });

  function filterByTag (tag: string|null): void {
    activeTag.value=tag;
  }

  return {
    ...asyncData,
    posts,
    total,
    filterByTag,
    activeTag,
    filteredPosts,
    allTags,
  };
}

/**
 * Get a single blog post by slug
 * @param slug - Blog post slug (can be reactive ref)
 */
export function useBlogPost (slug: Ref<string>|string): UseBlogPostReturn {
  const slugRef=typeof slug==='string'? ref(slug):slug;

  const asyncData=useAsyncData<BlogPost|null>(
    () => getBlogPostBySlug(slugRef.value),
    { immediate: false },
  );

  const post=computed(() => asyncData.data.value);

  // Watch for slug changes and refetch
  watch(
    slugRef,
    () => {
      asyncData.execute();
    },
    { immediate: true },
  );

  return {
    ...asyncData,
    post,
  };
}
