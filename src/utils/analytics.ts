import { useEffect, useRef } from "react"
import { decompose } from "lib/kime/jamo"
import { api } from "./api"

export interface WordMetrics {
  period: number
  length: number
  strokes: number
}

type TimeoutHandle = number

export interface UserMetricsAnalyticsOptions {
  maxBufferSize?: number,
  idleTimer?: number
}

export function useUserMetricAnalytics(input: string, goal: string, options?: UserMetricsAnalyticsOptions) {
  const {
    // TODO cosider buffer flush timer
    maxBufferSize = 5,
    idleTimer = 5000
  } = options || {}

  const refTimer = useRef(0)
  const refStrokes = useRef(0)
  const refPrevInput = useRef("")
  const refWordBuffer = useRef<WordMetrics[]>([])

  const refIdleTimeoutHandle = useRef<TimeoutHandle>()

  const metricsMutation = api.user.pushWordEntries.useMutation({
    retry: 1,
  })

  useEffect(() => {
    return () => {
      clearTimeout(refIdleTimeoutHandle.current)
    }
  }, [])

  useEffect(() => {
    clearTimeout(refIdleTimeoutHandle.current)
    refStrokes.current++

    if (input.length === 0) {
      refIdleTimeoutHandle.current = setTimeout(reset, idleTimer) as unknown as TimeoutHandle

    } else if (input.length === 1 && refTimer.current === 0) { // dunno how i feel about this check
      start()
    }

    refPrevInput.current = input
  // idle timer shouldn't recall this effect on change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input])

  const submit = () => {
    if (refTimer.current !== 0) {
      console.log("metrics: submit")
      const period = performance.now() - refTimer.current
      const strokes = refStrokes.current
      const length = decompose(goal).length
      const metrics = { period, strokes, length }
      console.log("metrics: pushing\n", JSON.stringify(metrics))
      refWordBuffer.current.push(metrics)

      if (refWordBuffer.current.length >= maxBufferSize) {
        flush()
      }

      refTimer.current = performance.now()
      refStrokes.current = 0
    } else {
      console.warn("metrics not running to be submitted")
    }
  }

  const start = () => {
    if (refTimer.current === 0) {
      console.log("metrics: start")
      refTimer.current = performance.now()
    } else {
      console.warn("metrics already started")
    }
  }

  const reset = (clearBuffer = false) => {
    console.log("metrics: reset")
    refTimer.current = 0
    refStrokes.current = 0
    if (clearBuffer) refWordBuffer.current = []
  }

  const flush = () => {
    console.log("metrics: flushing\n", refWordBuffer.current)
    const local = localStorage.getItem("word_metrics")
    const data = JSON.parse(local ?? "[]") as unknown as WordMetrics[]

    refWordBuffer.current.forEach(metrics => {
      data.push(metrics)
    })

    metricsMutation.mutate(refWordBuffer.current, {
      onSuccess() {
        localStorage.setItem("word_metrics", JSON.stringify([]))
      },
      onError() {
        localStorage.setItem("word_metrics", JSON.stringify(data))
      },
    })

    refWordBuffer.current = []
  }

  return {
    start,
    submit,
    // end,
    // stroke,
    reset,
    time: refTimer.current,
    running: refTimer.current !== 0
  }

}

export const Analytics = {

}

