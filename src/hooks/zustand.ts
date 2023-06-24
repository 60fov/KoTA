import { useState, useEffect } from 'react'

export const useClientStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return { ...result, hydrated }
}


export const useStore = <State, Result>(
  store: (callback: (state: State) => unknown) => unknown,
  callback: (state: State) => Result,
  def: Result
) => {
  const result = store(callback) as Result
  const [data, setData] = useState<Result>(def)

  useEffect(() => {
    setData(result)
  }, [result])

  return data
}
