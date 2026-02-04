import { GraphQLClient, gql } from 'graphql-request';

// Contentful GraphQL endpoint
const CONTENTFUL_SPACE_ID=import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN=import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
const CONTENTFUL_ENVIRONMENT=import.meta.env.VITE_CONTENTFUL_ENVIRONMENT||'master';

const endpoint=`https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}`;

const client=new GraphQLClient(endpoint, {
  headers: {
    Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
  },
});

// ============================================
// TYPES
// ============================================

export interface Asset {
  sys: { id: string; };
  url: string;
  title: string;
  description: string|null;
  width: number;
  height: number;
}

export interface Category {
  sys: { id: string; };
  name: string;
  slug: string;
  description: string|null;
  icon: Asset|null;
}

export interface Product {
  sys: { id: string; };
  name: string;
  slug: string;
  description: string|null;
  price: number;
  currency: string;
  imagesCollection: { items: Asset[]; };
  category: Category|null;
  tags: string[]|null;
  inStock: boolean;
  sustainabilityScore: number;
}

export interface BlogPost {
  sys: { id: string; publishedAt: string; };
  title: string;
  slug: string;
  excerpt: string;
  content: { json: unknown; };
  featuredImage: Asset|null;
  author: string;
  publishedAt: string;
  tags: string[]|null;
}

// ============================================
// FRAGMENTS
// ============================================

const ASSET_FRAGMENT=gql`
  fragment AssetFields on Asset {
    sys { id }
    url
    title
    description
    width
    height
  }
`;

const CATEGORY_FRAGMENT=gql`
  fragment CategoryFields on Category {
    sys { id }
    name
    slug
    description
    icon {
      ...AssetFields
    }
  }
  ${ASSET_FRAGMENT}
`;

const PRODUCT_FRAGMENT=gql`
  fragment ProductFields on Product {
    sys { id }
    name
    slug
    description
    price
    currency
    imagesCollection {
      items {
        ...AssetFields
      }
    }
    category {
      ...CategoryFields
    }
    tags
    inStock
    sustainabilityScore
  }
  ${ASSET_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

const BLOG_POST_FRAGMENT=gql`
  fragment BlogPostFields on BlogPost {
    sys { id publishedAt }
    title
    slug
    excerpt
    content { json }
    featuredImage {
      ...AssetFields
    }
    author
    publishedAt
    tags
  }
  ${ASSET_FRAGMENT}
`;

// ============================================
// QUERIES
// ============================================

const GET_CATEGORIES=gql`
  query GetCategories {
    categoryCollection(order: name_ASC) {
      items {
        ...CategoryFields
      }
    }
  }
  ${CATEGORY_FRAGMENT}
`;

const GET_PRODUCTS=gql`
  query GetProducts($limit: Int, $skip: Int) {
    productCollection(limit: $limit, skip: $skip, order: name_ASC) {
      total
      items {
        ...ProductFields
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const GET_PRODUCT_BY_SLUG=gql`
  query GetProductBySlug($slug: String!) {
    productCollection(where: { slug: $slug }, limit: 1) {
      items {
        ...ProductFields
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const GET_PRODUCTS_BY_CATEGORY=gql`
  query GetProductsByCategory($categoryId: String!, $limit: Int, $skip: Int) {
    productCollection(
      where: { category: { sys: { id: $categoryId } } }
      limit: $limit
      skip: $skip
      order: name_ASC
    ) {
      total
      items {
        ...ProductFields
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const GET_BLOG_POSTS=gql`
  query GetBlogPosts($limit: Int, $skip: Int) {
    blogPostCollection(limit: $limit, skip: $skip, order: publishedAt_DESC) {
      total
      items {
        ...BlogPostFields
      }
    }
  }
  ${BLOG_POST_FRAGMENT}
`;

const GET_BLOG_POST_BY_SLUG=gql`
  query GetBlogPostBySlug($slug: String!) {
    blogPostCollection(where: { slug: $slug }, limit: 1) {
      items {
        ...BlogPostFields
      }
    }
  }
  ${BLOG_POST_FRAGMENT}
`;

// ============================================
// API FUNCTIONS
// ============================================

interface ProductsResponse {
  productCollection: {
    total: number;
    items: Product[];
  };
}

interface CategoriesResponse {
  categoryCollection: {
    items: Category[];
  };
}

interface BlogPostsResponse {
  blogPostCollection: {
    total: number;
    items: BlogPost[];
  };
}

/**
 * Fetch all categories
 */
export async function getCategories (): Promise<Category[]> {
  const data=await client.request<CategoriesResponse>(GET_CATEGORIES);
  return data.categoryCollection.items;
}

/**
 * Fetch products with pagination
 */
export async function getProducts (
  limit=12,
  skip=0
): Promise<{ products: Product[]; total: number; }> {
  const data=await client.request<ProductsResponse>(GET_PRODUCTS, { limit, skip });
  return {
    products: data.productCollection.items,
    total: data.productCollection.total,
  };
}

/**
 * Fetch a single product by slug
 */
export async function getProductBySlug (slug: string): Promise<Product|null> {
  const data=await client.request<ProductsResponse>(GET_PRODUCT_BY_SLUG, { slug });
  return data.productCollection.items[0]||null;
}

/**
 * Fetch products by category
 */
export async function getProductsByCategory (
  categoryId: string,
  limit=12,
  skip=0
): Promise<{ products: Product[]; total: number; }> {
  const data=await client.request<ProductsResponse>(GET_PRODUCTS_BY_CATEGORY, {
    categoryId,
    limit,
    skip,
  });
  return {
    products: data.productCollection.items,
    total: data.productCollection.total,
  };
}

/**
 * Fetch blog posts with pagination
 */
export async function getBlogPosts (
  limit=10,
  skip=0
): Promise<{ posts: BlogPost[]; total: number; }> {
  const data=await client.request<BlogPostsResponse>(GET_BLOG_POSTS, { limit, skip });
  return {
    posts: data.blogPostCollection.items,
    total: data.blogPostCollection.total,
  };
}

/**
 * Fetch a single blog post by slug
 */
export async function getBlogPostBySlug (slug: string): Promise<BlogPost|null> {
  const data=await client.request<BlogPostsResponse>(GET_BLOG_POST_BY_SLUG, { slug });
  return data.blogPostCollection.items[0]||null;
}
