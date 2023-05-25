/* eslint-disable @next/next/no-img-element */

import { useSession } from "next-auth/react";
// import { type ReactNode } from "react";
import { cn } from "~/utils/fns";

// TODO: use next js image
// import Image from 'next/image';


interface Props {  
  src?: string | null
}

const Avatar = (props: Props) => {
  const {
    src
  } = props;

  const session = useSession()

  const path = (src ?? session.data?.user.image) || "/mesh-gradient.png"

  return (
    <div className={cn(
      "rounded-full overflow-clip"
    )}>
      <img
        src={src ?? path}
        alt={"user avatar"}
        className={cn()} />
    </div>
  )
}

export default Avatar
// export type AvatarProps = Props