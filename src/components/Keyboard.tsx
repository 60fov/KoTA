import Key from "./Key"
import { ReactElement } from "react";
import { KeyboardContextInterface, KeyboardProvider } from "./KeyboardContext";

type Props = {
    layout?: string
}

// TODO: responsive queries
const Keyboard = ({ }: Props) => {
    
    const settings: KeyboardContextInterface = {
        size: 45,
        layout: {
            en: "QWERTY",
            kr: "2-SET"
        },
        showJamo: true,
        showCode: true,
        showOnShift: true
    }

    return (
        <KeyboardProvider value={settings}>
                <div className="flex flex-col gap-1 pointer-events-none w-[700px]">
                    <div className="flex gap-1">
                        <Key code={'\`'} />
                        <Key code={'1'} />
                        <Key code={'2'} />
                        <Key code={'3'} />
                        <Key code={'4'} />
                        <Key code={'5'} />
                        <Key code={'6'} />
                        <Key code={'7'} />
                        <Key code={'8'} />
                        <Key code={'9'} />
                        <Key code={'0'} />
                        <Key code={'-'} />
                        <Key code={'='} />
                        <Key code={'Delete'} keyWidth={1.5} />
                    </div>
                    <div className="flex gap-1">
                        <Key expand={true} />
                        <Key code={'q'} />
                        <Key code={'w'} />
                        <Key code={'e'} />
                        <Key code={'r'} />
                        <Key code={'t'} />
                        <Key code={'y'} />
                        <Key code={'u'} />
                        <Key code={'i'} />
                        <Key code={'o'} />
                        <Key code={'p'} />
                        <Key code={'['} />
                        <Key code={']'} />
                        <Key code={'\\'} />
                    </div>
                    <div className="flex gap-1">
                        <Key expand={true} />
                        <Key code={'a'} />
                        <Key code={'s'} />
                        <Key code={'d'} />
                        <Key code={'f'} />
                        <Key code={'g'} />
                        <Key code={'h'} />
                        <Key code={'j'} />
                        <Key code={'k'} />
                        <Key code={'l'} />
                        <Key code={';'} />
                        <Key code={'\''} />
                        <Key code={'Enter'} expand={true} />
                    </div>
                    <div className="flex gap-1">
                        <Key code={"ShiftLeft"} label={"Shift"} expand={true} />
                        <Key code={'z'} />
                        <Key code={'x'} />
                        <Key code={'c'} />
                        <Key code={'v'} />
                        <Key code={'b'} />
                        <Key code={'n'} />
                        <Key code={'m'} />
                        <Key code={','} />
                        <Key code={'.'} />
                        <Key code={'/'} />
                        <Key code={'ShiftRight'} label={"Shift"} expand={true} />
                    </div>
                </div>
        </KeyboardProvider>
    )
}

type KeyRowProps = {
    children: ReactElement<typeof Key>
}

export default Keyboard