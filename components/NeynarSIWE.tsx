import Script from "next/script";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

declare global {
  interface Window {
    onSignInSuccess: (data: any) => void;
  }
}

const NeynarSIWE = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Define the success callback function
    window.onSignInSuccess = function (data) {
      localStorage.setItem("neynar-SignInData", JSON.stringify(data));
    };

    // Set script loaded status to true once the script is loaded
    setScriptLoaded(true);
  }, []);

  const isSignInDataPresent = localStorage.getItem("neynar-SignInData") !== null;

  return (
    <>
      <div className="p-4 flex flex-col items-center justify-center">
        <div style={{ height: "auto", margin: "0 auto", maxWidth: 190, width: "100%" }}>
          {scriptLoaded && !isSignInDataPresent && (
            <>
              <Script src="https://neynarxyz.github.io/siwn/raw/1.2.0/index.js" strategy="lazyOnload" />
              <div
                className="neynar_signin"
                data-client_id="57c4352e-0904-4a16-8be9-80b42d24feb9"
                data-neynar_login_url="https://app.neynar.com/login"
                data-success-callback="onSignInSuccess"
                data-theme="light"
                data-variant="farcaster"
                data-logo_size="24px"
                data-border_radius="10px"
              ></div>
              <div className="flex flex-col items-center">
              <div className="ml-2">
                <Link href="https://www.farcaster.xyz/apps" className="flex items-center">
                  <div className="text-md text-fontRed font-medium"> 
                    Need an account?
                  </div>
                </Link>
              </div>
            </div>
            </>
          )}
          {!isSignInDataPresent && !scriptLoaded && (
            <div className="text-gray-400">Loading Neynar sign-in component...</div>
          )}
        </div>
      </div>
    </>
  );
  
  
  
};

export default NeynarSIWE;
