//import "../public/assets/fonts/Capsules.woff2"; // Replace with the actual CSS file path
//import "../public/assets/fonts/ChicagoFLF.woff"; // Replace with the actual CSS file path
// pages/_app.js

import 'tailwindcss/tailwind.css';
import '../styles/embedder.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import { AppProps } from 'next/app';
import {PrivyProvider} from '@privy-io/react-auth';
import Head from 'next/head';

//TODO Update OG and Twitter meta tags with d33m info and icons

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    // Assuming your root element has the ID 'root'. Adjust if it's different.
    Modal.setAppElement('#__next');
  }, []);
  console.log('d33m is hobby project that is under development. If you run into issues dm @kmacb.eth on Farcaster. The console log msg may help debug.')
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      onSuccess={() => router.push('/?channel=gantry')}
      
      config={{
        appearance: {
          theme: `#${'181424'}`, 
        },  
        loginMethods: ['farcaster']

       /*  externalWallets: { 
          coinbaseWallet: { 
            // Valid connection options include 'eoaOnly' (default), 'smartWalletOnly', or 'all'
            connectionOptions: 'all', 
          }, 
        },  */
       /*  embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          //showWalletLoginFirst: false,
          // waitForTransactionConfirmation: false,
          // noPromptOnSignature: true,
        }, */
      }}
    >
      <Head>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>d33m rooms - Footy Watch Parties</title>
  <meta name="description" content="Join footy watch parties and more in d33m rooms." />
  <meta
          property="og:image"
          content="/512.png"
        />
  <link rel="shortcut icon" href="/favicon.ico" />

  {/* Icons for various platforms */}
  <link rel="mask-icon" href="/icons/mask-icon.svg" color="#000000" />
  <meta name="theme-color" content="#BD195D" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

  <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
  <link
    rel="apple-touch-icon"
    sizes="152x152"
    href="/icons/touch-icon-ipad.png"
  />
  <link
    rel="apple-touch-icon"
    sizes="180x180"
    href="/icons/touch-icon-iphone-retina.png"
  />
  <link
    rel="apple-touch-icon"
    sizes="167x167"
    href="/icons/touch-icon-ipad-retina.png"
  />
  <link rel="manifest" href="/manifest.json" />

  {/* Twitter metadata */}
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:url" content="https://yourdomain.com" />
  <meta name="twitter:title" content="d33m rooms - Footy Watch Parties" />
  <meta name="twitter:description" content="Join footy watch parties and more in d33m rooms." />
  <meta name="twitter:image" content="/icons/twitter.png" />
  <meta name="twitter:creator" content="@YourTwitterHandle" />

  {/* Open Graph metadata */}
  <meta property="og:type" content="website" />
  <meta property="og:title" content="d33m rooms - Footy Watch Parties" />
  <meta property="og:description" content="Join footy watch parties and more in d33m rooms." />
  <meta property="og:site_name" content="d33m rooms" />
  <meta property="og:url" content="https://yourdomain.com" />
  <meta property="og:image" content="/icons/og.png" />

  {/* Apple splash screen images */}
  <link
    rel="apple-touch-startup-image"
    href="/images/apple_splash_2048.png"
    sizes="2048x2732"
  />
  <link
    rel="apple-touch-startup-image"
    href="/images/apple_splash_1668.png"
    sizes="1668x2224"
  />
  <link
    rel="apple-touch-startup-image"
    href="/images/apple_splash_1536.png"
    sizes="1536x2048"
  />
  <link
    rel="apple-touch-startup-image"
    href="/images/apple_splash_1125.png"
    sizes="1125x2436"
  />
  <link
    rel="apple-touch-startup-image"
    href="/images/apple_splash_1242.png"
    sizes="1242x2208"
  />
  <link
    rel="apple-touch-startup-image"
    href="/images/apple_splash_750.png"
    sizes="750x1334"
  />
  <link
    rel="apple-touch-startup-image"
    href="/images/apple_splash_640.png"
    sizes="640x1136"
  />
</Head>

      <Component {...pageProps} />
    </PrivyProvider>
  )
}

export default MyApp;
