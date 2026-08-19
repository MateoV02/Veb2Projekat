/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IDENTITY_API_URL: string;
  readonly VITE_TRIP_API_URL: string;
  readonly VITE_EXPENSE_API_URL: string;
  readonly VITE_SHARING_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
