/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_GITHUB_TOKEN: string
    VITE_API_KEY_OPENAI: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}