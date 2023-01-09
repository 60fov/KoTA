export function buffer<T>([...data]: T[]) {
    return {
        data: () => data,
        isEmpty: () => data.length == 0,
        consume: () => data.shift(),
        peek: (i: number = 1) => data.length > i - 1 ? data[i - 1] : undefined
    }
}

export function getRandomFrom<T>(list: T[]) {
    return list[Math.floor(Math.random() * list.length)]
}

export function getRandomListFrom<T>(list: T[], count: number) {
    let arr = new Array<T>(count)
    for (let i = 0; i < count; i++) {
        arr[i] = list[Math.floor(Math.random() * list.length)]
    }
    return arr
}