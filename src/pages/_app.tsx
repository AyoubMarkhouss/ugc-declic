import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/components/theme-provider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* <ThemeProvider attribute="class" defaultTheme="" enableSystem> */}
      <Component {...pageProps} />
      <Toaster />
      {/* </ThemeProvider> */}
    </>
  );
}
