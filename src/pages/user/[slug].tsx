import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { cn } from "~/utils/fns";
import z from 'zod';
import Container from "~/components/ui/Container";
import { useSession } from "next-auth/react";
import zchema from "~/utils/zchema";

type Props = {
  slug?: string
}

const UserPage: NextPage<Props> = (props) => {
  const {
    slug
  } = props

  const { data: session } = useSession()
  const id = session?.user.id

  const handleParseResult = zchema.userHandle.safeParse(slug)
  const handle = handleParseResult.success ? handleParseResult.data : undefined
  const me = slug === 'me'
  const queryParams = me ? { id } : { handle }

  const { data: profile, status: profileStatus } = api.user.getPublicProfile.useQuery(queryParams, {
    refetchOnWindowFocus: false,
    retry: (n, err) => {
      const code = err.data?.code
      return !(code === "BAD_REQUEST" || code === 'INTERNAL_SERVER_ERROR')
    },
    onError: (err) => {
      console.warn(err)
      // void router.push("404")
    }
  })

  const { data: stats } = api.user.getStats.useQuery(queryParams, {
    enabled: !!profile,
    refetchOnWindowFocus: false,
    // retry: false,
    onError: (err) => {
      console.warn(err)
    }
  })


  if (profileStatus === "error") {
    return (
      <>
        <Head>
          <title>{`KoTA ${profile?.name || ""} not found`}</title>
          <meta name="description" content="a Korean typing web app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="h-screen flex items-center justify-center">
          <div className="text-front p-4  rounded-xl border border-front/10 bg-back-alt flex gap-1">
            <span className="">user not found</span>
          </div>
        </main>
      </>
    )
  }

  if (profileStatus === "loading") {
    return (
      <>
        <Head>
          <title>{`KoTA`}</title>
          <meta name="description" content="a Korean typing web app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="h-screen flex items-center justify-center">
          <div className="text-front p-4  rounded-xl border border-front/10 bg-back-alt flex gap-1">
            <span className="">loading</span>
          </div>
        </main>
      </>
    )
  }

  if (profileStatus === "success") {
    return (
      <>
        <Head>
          <title>{`KoTA ${profile?.name || ""}`}</title>
          <meta name="description" content="a Korean typing web app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={cn(
          "h-screen text-front p-8"
        )}>
          <div className={cn(
            "grid [grid-auto-flow:row dense] [grid-template-columns:repeat(4,1fr)] gap-4 auto-rows-[200px]",
          )}>
            <Container className={cn(
              "aspect-square",
              "flex flex-col items-center justify-center gap-4"
            )}>
              <div className="w-16 rounded-full overflow-clip">
                <img className="object-cover" src={profile?.image || ""} alt="profile pic" />
              </div>
              <div className="text-3xl">
                {profile?.name}
              </div>
            </Container>
            <Container className={"aspect-square flex flex-col gap-4 items-center justify-center"}>
              <div className="text-5xl text-front font-bold">
                {stats?.wordCount}
              </div>
              <div className="text-2xl text-front-alt">
                Words Typed
              </div>
            </Container>
            <Container className={"aspect-square flex flex-col gap-4 items-center justify-center"}>
              <div className="text-5xl text-front font-bold">
                {Math.trunc(stats?.wpm || 0).toLocaleString(undefined, {})}
              </div>
              <div className="text-2xl text-front-alt">
                WPM
              </div>
            </Container>
            <Container className={"aspect-square flex flex-col gap-4 items-center justify-center"}>
              <div className="text-5xl text-front font-bold">
                {`${((stats?.acc || 0) * 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}%`}
              </div>
              <div className="text-2xl text-front-alt">
                Accuracy
              </div>
            </Container>
          </div>
        </main>
      </>
    );
  }

  return null
};

UserPage.getInitialProps = (ctx) => {
  const slug = z.string().parse(ctx.query['slug'])
  return {
    slug: slug ? slug : "me"
  }
}

export default UserPage;