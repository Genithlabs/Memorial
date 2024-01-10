import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {makeTheme} from "@/utils/theme";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import { Provider } from 'react-redux';
import {persistor, store} from "../store/store";
import {PersistGate} from "redux-persist/integration/react";

export default function App({ Component, pageProps }: AppProps) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, []);

  const theme = makeTheme(mode);

  return (
      <Provider store={store}>
          <PersistGate persistor={persistor}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Header/>
                <Component {...pageProps} />
                <Footer/>
              </ThemeProvider>
          </PersistGate>
      </Provider>
  );
}
