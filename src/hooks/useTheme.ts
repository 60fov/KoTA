import { useEffect } from "react"
import { useThemeStore } from "../util/stores"
import { setTheme } from "../util/theme"

const useTheme = () => {
    const theme = useThemeStore((state) => state.theme)

    const handleSystemThemeChange = (_e: MediaQueryListEvent) => {
        if (theme !== 'system') return
        setTheme(theme)
    }
    const systemThemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    useEffect(() => {
        systemThemeMediaQuery.addEventListener("change", handleSystemThemeChange)

        return () => {
            systemThemeMediaQuery.removeEventListener("change", handleSystemThemeChange)
        }
    }, [theme])

    useEffect(() => {
        setTheme(theme)
    }, [theme])
}

export default useTheme