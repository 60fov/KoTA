import { useEffect } from "react"
import { useThemeStore } from "~/utils/stores"
import { setTheme } from "~/utils/theme"
import { useClientStore } from "~/hooks/zustand"

export const useTheme = () => {
  const storeTheme = useClientStore(useThemeStore, (state) => state)

  // handles system-theme changes
  useEffect(() => {
    const systemThemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleSystemThemeChange = () => {
      if (storeTheme.value !== 'system') return
      setTheme(storeTheme.value)
    }

    systemThemeMediaQuery.addEventListener("change", handleSystemThemeChange)

    return () => {
      systemThemeMediaQuery.removeEventListener("change", handleSystemThemeChange)
    }
  }, [storeTheme.value])

  // handles in app theme change
  useEffect(() => {
    if (storeTheme.hydrated) setTheme(storeTheme.value)
  }, [storeTheme])

  const value = storeTheme.hydrated ? storeTheme.value : undefined

  return [value, storeTheme.set] as const
}