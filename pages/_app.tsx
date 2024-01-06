

//import "../public/assets/fonts/Capsules.woff2"; // Replace with the actual CSS file path
//import "../public/assets/fonts/ChicagoFLF.woff"; // Replace with the actual CSS file path

import 'tailwindcss/tailwind.css';
import "styles/globals.css";

import type { AppProps } from 'next/app'

// pages/_app.js

import 'tailwindcss/tailwind.css';
import 'styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return <Component {...pageProps} />;
}

export default MyApp;
