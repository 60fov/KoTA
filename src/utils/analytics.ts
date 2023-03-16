interface RecordEntry {
  // id: string
  word: string
  time: number
  recordedAt: number
}

type RecordStorage = RecordEntry[]

let recordBuffer: RecordEntry[]

function init() {
  recordBuffer = []
}

function submitRecord(id: string, word: string, time: number) {
  const entry = {
    // id,
    word,
    time,
    recordedAt: Date.now()
  }

  recordBuffer.push(entry)
}

function flush() {
  const local = localStorage.getItem("record")
  const data = JSON.parse(local ?? "[]") as unknown as RecordStorage

  recordBuffer.forEach(record => {
    data.push(record)
  })

  localStorage.setItem("record", JSON.stringify(data))

  recordBuffer = []
}

function wipe() {
  if (localStorage) localStorage.removeItem("record")
}

export const Analytics = {
  init,
  submitRecord,
  flush,
  wipe,
}

