# 🌿 Nordeco Store

> Nordic sustainable e-commerce frontend — portfolio project

![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)

## 📋 About

**Nordeco Store** is a modern e-commerce frontend showcasing Nordic sustainable/eco-friendly products. Built as a portfolio project demonstrating proficiency in Vue 3, TypeScript, and modern frontend practices.

### Key Features

- 🛒 Product catalog with filtering and categories
- 📝 Blog section with rich content
- 🌍 Multi-language support (PL, EN, SV)
- ♿ WCAG 2.1 AA accessibility compliance
- 📱 Fully responsive design
- 🎨 Nordic-inspired design system
- ⚡ Optimized performance (lazy loading, code splitting)

## 🛠️ Tech Stack

| Category   | Technology                                |
| ---------- | ----------------------------------------- |
| Framework  | Vue 3 (Composition API, `<script setup>`) |
| Language   | TypeScript 5.x (strict mode)              |
| Build Tool | Vite                                      |
| State      | Pinia                                     |
| i18n       | vue-i18n (Polish, English, Swedish)       |
| Styling    | SCSS + Bootstrap 5 + BEM                  |
| CMS        | Contentful (GraphQL)                      |
| Testing    | Vitest + Vue Test Utils                   |
| Linting    | ESLint + Prettier + OXLint                |

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (recommended: 22.x)
- npm 10+

### Installation

```sh
# Clone repository
git clone https://github.com/Threshu/nordeco-store.git
cd nordeco-store

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in your Contentful credentials in .env
```

### Development

```sh
# Start dev server
npm run dev
```

### Production Build

```sh
# Type-check, lint and build
npm run build

# Preview production build
npm run preview
```

### Testing

```sh
# Run unit tests
npm run test:unit

# Run tests with coverage
npm run test:coverage
```

### Linting

```sh
# Run all linters (OXLint + ESLint)
npm run lint

# Format code with Prettier
npm run format
```

## 📁 Project Structure

```
src/
├── components/
│   ├── common/      # BaseButton, BaseCard, BaseLoader, etc.
│   ├── layout/      # TheHeader, TheFooter
│   ├── product/     # ProductCard, ProductList, ProductFilter
│   └── blog/        # BlogCard, BlogList
├── views/           # Route views (Home, Products, Blog, etc.)
├── composables/     # Reusable logic (useProducts, useBlog)
├── stores/          # Pinia stores
├── services/        # API clients (Contentful GraphQL/REST)
├── types/           # TypeScript interfaces
├── styles/          # SCSS partials and main.scss
├── router/          # Vue Router configuration
└── constants/       # Routes, config
```

## 🎨 Design System

- **Colors**: Nordic palette (forest green, ocean blue, warm neutrals)
- **Typography**: Clean, readable sans-serif
- **Methodology**: BEM for component classes, Bootstrap utilities for layout
- **Accessibility**: Skip links, ARIA labels, keyboard navigation, 4.5:1 contrast

## IDE Setup

**Recommended**: [VS Code](https://code.visualstudio.com/) with extensions:

- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

_Built with 💚 for the Nordic ecosystem_
