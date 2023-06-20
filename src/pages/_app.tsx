import { type NextPage } from "next";
import { type AppProps } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";
import { KioContextProvider, useKio } from "~/utils/hooks/kio";

import { Toaster } from "sonner";

import "~/styles/globals.css";
import "~/styles/CmdK.scss";


export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps<{ session: Session | null }> & {
  Component: NextPageWithLayout
}

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {

  const kio = useKio()

  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <SessionProvider session={session}>
      <KioContextProvider value={kio}>
        <Toaster />
        {getLayout(<Component {...pageProps} />)}
      </KioContextProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
