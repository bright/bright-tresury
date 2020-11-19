export function setTranslation(language: string) {
    localStorage.setItem(STORAGE_LANGUAGE_KEY, language)
}

export function getTranslation(): string {
    const language = localStorage.getItem(STORAGE_LANGUAGE_KEY)
    return language ? language : DEFAULT_LANGUAGE
}

export const DEFAULT_LANGUAGE = 'en'
const STORAGE_LANGUAGE_KEY = 'LANGUAGE'
