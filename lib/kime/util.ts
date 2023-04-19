export function buffer<T>([...data]: T[]) {
    return {
        data: () => data,
        isEmpty: () => data.length == 0,
        consume: () => data.shift(),
        peek: (i = 1) => data.length > i - 1 ? data[i - 1] : undefined
    }
}