export function clamp(v: number, min: number, max: number) {
    return v <= min ? min : v >= max ? max : v
}

// TODO audit for non zero values
export function wrap(v: number, min: number, max: number) {
    return v % (max - min) + min
}

export function wrap0(v: number, high: number) {
    return v % high
}