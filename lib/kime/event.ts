declare global {
    interface HTMLElementEventMap {
        'kime': KimeEvent
    }
}

export type TKimeEventDetail =
    | { type: "input", value: string }
    | { type: "composition", composing: boolean }

export type TKimeEventType = TKimeEventDetail["type"]

export class KimeEvent extends Event {

    static dispatchInputEvent(value: string, element: HTMLElement) {
        element.dispatchEvent(new KimeEvent({ type: "input", value }))
    }

    static dispatchCompositionEvent(composing: boolean, element: HTMLElement) {
        element.dispatchEvent(new KimeEvent({ type: "composition", composing }))
    }

    readonly detail: TKimeEventDetail;

    constructor(detail: TKimeEventDetail) {
        super("kime");
        this.detail = detail;
    }
}