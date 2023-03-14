export const themeList = ["dark", "light", "system"] as const
export const themeColorList = ['front', 'frontAlt', 'back', 'backAlt',] as const

export type Theme = typeof themeList[number]
export type ThemeColor = typeof themeColorList[number]
export type ThemeObject = Record<ThemeColor, string>

const themeMap: Record<Exclude<Theme, "system">, ThemeObject> = {
    "dark": {
        front: '250 250 250',
        frontAlt: '180 180 180',
        back: '10 10 10',
        backAlt: '30 30 30',
    },
    "light": {
        front: "5 5 5",
        frontAlt: "125 125 125",
        back: "250 250 250",
        backAlt: "220 220 220",
    }
}

const prefersDarkTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches

export function setTheme(theme: Theme) {
    const colors = theme === 'system' ? (
        prefersDarkTheme() ? themeMap['dark'] : themeMap['light']
    ) : (
        themeMap[theme]
    )

    document.documentElement.style.setProperty("--color-front", colors.front);
    document.documentElement.style.setProperty("--color-front-alt", colors.frontAlt);
    document.documentElement.style.setProperty("--color-back", colors.back);
    document.documentElement.style.setProperty("--color-back-alt", colors.backAlt);
}
