import {useEffect, useState } from "react"
import { useThemeStore } from "./stores"
import { isTheme, setTheme } from "./theme"
import { api } from "./api"

type Handler = (event: MouseEvent) => void

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T> | React.RefObject<T>[],
  handler: Handler,
  mouseEvent: 'mousedown' | 'mouseup' = 'mousedown',
): void {

  useEffect(() => {
    function eventHandler(event: MouseEvent) {
      if (Array.isArray(ref)) {
        for (const r of ref) {
          const el = r?.current
          if (!el || el.contains(event.target as Node)) return
        }
      } else {
        const el = ref?.current
        if (!el || el.contains(event.target as Node)) return
      }
      handler(event)
    }

    window.addEventListener(mouseEvent, eventHandler)
    return () => {
      window.removeEventListener(mouseEvent, eventHandler)
    }
  }, [mouseEvent, handler, ref])
}



export const useTheme = () => {
  const storeTheme = useThemeStore()

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
    setTheme(storeTheme.value)
  }, [storeTheme.value])

  return [storeTheme.value, storeTheme.set] as const
}


import { createCtx } from "~/utils/fns";
import { type KeyboardInputObservable, KeyboardInputObserver } from "~/utils/kio";

type KioContextInterface = KeyboardInputObservable

const [useKioContext, KioContextProvider] = createCtx<KioContextInterface>()

export const useKio = (key: string) => {
  const kio = useKioContext()

  const [down, setDown] = useState(false)

  useEffect(() => {
    if (!kio) return

    const observer = new KeyboardInputObserver({
      down: (e: KeyboardEvent) => {
        const onlyShift = !e.metaKey && !e.altKey && !e.ctrlKey
        if (e.key === key && onlyShift) {
          setDown(true)
        }
      },
      up: (e: KeyboardEvent) => {
        const onlyShift = !e.metaKey && !e.altKey && !e.ctrlKey
        if (e.key === key && onlyShift) {
          setDown(false)
        }
      }
    })

    kio.observe(key, observer)

    return () => {
      kio.unobserve(key, observer)
    }
  }, [kio, key])

  return down
}

export { KioContextProvider }