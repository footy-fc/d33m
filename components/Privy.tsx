import Link from "next/link";
import { useExperimentalFarcasterSigner, usePrivy } from "@privy-io/react-auth";

const Privy = () => {
  const {login} = usePrivy();
  const { ready, authenticated, user, logout } = usePrivy();
  const { requestFarcasterSigner } = useExperimentalFarcasterSigner();
  
  const farcasterAccount = user?.linkedAccounts.find((account) => account.type === 'farcaster');
  return (
    <>
      {ready && !authenticated ? (
       <div className="flex items-center justify-center">
       <div>
         <div className="flex justify-center text-center">
           <button
             className="hover:bg-darkPurple py-2 px-4 text-lightPurple text-md font-semibold rounded-lg transition-all duration-200 ease-in-out"
             onClick={login}
           >
             [ Login with Farcaster ]
           </button>
         </div>
       </div>
       <div className="flex flex-col items-center">
         <div className="ml-2">
           <Link href="https://www.farcaster.xyz/apps" className="flex items-center">
             <div className="hover:bg-darkPurple py-2 px-4 text-lightPurple text-md font-semibold rounded-lg transition-all duration-200 ease-in-out"> 
               [ Need an account? ]
             </div>
           </Link>
         </div>
       </div>
     </div>
      ) : (ready && authenticated) ? (
        <div className="p-4 flex flex-col items-center justify-center">
          <div style={{ height: "auto", margin: "0 auto", maxWidth: 190, width: "100%" }}>
           {/*  <div className="mt-6 flex justify-center text-center">
              <button
                className="bg-violet-600 hover:bg-violet-700 py-3 px-6 text-white rounded-lg"
                onClick={logout}
              >
                Log out {user?.farcaster?.displayName}
              </button>
            </div> */}
            
            {// @ts-ignore
            !farcasterAccount || !farcasterAccount?.signerPublicKey && (
              <button 
                className="bg-fontRed text-white font-semibold py-2 px-4 rounded-lg" 
                onClick={() => requestFarcasterSigner()}
                // @ts-ignore
                disabled={!farcasterAccount || farcasterAccount?.signerPublicKey}
              >
                Authorize Farcaster
              </button>
            )}
            {/* <button 
              className="bg-fontRed text-white font-semibold py-2 px-4 rounded-lg" 
              disabled={!(ready && authenticated)} 
              onClick={createWallet}
            >
              Create a wallet
            </button> */}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Privy;
