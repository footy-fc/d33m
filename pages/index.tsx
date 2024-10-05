import Chat from '../components/Chat'
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>d33m rooms</title>
        <meta name="description" content="Farcaster Pop-up Channels for Football Chat" />
        <meta property="og:image" content="https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_gif,w_168/https%3A%2F%2Fi.imgur.com%2F3Z3MaYU.gif" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta httpEquiv="Content-Security-Policy" 
        content="
          default-src * https://auth.privy.io/ https://verify.walletconnect.org/; 
          frame-src blob: https://localhost https://auth.privy.io/ https://verify.walletconnect.org/ https://*.frames.sh; 
          img-src 'self' * data: blob: https://localhost https://auth.privy.io/ https://verify.walletconnect.org/ https://*.frames.sh; 
          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; 
          script-src 'self' 'unsafe-inline' 'unsafe-eval';
          style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com;
        "/>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
    <Chat />
   </>
  )
}
