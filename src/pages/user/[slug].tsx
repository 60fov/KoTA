import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { cn, groupBy } from "~/utils/fns";
import z from 'zod';
import Container from "~/components/ui/Container";
import { signIn, useSession } from "next-auth/react";
import zchema from "~/utils/zchema";
import { useRouter } from "next/router";
import Button from "~/components/ui/Button";
import Avatar from "~/components/ui/Avatar";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "~/hooks/useTheme";

type Props = {
  slug?: string
}

const LineChart = dynamic(() => import('~/components/dataviz/LineChart'), {
  ssr: false
})

const UserPage: NextPage<Props> = (props) => {
  const {
    slug: slugProp
  } = props

  useTheme()

  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()

  const slug = slugProp || "me"
  const queryParams = slug === "me" ? { id: session?.user.id } : parseSlug(slug)
  console.log(queryParams)

  const { data: profile, status: profileStatus } = api.user.getPublicProfile.useQuery(queryParams, {
    refetchOnWindowFocus: false,
    retry: (n, err) => {
      const code = err.data?.code
      return !(code === "BAD_REQUEST" || code === 'INTERNAL_SERVER_ERROR')
    },
    onError: (err) => {
      console.warn(err)
      // void router.push("404")
    },
    onSuccess: (data) => {
      if (queryParams.id && data.handle) {
        void router.push(`/user/${data.handle}`, undefined, { shallow: true })
      }
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

  function handleSignIn() {
    void signIn()
  }

  const chartData = useMemo(() => {
    const entries = stats?.wordEntries
    if (!entries) return

    const ndata = Object.values(groupBy(entries, entry => entry.createdAt.toISOString()))
      .map(group => {
        const avg = group.reduce((accum, entry) => {
          const accuracy = entry.length / entry.strokes
          console.log(accuracy)
          accum.acc += accuracy
          accum.createdAt = entry.createdAt
          return accum
        }, { acc: 0 } as { acc: number, size: number, createdAt: Date })
        avg.acc /= group.length
        avg.size = group.length
        return avg
      })

    const accData: Array<{ x: Date, y: number }> = []
    const sizeData: Array<{ x: Date, y: number }> = []

    for (let i = 0; i < ndata.length; i++) {
      const dp = ndata[i]
      if (!dp) continue
      accData.push({ x: dp.createdAt, y: dp.acc })
      sizeData.push({ x: dp.createdAt, y: dp.size })
    }

    console.log("ndata", ndata)
    console.log("acc", accData)
    console.log("size", sizeData)


    //   .reduce((accum, group) => {
    //     accum['accuracy'] ??= { id: 'accuracy', data: [] }
    //     accum['accuracy'].data.push({
    //       x: group.createdAt,
    //       y: group.acc
    //     })
    //     return accum
    //   }, {} as Record<string, { id: string, data: Array<{ x: string, y: number }> }>)

    // return Object.values(ndata)

    // const avgAccData = Object.values(accData.reduce((accum, point) => {
    //   const groupKey = point.x.toISOString()
    //   const group = accum[groupKey] ??= []
    //   group.push(point)
    //   return accum
    // }, {} as Record<string, Array<typeof accData[number]>>)
    // ).map((group) => {
    //   const point = group.reduce((accum, point) => {
    //     accum.y += point.y
    //     return accum
    //   })
    //   point.y /= group.length
    //   return point
    // })


    return [
      {
        id: "accuracy",
        data: accData
      },
      {
        id: "entries",
        data: sizeData
      },

    ]
  }, [stats])

  // RENDERS

  if (sessionStatus === "unauthenticated" && slug === "me") {
    return (
      <>
        <Head>
          <title>{`KoTA ${profile?.name || ""} not found`}</title>
          <meta name="description" content="a Korean typing web app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="h-screen flex items-center justify-center">
          <div className="text-front flex flex-col gap-2">
            {/* <span className="text-front text-3xl font-medium">To View Your profile</span> */}
            <Button onClick={handleSignIn}>sign-in</Button>
          </div>
        </main>
      </>
    )
  }


  if (profileStatus === "error") {
    return (
      <>
        <Head>
          <title>{`KoTA ${profile?.name || ""} not found`}</title>
          <meta name="description" content="a Korean typing web app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="h-screen flex items-center justify-center">
          <div className="text-front p-4 rounded-xl border border-front/10 bg-back-alt flex gap-1">
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
          <div className="text-front p-4 rounded-xl border border-front/10 bg-back-alt flex gap-1">
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
              "flex flex-col items-center justify-center gap-4"
            )}>
              <div className="w-16 rounded-full overflow-clip">
                <Avatar />
              </div>
              <div className="text-3xl">
                {profile?.name}
              </div>
            </Container>
            <Container className={" flex flex-col gap-4 items-center justify-center"}>
              <div className="text-5xl text-front font-bold">
                {stats?.wordCount}
              </div>
              <div className="text-2xl text-front-alt">
                Words Typed
              </div>
            </Container>
            <Container className={" flex flex-col gap-4 items-center justify-center"}>
              <div className="text-5xl text-front font-bold">
                {Math.trunc(stats?.wpm || 0).toLocaleString(undefined, {})}
              </div>
              <div className="text-2xl text-front-alt">
                WPM
              </div>
            </Container>
            <Container className={" flex flex-col gap-4 items-center justify-center"}>
              <div className="text-5xl text-front font-bold">
                {`${((stats?.acc || 0) * 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}%`}
              </div>
              <div className="text-2xl text-front-alt">
                Accuracy
              </div>
            </Container>
            <Container className={" flex flex-col gap-4 items-center justify-center col-span-2 p-4"}>
              {/* <div className=""> */}
              {chartData && <LineChart data={chartData} />}
              {/* </div> */}

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

// helper functions
function parseSlug(slug: string) {
  let id: string
  let handle: string

  const idParseResult = z.string().cuid().safeParse(slug)
  if (idParseResult.success) {
    id = idParseResult.data
    console.log("parsed id", id)
    return { id }
  }

  const handleParseResult = zchema.userHandle.safeParse(slug)
  if (handleParseResult.success) {
    handle = handleParseResult.data
    return { handle }
  }
  return {}
}