import { cn } from "~/utils/fns"
import { CSSVariableProperties } from "~/utils/types"

interface Props {
  username: string
  wpm: number
  wordsTyped: number
  profilePic: string
}

export default function UserCard(props: Props) {
  const {
    username,
    wpm,
    wordsTyped,
    profilePic,
  } = props

  return (
    <div className={cn(
      "flex overflow-clip isolate",
      "relative w-96 aspect-[9/13] p-1",
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
          "flex flex-col justify-between grow"
        )}>
          <p className={cn(
            "text-3xl font-bold"
          )}>{username}</p>
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