const themeMap = {
    "dark": {
        front: '250 250 250',
        frontAlt: '180 180 180',
        back: '10 10 10',
        backAlt: '30 30 30',
    } as ThemeColors,
    "light": {
        front: "5 5 5",
        frontAlt: "125 125 125",
        back: "250 250 250",
        backAlt: "220 220 220",
    } as ThemeColors
}

export type Theme = keyof typeof themeMap | "system"

type ThemeColors = {
    front: string
    frontAlt: string
    back: string
    backAlt: string
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



