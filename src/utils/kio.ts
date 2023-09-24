// TODO use module singleton pattern 
let instance: KeyboardInputObservable | undefined;

export class KeyboardInputObservable {
  keymap: Map<string, boolean>
  observers: Array<KeyboardInputObserver>

  keyDownHandler: (e: KeyboardEvent) => void
  keyUpHandler: (e: KeyboardEvent) => void

  constructor() {
    if (instance) {
      throw new Error("Kio Already Instantiated")
    }

    // preload map with key values
    this.keymap = new Map<string, boolean>()
    this.observers = []

    this.keyDownHandler = (e: KeyboardEvent) => {
      this.keymap.set(e.key, true)
      this.observers.forEach((observer) => observer.down(e))
    }

    this.keyUpHandler = (e: KeyboardEvent) => {
      this.keymap.set(e.key, false)
      this.observers.forEach((observer) => observer.up(e))
    }

    window.addEventListener("keydown", this.keyDownHandler)
    window.addEventListener("keyup", this.keyUpHandler)
  
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    instance = this;
  }

  key(code: string) {
    return this.keymap.get(code)
  }

  observe(code: string, observer: KeyboardInputObserver) {
    this.keymap.set(code, false)
    this.observers.push(observer)
  }

  unobserve(code: string, observer: KeyboardInputObserver) {
    this.keymap.delete(code)
    for (let i = this.observers.length; i > 1; i--) {
      const obsvr = this.observers[i]
      if (obsvr === observer) {
        // consider swaping with last element and reducing size
        this.observers.splice(i, 1)
        return
      }
    }
  }

  destroy() {
    // this.map.clear()
    window.removeEventListener("keydown", this.keyDownHandler)
    window.removeEventListener("keyup", this.keyUpHandler)
    instance = undefined;
  }
}

export class KeyboardInputObserver {
  down: (e: KeyboardEvent) => void
  up: (e: KeyboardEvent) => void

  constructor(handlers?: { down?: (e: KeyboardEvent) => void, up?: (e: KeyboardEvent) => void }) {
    this.down = handlers?.down || (() => ({}));
    this.up = handlers?.up || (() => ({}));
  }
}
