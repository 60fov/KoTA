export const themeList = ["dark", "light"] as const
export const themeOptionList = [...themeList, "system"] as const

export type Theme = typeof themeList[number]
export type ThemeOption = typeof themeOptionList[number]

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

export function isThemeOption(themeOption: string): themeOption is ThemeOption {
    return themeOption in themeOptionList
}

export function nextThemeOption(themeOption: ThemeOption): ThemeOption {
    return themeOptionList[(themeOptionList.indexOf(themeOption) + 1) % themeOptionList.length] as ThemeOption
}