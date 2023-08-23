import { type NextPage } from "next";
import { type AppProps } from "next/app";

import { api } from "~/utils/api";
import { KioContextProvider, useKio } from "~/hooks/kio";

import { Toaster } from "sonner";

import "~/styles/globals.css";
import "~/styles/CmdK.scss";

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp = ({
  Component,
  pageProps
}: AppPropsWithLayout) => {

  const kio = useKio()

  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <KioContextProvider value={kio}>
      <Toaster />
      {getLayout(<Component {...pageProps} />)}
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
    </KioContextProvider>
  );
};

export default api.withTRPC(MyApp);


const themeScript = `(function () {
  const html = document.documentElement
  function setTheme(theme) {
    html.setAttribute("data-theme", theme)
    localStorage.setItem("theme", JSON.stringify({ state: { value: theme }, version: 0 }))
  }
  let localTheme;
  try {
    const lsTheme = JSON.parse(localStorage.getItem("theme"))
    localTheme = lsTheme?.state?.value
  } catch (err) { }

  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const preferredTheme = media.matches ? 'dark' : 'light'
  html.style.colorScheme = preferredTheme

  if (localTheme === undefined || localTheme === "system") {
    setTheme(preferredTheme)
  } else {
    setTheme(localTheme)
  }
})()`;