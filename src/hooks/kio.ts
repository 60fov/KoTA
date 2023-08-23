import { useEffect, useState } from "react";
import { createCtxUnsafe } from "~/utils/fns";
import { KeyboardInputObservable, KeyboardInputObserver } from "~/utils/kio";


export const useKio = () => {
  const [kio, setKio] = useState<KeyboardInputObservable>()

  useEffect(() => {
    const kioInstance = new KeyboardInputObservable()
    setKio(kioInstance)

    return () => {
      kioInstance.destroy()
    }
  }, [])

  return kio
}


type KioContextInterface = KeyboardInputObservable
const [useKioContext, KioContextProvider] = createCtxUnsafe<KioContextInterface>()

export const useKioKey = (key: string) => {
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