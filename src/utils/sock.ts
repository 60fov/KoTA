import { useEffect, useState } from "react"

interface ISockOptions {
    maxReconnectAttempts?: number
    reconnectTimeout?: number
    onOpen?: (e: Event) => void
    onError?: (e: Event) => void
    onClose?: (e: Event) => void
}

type TSock = ReturnType<typeof Sock>

const Sock = (
    url: URL,
    onMessage: (e: MessageEvent) => void,
    options?: ISockOptions
) => {
    const {
        maxReconnectAttempts = 3,
        reconnectTimeout = 1000,
        onOpen,
        onError,
        onClose,
    } = options || {}

    let ws: WebSocket
    let reconnectAttempts = 0

    const connect = () => {
        console.log("[sock] putting on socks")
        ws = new WebSocket(url)

        ws.addEventListener('open', handleOpen)
        ws.addEventListener('message', handleMessage)
        ws.addEventListener('error', handleError)
        ws.addEventListener('close', handleClose)
    }

    const close = () => {
        ws.close()
    }

    const send = (message: string) => {
        ws.send(message)
    }

    function handleOpen(e: Event) {
        console.log("[sock] socks on, you're good to go")
        if (onOpen) onOpen(e)
    }

    function handleMessage(e: MessageEvent) {
        onMessage(e)
    }

    function handleError(e: Event) {
        console.log("[sock] socks got wet, taking them off")
        ws.close()
        if (onError) onError(e)
    }

    function handleClose(e: Event) {
        console.log("[sock] socks off")
        if (onClose) onClose(e)
        if (reconnectAttempts < maxReconnectAttempts) {
            console.log("[sock] finding another pair...")
            setTimeout(() => {
                connect()
                reconnectAttempts += 1;
            }, reconnectTimeout)
        } else {
            console.log("[sock] ran out of socks.")
        }
    }

    return {
        connect,
        close,
        send
    }
}


// "typeof Sock" feels really weird
export const useSock: typeof Sock = (url, onMessage, options) => {
    const [sock, setSock] = useState<TSock>(Sock(url, onMessage, options))

    useEffect(() => {
        sock.connect()

        return () => {
            sock.close()
        }
    }, [])

    return sock
}

export default Sock