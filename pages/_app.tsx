import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {makeTheme} from "@/utils/theme";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import {SessionProvider} from "next-auth/react";
import {useRouter} from 'next/router';
import {analytics} from '@/firebase';
import {logEvent} from 'firebase/analytics';

export default function App({ Component, pageProps }: AppProps) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const router = useRouter();

  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, []);

    useEffect(() => {
      if (process.env.APP_ENV_VALUE !== 'local') {
        const handleRouteChange = (url: string) => {
          if (analytics) {
            logEvent(analytics, 'page_view', {
              page_path: url,
            });
          }
        };

        router.events.on("routeChangeComplete", handleRouteChange);
          handleRouteChange(window.location.pathname);
            return () => {
              router.events.off("routeChangeComplete", handleRouteChange);
            };
        }
    }, [router.events]);

  const theme = makeTheme(mode);

  return (
      <SessionProvider session={pageProps.session}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header/>
          <Component {...pageProps} />
          <Footer/>
        </ThemeProvider>
      </SessionProvider>
  );
}
