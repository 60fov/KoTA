import { createContext, useContext } from "react";
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { nanoid } from "nanoid";
// import toast from "~/components/Toast";

// yoink'd from shadecn, ty!
// https://github.com/shadcn/taxonomy/blob/0bace50fcac775e7214eab01c96f7fea90d48e8c/lib/utils.ts
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


// eslint-disable-next-line @typescript-eslint/ban-types
export function createCtx<A extends {} | null>(options?: {
    allowUndefined?: boolean
}) {

    const {
        allowUndefined = false
    } = options || {}

    const ctx = createContext<A | undefined>(undefined);
    function useCtx() {
        const c = useContext(ctx);
        if (!allowUndefined && c === undefined)
            throw new Error("useCtx must be inside a Provider with a value");
        return c;
    }
    return [useCtx, ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
}

export function clmp(v: number, min: number, max: number) {
    return v <= min ? min : v >= max ? max : v
}

export const max = Math.max
export const min = Math.min

export const random = {
    fromArray: <T>(array: T[]): T | undefined => {
        return array[Math.floor(Math.random() * array.length)]
    },
    fromArrayOrDefault: <T>(array: T[], defaultValue: T): T => {
        return array[Math.floor(Math.random() * array.length)] ?? defaultValue
    },
    listFromArray: <T>(array: T[], length: number): T[] => {
        const result: T[] = []
        for (let i = 0; i < length; i++) {
            result.push(array[Math.floor(Math.random() * array.length)] ?? {} as T)
        }
        return result
    },
    uuid: () => crypto.randomUUID(),
    tsid: () => `${performance.now()}`,
    nano: () => nanoid(),
    int: (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min,
    float: (min: number, max: number) => Math.random() * (max - min) + min,
}

type Accumulator<T> = Record<string, T[]>;

export const byGroup = <T>(fn: (item: T) => string) => [
  (acc: Accumulator<T>, item: T) => {
    (acc[fn(item)] ??= []).push(item)
    return acc
  },
  {} as Accumulator<T>
] as const;


export const groupBy = <T, K extends string | number | symbol>(arr: T[], key: (i: T) => K) =>
    arr.reduce((groups, item) => {
        (groups[key(item)] ||= []).push(item);
        return groups;
    }, {} as Record<K, T[]>);

export async function copyToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text)
        // toast.pop("📋 Copied Successfully!")
    } catch (err) {
        console.warn(`failed to copy ${text}`)
    }
}

export function getProfileUrl(id: string) {
    return new URL(`user/${id}`, window.location.origin)
}