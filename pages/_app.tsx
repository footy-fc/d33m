//import "../public/assets/fonts/Capsules.woff2"; // Replace with the actual CSS file path
//import "../public/assets/fonts/ChicagoFLF.woff"; // Replace with the actual CSS file path
// pages/_app.js

import 'tailwindcss/tailwind.css';
//import 'styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import { AppProps } from 'next/app';
import {PrivyProvider} from '@privy-io/react-auth';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    // Assuming your root element has the ID 'root'. Adjust if it's different.
    Modal.setAppElement('#__next');
  }, []);
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
      <Component {...pageProps} />
    </PrivyProvider>
  )
}

export default MyApp;
