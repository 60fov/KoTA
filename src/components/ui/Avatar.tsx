import { useSession } from "next-auth/react";
import { type ReactNode } from "react";
import { cn } from "~/utils/fns";

// TODO: use next js image
// import Image from 'next/image';


// interface Props {  
// }

const Avatar = (/*props: Prop*/) => {
  // const {
  //   ...restProps
  // } = props;

  const session = useSession()

  const path = session.data?.user.image || "/mesh-gradient.png"

  return (
    <div className={cn(
      "rounded-full overflow-clip"
    )}>
      <img
        src={path}
        alt={"user avatar"}
        className={cn()} />
    </div>
  )
}

export default Avatar
// export type AvatarProps = Props