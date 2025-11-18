/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_GITHUB_TOKEN: string
    VITE_API_KEY_OPENAI: string
    VITE_API_KEY_FIREBASE: string
    VITE_AUTH_DOMAIN: string
    VITE_PROJECT_ID: string
    VITE_STORAGE_BUCKET: string
    VITE_MESSAGING_SENDER_ID: string
    VITE_APP_ID: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}