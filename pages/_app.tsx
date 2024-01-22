

//import "../public/assets/fonts/Capsules.woff2"; // Replace with the actual CSS file path
//import "../public/assets/fonts/ChicagoFLF.woff"; // Replace with the actual CSS file path
// pages/_app.js

import 'tailwindcss/tailwind.css';
import 'styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    // Assuming your root element has the ID 'root'. Adjust if it's different.
    Modal.setAppElement('#__next');
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
