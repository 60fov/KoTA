import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import { Toaster } from "sonner";

import "~/styles/globals.css";
import "~/styles/CmdK.scss";
import { KioContextProvider } from "~/utils/hooks";
import { useEffect, useState } from "react";
import { KeyboardInputObservable } from "~/utils/kio";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  const [kio, setKio] = useState<KeyboardInputObservable>()

  useEffect(() => {
    const kioInstance = new KeyboardInputObservable()
    setKio(kioInstance)
    
    return () => {
      kioInstance.destroy()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SessionProvider session={session}>
      <KioContextProvider value={kio}>
        <Toaster />
        <Component {...pageProps} />
      </KioContextProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
