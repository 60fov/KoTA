import { useState } from "react"
import { BsX } from "react-icons/bs"
import useIsMobile_BAD from "../hooks/useIsMobile"

const MobileWarning = () => {
    // this is super dirty but it temporary(ish)
    const isMobile = useIsMobile_BAD()
    const [showMobileWarning, setShowMobileWarning] = useState(true)

    return (
        <>{
            // TODO: move to component
            isMobile && showMobileWarning ?
                // true ?
                <div className="fixed m-3 p-3 rounded-md shadow-lg backdrop-blur-md bg-back-alt/5 border border-front/10 flex justify-between items-start gap-1">
                    <div className="flex flex-col gap-2">
                        <span className="text-front text-lg font-medium">Bad Mobile Support, Sorry 🥺</span>
                        <span className="text-front text-base"> KRiT doesn't support mobile virtual keyboards, just yet. </span>
                        <span className="text-front/50 text-sm"> if you have an external keyboard you can ignore this. (probably)</span>
                    </div>
                    <button
                        className="hover text-sm  p-1 rounded-full bg-front/5 hover:bg-error/10 active:bg-front/20 transition-all duration-150"
                        onClick={() => setShowMobileWarning(false)}>
                        <BsX size={20} />
                    </button>
                </div>
                :
                <></>
        }</>
    )
}

export default MobileWarning