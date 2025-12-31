import { useEffect } from 'react';
import '@/styles/globals.css';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app';
import { makeTheme } from '@/utils/theme';
import Footer from '../components/common/Footer';
import Header from '../components/common/Header';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import { logEvent } from 'firebase/analytics';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_APP_ENV_VALUE !== "production") return;

    let detach = () => {};

    (async () => {
      const { getAnalyticsInstance } = await import("@/firebase");
      const analytics = await getAnalyticsInstance();
      if (!analytics) return;

      const handleRouteChange = (url: string) => {
        logEvent(analytics, "page_view", { page_path: url });
      };

      router.events.on("routeChangeComplete", handleRouteChange);
      handleRouteChange(window.location.pathname);

      detach = () => router.events.off("routeChangeComplete", handleRouteChange);
    })();

    return () => detach();
  }, [router.events]);

  const theme = makeTheme('light');

  return (
      <SessionProvider session={pageProps.session}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header />
            <Component {...pageProps} />
            {router.pathname !== '/chat' && <Footer />}
          </ThemeProvider>
        </StyledEngineProvider>
      </SessionProvider>
  );
}
