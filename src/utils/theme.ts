export const themeList = ["dark", "light"] as const

export type Theme = typeof themeList[number]
export type ThemeOption = Theme | "system"

const prefersDarkTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches

export function setTheme(theme: ThemeOption) {
    let dataTheme: Theme
    if (theme === 'system') {
        dataTheme = prefersDarkTheme() ? 'dark' : 'light'
    } else {
        dataTheme = theme
    }
    document.documentElement.setAttribute('data-theme', dataTheme)
}

export function isTheme(theme: string): theme is Theme {
    return theme in themeList
}

export function nextTheme(theme: Theme): Theme {
    return themeList[(themeList.indexOf(theme) + 1) % themeList.length] as Theme
}