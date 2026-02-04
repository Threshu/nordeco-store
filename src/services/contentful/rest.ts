/**
 * Contentful REST Client
 * Alternative to GraphQL for simpler queries or when GraphQL is unavailable
 */

const SPACE_ID=import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN=import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
const PREVIEW_TOKEN=import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN;
const ENVIRONMENT=import.meta.env.VITE_CONTENTFUL_ENVIRONMENT||'master';

const BASE_URL=`https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;
const PREVIEW_URL=`https://preview.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;

// ============================================================================
// Types
// ============================================================================

interface ContentfulSys {
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  contentType?: {
    sys: {
      id: string;
    };
  };
}

interface ContentfulLink {
  sys: {
    type: 'Link';
    linkType: 'Asset'|'Entry';
    id: string;
  };
}

interface ContentfulAsset {
  sys: ContentfulSys;
  fields: {
    title?: string;
    description?: string;
    file: {
      url: string;
      details: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}

interface ContentfulEntry<T> {
  sys: ContentfulSys;
  fields: T;
}

interface ContentfulCollection<T> {
  sys: { type: 'Array'; };
  total: number;
  skip: number;
  limit: number;
  items: T[];
  includes?: {
    Entry?: ContentfulEntry<unknown>[];
    Asset?: ContentfulAsset[];
  };
}

// Raw field types from Contentful
interface CategoryFields {
  name: string;
  slug: string;
  description?: string;
  icon?: ContentfulLink;
}

interface ProductFields {
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  images?: ContentfulLink[];
  category?: ContentfulLink;
  tags?: string[];
  inStock: boolean;
  sustainabilityScore: number;
}

interface BlogPostFields {
  title: string;
  slug: string;
  excerpt: string;
  content: unknown; // Rich text document
  featuredImage?: ContentfulLink;
  author: string;
  publishedAt: string;
  tags?: string[];
}

// Normalized types (matching GraphQL types)
export interface Asset {
  url: string;
  title: string;
  description: string;
  width: number;
  height: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: Asset|null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  images: Asset[];
  category: Category|null;
  tags: string[];
  inStock: boolean;
  sustainabilityScore: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: unknown; // Rich text JSON
  featuredImage: Asset|null;
  author: string;
  publishedAt: string;
  tags: string[];
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Make a request to Contentful REST API
 */
async function fetchContentful<T> (
  endpoint: string,
  params: Record<string, string>={},
  preview=false,
): Promise<T> {
  const baseUrl=preview? PREVIEW_URL:BASE_URL;
  const token=preview? PREVIEW_TOKEN:ACCESS_TOKEN;

  const url=new URL(`${baseUrl}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response=await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if(!response.ok) {
    throw new Error(`Contentful API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Resolve asset from includes
 */
function resolveAsset (
  link: ContentfulLink|undefined,
  includes?: ContentfulCollection<unknown>['includes'],
): Asset|null {
  if(!link||!includes?.Asset) return null;

  const asset=includes.Asset.find((a) => a.sys.id===link.sys.id);
  if(!asset) return null;

  return {
    url: asset.fields.file.url.startsWith('//')
      ? `https:${asset.fields.file.url}`
      :asset.fields.file.url,
    title: asset.fields.title||'',
    description: asset.fields.description||'',
    width: asset.fields.file.details.image?.width||0,
    height: asset.fields.file.details.image?.height||0,
  };
}

/**
 * Resolve entry from includes
 */
function resolveEntry<T> (
  link: ContentfulLink|undefined,
  includes?: ContentfulCollection<unknown>['includes'],
): ContentfulEntry<T>|null {
  if(!link||!includes?.Entry) return null;

  return (includes.Entry.find((e) => e.sys.id===link.sys.id) as ContentfulEntry<T>)||null;
}

// ============================================================================
// Category API
// ============================================================================

/**
 * Normalize category entry to Category type
 */
function normalizeCategory (
  entry: ContentfulEntry<CategoryFields>,
  includes?: ContentfulCollection<unknown>['includes'],
): Category {
  return {
    id: entry.sys.id,
    name: entry.fields.name,
    slug: entry.fields.slug,
    description: entry.fields.description||'',
    icon: resolveAsset(entry.fields.icon, includes),
  };
}

/**
 * Get all categories
 */
export async function getCategories (preview=false): Promise<Category[]> {
  const response=await fetchContentful<ContentfulCollection<ContentfulEntry<CategoryFields>>>(
    '/entries',
    {
      content_type: 'category',
      include: '1',
    },
    preview,
  );

  return response.items.map((item) => normalizeCategory(item, response.includes));
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug (slug: string, preview=false): Promise<Category|null> {
  const response=await fetchContentful<ContentfulCollection<ContentfulEntry<CategoryFields>>>(
    '/entries',
    {
      content_type: 'category',
      'fields.slug': slug,
      include: '1',
      limit: '1',
    },
    preview,
  );

  const firstItem=response.items[0];
  if(!firstItem) return null;
  return normalizeCategory(firstItem, response.includes);
}

// ============================================================================
// Product API
// ============================================================================

/**
 * Normalize product entry to Product type
 */
function normalizeProduct (
  entry: ContentfulEntry<ProductFields>,
  includes?: ContentfulCollection<unknown>['includes'],
): Product {
  // Resolve category
  let category: Category|null=null;
  if(entry.fields.category) {
    const categoryEntry=resolveEntry<CategoryFields>(entry.fields.category, includes);
    if(categoryEntry) {
      category=normalizeCategory(categoryEntry, includes);
    }
  }

  // Resolve images
  const images: Asset[]=[];
  if(entry.fields.images) {
    for(const imageLink of entry.fields.images) {
      const asset=resolveAsset(imageLink, includes);
      if(asset) images.push(asset);
    }
  }

  return {
    id: entry.sys.id,
    name: entry.fields.name,
    slug: entry.fields.slug,
    description: entry.fields.description||'',
    price: entry.fields.price,
    currency: entry.fields.currency,
    images,
    category,
    tags: entry.fields.tags||[],
    inStock: entry.fields.inStock,
    sustainabilityScore: entry.fields.sustainabilityScore,
  };
}

/**
 * Get all products
 */
export async function getProducts (preview=false): Promise<Product[]> {
  const response=await fetchContentful<ContentfulCollection<ContentfulEntry<ProductFields>>>(
    '/entries',
    {
      content_type: 'product',
      include: '2', // Include linked entries and assets
    },
    preview,
  );

  return response.items.map((item) => normalizeProduct(item, response.includes));
}

/**
 * Get product by slug
 */
export async function getProductBySlug (slug: string, preview=false): Promise<Product|null> {
  const response=await fetchContentful<ContentfulCollection<ContentfulEntry<ProductFields>>>(
    '/entries',
    {
      content_type: 'product',
      'fields.slug': slug,
      include: '2',
      limit: '1',
    },
    preview,
  );

  const firstItem=response.items[0];
  if(!firstItem) return null;
  return normalizeProduct(firstItem, response.includes);
}

/**
 * Get products by category slug
 */
export async function getProductsByCategory (
  categorySlug: string,
  preview=false,
): Promise<Product[]> {
  // First, get category ID
  const category=await getCategoryBySlug(categorySlug, preview);
  if(!category) return [];

  const response=await fetchContentful<ContentfulCollection<ContentfulEntry<ProductFields>>>(
    '/entries',
    {
      content_type: 'product',
      'fields.category.sys.id': category.id,
      include: '2',
    },
    preview,
  );

  return response.items.map((item) => normalizeProduct(item, response.includes));
}

// ============================================================================
// Blog Post API
// ============================================================================

/**
 * Normalize blog post entry to BlogPost type
 */
function normalizeBlogPost (
  entry: ContentfulEntry<BlogPostFields>,
  includes?: ContentfulCollection<unknown>['includes'],
): BlogPost {
  return {
    id: entry.sys.id,
    title: entry.fields.title,
    slug: entry.fields.slug,
    excerpt: entry.fields.excerpt,
    content: entry.fields.content,
    featuredImage: resolveAsset(entry.fields.featuredImage, includes),
    author: entry.fields.author,
    publishedAt: entry.fields.publishedAt,
    tags: entry.fields.tags||[],
  };
}

/**
 * Get all blog posts
 */
export async function getBlogPosts (preview=false): Promise<BlogPost[]> {
  const response=await fetchContentful<ContentfulCollection<ContentfulEntry<BlogPostFields>>>(
    '/entries',
    {
      content_type: 'blogPost',
      include: '1',
      order: '-fields.publishedAt',
    },
    preview,
  );

  return response.items.map((item) => normalizeBlogPost(item, response.includes));
}

/**
 * Get blog post by slug
 */
export async function getBlogPostBySlug (slug: string, preview=false): Promise<BlogPost|null> {
  const response=await fetchContentful<ContentfulCollection<ContentfulEntry<BlogPostFields>>>(
    '/entries',
    {
      content_type: 'blogPost',
      'fields.slug': slug,
      include: '1',
      limit: '1',
    },
    preview,
  );

  const firstItem=response.items[0];
  if(!firstItem) return null;
  return normalizeBlogPost(firstItem, response.includes);
}
