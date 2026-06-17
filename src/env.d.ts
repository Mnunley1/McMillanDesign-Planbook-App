/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALGOLIA_APP_ID: string;
  readonly VITE_ALGOLIA_SEARCH_API_KEY: string;
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  readonly VITE_CLOUDINARY_API_KEY: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  readonly VITE_CONTENTFUL_ACCESS_TOKEN: string;
  readonly VITE_CONTENTFUL_PREVIEW_TOKEN: string;
  readonly VITE_CONTENTFUL_SPACE_ID: string;
  readonly VITE_CONVEX_URL: string;
  readonly VITE_PLANS_INDEX?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
