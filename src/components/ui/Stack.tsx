import { CSSProperties } from "react";
import { XOR } from "./types";


export type StackProps = {
    align?: CSSProperties["alignItems"];
    justify?: CSSProperties["justifyContent"];
    gap?: CSSProperties["gap"];
    flex?: CSSProperties["flex"];
    children?: React.ReactNode;
} & XOR<{ row?: boolean }, { col?: boolean }>;

export default function Stack(props: StackProps) {
    const {
        row,
        col,
        gap = "12px",
        flex,
        align,
        justify,
        children
    } = props;

    const flexDirection = row ? "row" : col ? "column" : "column";

    return (
        <div
            style={{
                display: "flex",
                flexDirection,
                gap,
                flex,
                alignContent: align,
                justifyContent: justify
            }}
        >
            {children}
        </div>
    );
}