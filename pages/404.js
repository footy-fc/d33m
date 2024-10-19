// pages/404.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'; // Import the Head component

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the root ("/") when the 404 page is accessed
    //router.replace('/');
    const originalRoute = window.location.pathname;
    const formattedOriginalRoute = originalRoute.substring(1);

    router.replace({ pathname: '/', query: { channel: formattedOriginalRoute } });
 
  }, [router]);

  return (
    // Use the Head component to set the OG image meta tag
    <div>
     {/*  <Head>
            <meta property="og:image" content="https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_gif,w_168/https%3A%2F%2Fi.imgur.com%2F3Z3MaYU.gif" />
         </Head> */}
      {/* Your 404 content goes here */}
        <div className="max-w-[375px] mx-auto z-5000">
          <title>d33m rooms</title>
          <meta name="description" content="Join a Farcaster Footy Pop-up Channel and Chat" />
          <meta property="og:image" content="https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_gif,w_168/https%3A%2F%2Fi.imgur.com%2F3Z3MaYU.gif" />
          <link rel="icon" href="/favicon.ico" />
        </div>
    </div>
  );
}

