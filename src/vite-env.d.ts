/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_GITHUB_TOKEN: string
    VITE_AZURE_PERSONAL_ACCESS_TOKEN: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
