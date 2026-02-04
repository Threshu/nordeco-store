/**
 * Contentful Services
 *
 * This module exports both GraphQL and REST clients for Contentful.
 * Use GraphQL for complex queries with specific field selection.
 * Use REST for simpler queries or when GraphQL is unavailable.
 *
 * Both clients return the same normalized types for consistency.
 */

// GraphQL Client (primary)
export * as graphql from './graphql';

// REST Client (alternative)
export * as rest from './rest';

// Shared types (exported from GraphQL but identical in REST)
export type { Asset, Category, Product, BlogPost } from './graphql';
