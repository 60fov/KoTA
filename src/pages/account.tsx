import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { cn } from "~/utils/fns";
import { useSession } from "next-auth/react";
import Container from "~/components/ui/Container";
import Input from "~/components/ui/Input";
import Copy from "~/components/icons/Copy";
import Button from "~/components/ui/Button";
import Check from "~/components/icons/Check";
import { useEffect, useState } from "react";
import { HiArrowPath, HiXMark } from "react-icons/hi2";
import zchema from "~/utils/zchema";
import { useRouter } from "next/router";

const AcountPage: NextPage = () => {
  const router = useRouter()

  const session = useSession({
    required: true,
  })

  const user = session?.data?.user

  const [handleState, setHandleState] = useState(user?.handle || "")

  // 🤢
  useEffect(() => {
    if (user?.handle) {
      setHandleState(user.handle)
    }
  }, [user?.handle])

  const handleParseResult = zchema.userHandle.safeParse(handleState)

  // TODO: rate limit
  const { data: isHandleTaken, status: handleTakenStatus, error: handleTakenError } = api.user.isHandleTaken.useQuery(handleState, {
    refetchOnWindowFocus: false,
    enabled: (!!user && handleState !== user?.handle && handleParseResult.success),
    retry: false
  })

  const accountMutation = api.user.updateProfile.useMutation()

  const handleHandleChange: React.FormEventHandler<HTMLInputElement> = (e) => {
    const newHandle = e.currentTarget.value
    setHandleState(newHandle)
  }

  const handleInputSuffix = () => {
    if (!handleParseResult.success || isHandleTaken || handleTakenStatus === "error") {
      return <HiXMark />
    } if (handleTakenStatus === "loading") {
      if (user?.handle === handleState) {
        return null
      }
      return <HiArrowPath className={"animate-spin"} />
    }
    return <Check />
  }

  const handleStatus = () => {
    let message = "";
    let status: "error" | "success" | undefined;
    if (!handleParseResult.success) {
      const code = handleParseResult.error.errors[0]?.code
      if (code === "too_small") message = "too short"
      else if (code === "too_big") message = "too long"
      else message = "must contain only alphanumerics"
      status = "error"
    } else if (handleParseResult.data === user?.handle) {
      // do nothing
      // i dont like this in the middle of the pack but the alternatives seem worse
    } else if (handleTakenError?.data?.code === "BAD_REQUEST") {
      message = "invalid name, but something is wrong. refresh the page please."
      status = "error"
    } else if (handleTakenStatus === "success") {
      if (isHandleTaken) {
        message = "handle taken"
        status = "error"
      } else {
        message = "handle available"
        status = "success"
      }
    }
    return {
      status,
      message
    }
  }

  const copyId = async () => {
    try {
      const id = user?.id
      if (!id) {
        throw Error("id undefined")
      }
      await navigator.clipboard.writeText(id)
    } catch (err) {
      console.warn("failed to copy id")
      console.log(err)
    }
  }

  const handleAccountChange = () => {
    accountMutation.mutate({
      handle: handleState
    }, {
      onSuccess() {
        router.reload()
      }
    })
  }

  const handle = handleStatus()

  return (
    <>
      <Head>
        <title>KoTA My Account</title>
        <meta name="description" content="a Korean typing web app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={cn(
        "text-front p-8"
      )}>
        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <Container className={cn(
            "flex flex-col gap-4",
            "bg-back-alt/50 p-4"
          )}>
            <div className="rounded-full w-16 overflow-clip self-start">
              <img src={user?.image || ""} alt={"profile pic"} />
            </div>
            <Input
              label={"name"}
              defaultValue={user?.name || ""}
            />
            <Input
              // ref={refHandleInput}
              onChange={handleHandleChange}
              // onInput={handleUsernameInput}
              label={"handle"}
              defaultValue={user?.handle || ""}
              suffix={handleInputSuffix()}
              state={handle.status}
              status={handle.message}
            />
            <Input
              label={"id"}
              disabled
              value={user?.id || ""}
              suffix={
                <Copy
                  className="cursor-pointer"
                  onClick={() => void copyId()} />
              } />
            <div className="flex justify-end">
              <Button
                disabled={handle.status !== "success"}
                onClick={handleAccountChange}
                variant="cta">Save Changes</Button>
            </div>
          </Container>
        </div>
      </main>
    </>
  );
};

export default AcountPage;