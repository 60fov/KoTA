import { cn, copyToClipboard, getProfileUrl } from "~/utils/fns"
import { type CSSVariableProperties } from "~/utils/types"

interface Props {
  profilePic: string
  username: string
  wpm: number
  wordsTyped: number
  accuracy: number
}

export default function UserCard(props: Props) {
  const {
    profilePic,
    username,
    wpm,
    wordsTyped,
    accuracy,
  } = props

  return (
    <div className={cn(
      "flex overflow-clip isolate",
      "relative w-96  p-1",
      "rounded-xl",
      "bg-back text-front",
      "border-front/10 border-[0.5px]",
    )}>
      <div className={cn(
        "flex flex-col gap-4 p-6",
        "bg-back/90 rounded-lg"
      )}>
        <div className={cn(
          "-z-10 absolute top-0 left-0 bottom-0 right-0 object-cover",
          "blur-3xl saturate-150 scale-150 opacity-50"
        )}>
          <img className={cn("w-full h-full")} src={profilePic} alt="profile pic" />
        </div>
        <div
          className={cn(
            "w-full aspect-square",
            "rounded-xl overflow-clip",
            "rounded-tl-v rounded-br-v",
            // "border-front-alt/25 border-[0.5px]",
            "shadow-2xl"
          )}
          style={{ "--radius": "6em" } as CSSVariableProperties}
        >
          <img className={cn("w-full h-full object-cover")} src={profilePic} alt="profile pic" />
        </div>
        <div className={cn(
          "flex flex-col gap-4 grow"
        )}>
          <div>
            <span onClick={() => {
              const url = new URL('/user/ily', window.location.origin)
              void copyToClipboard(url.toString())
            }} className={cn(
              "text-3xl font-bold cursor-pointer"
            )}>@{username}</span>
            {/* <span className="text-xs text-front/25 font-semibold">{name}</span> */}
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-front/25 font-semibold">WPM</span>
              <span className="text-2xl font-semibold leading-none">{wpm}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-front/25 font-semibold">Words Typed</span>
              <span className="text-2xl font-semibold leading-none">{wordsTyped}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-front/25 font-semibold">Accuracy</span>
              <span className="text-2xl font-semibold leading-none">{(accuracy * 100).toFixed(0)}%</span>
            </div>
          </div>
          {/* <div>
            <div className={"flex text-sm"}>
              <div className={cn(
                "grid grid-flow-col gap-1 p-1",
                "border border-front rounded",
                "leading-none"
              )}>
                <span className="font-semibold">WPM</span>
                <span className={""}>{wpm}</span>
              </div>
              <div className={cn(
                "grid grid-flow-col gap-1 p-1",
                "border border-front rounded",
                "leading-none"
              )}>
                <span className="font-semibold"># Words Typed</span>
                <span className={""}>{wordsTyped}</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}