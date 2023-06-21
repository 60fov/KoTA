import type { CSSProperties } from "react";

export interface CSSVariableProperties extends CSSProperties {
    [index: `--${string}`]: unknown;
}

type VariantList = readonly (string | number)[]
export type VariantValue<T extends VariantList> = T[number]
export type VariantLUT<T extends string | number> = { [K in T]: string }


export type NonDuplicateProps<T, U> = Pick<U, Exclude<keyof U, keyof T>> & T;