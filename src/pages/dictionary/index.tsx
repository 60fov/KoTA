import { useEffect, useReducer } from "react"
import RootLayout from "~/components/layouts/RootLayout"

type State = {
}

type Action = {
    type: "noop"
}

function initialState(): State {
    return {}
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "noop": {
            return {}
        }
    }
}

function DictionaryPage() {
    const [state, dispatch] = useReducer(reducer, null, initialState)

    useEffect(() => {
        console.log(state)
    }, [state])


    return (
        <div className="">
            
        </div>
    )
}

DictionaryPage.getLayout = RootLayout;

export default DictionaryPage;