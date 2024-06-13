import Link from "next/link";
import { useExperimentalFarcasterSigner, usePrivy } from "@privy-io/react-auth";
import CreateWalletButton from "./CreateWalletButton";
import ExportWalletButton from "./ExportWalletButton";
import CreateLoginButton from "./CreateLoginButton";
import GetBalance from "./GetBalance";
import SetupAI from "./SetupAI";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
//import SendTransaction from "./SendTransaction";

const Privy = () => {
  const { ready, authenticated, user, logout, sendTransaction } = usePrivy();
  const { requestFarcasterSignerFromWarpcast } = useExperimentalFarcasterSigner();


  
  const farcasterAccount = user?.linkedAccounts.find((account) => account.type === 'farcaster');
  return (
  <>
  {ready && !authenticated ? (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-start"> {/* Use flex-col to stack items vertically */}
        <CreateLoginButton />
        <div className="">
          <Link href="https://www.farcaster.xyz/apps" className="flex items-center">
            <div className="bg-darkPurple py-2 px-4 text-lightPurple text-md font-semibold rounded-lg transition-all duration-200 ease-in-out mb-4"> 
              [ Need an account? ]
            </div>
          </Link>
        </div>
        <div className="text-notWhite text-md font-semibold mb-4 mt-10"> 
          <SetupAI />        
        </div>
      </div>
    </div>
  ) : (ready && authenticated) ? (
    <div className="flex items-center justify-center flex-col"> 
      <div className="text-notWhite text-md font-semibold mb-4 mr-4 mt-4"> 
        <GetBalance />
      </div>
      <div className="mb-4">
        <Deposit />
      </div>
      <div className="mb-4">
        <Withdraw user={user}/>
      </div>

      <div className="text-notWhite text-md font-semibold mb-4 mt-10"> 
        <SetupAI />
      </div>

      <div className="bg-darkPurple py-2 px-4 text-lightPurple text-md font-semibold rounded-lg transition-all duration-200 ease-in-out mb-4">
          <p>
          <button
            onClick={logout}
          >
            [ Logout {user?.farcaster?.displayName} ]
          </button>
        </p>
      </div>

      <div className="bg-darkPurple hover:bg-darkPurple py-2 px-4 text-lightPurple text-md font-semibold rounded-lg transition-all duration-200 ease-in-out mb-4">
        <ExportWalletButton />
      </div>

      {// @ts-ignore
      !farcasterAccount || !farcasterAccount?.signerPublicKey && (
        <div>
          <button 
            className="bg-darkPurple py-2 px-4 text-lightPurple text-md font-semibold rounded-lg transition-all duration-200 ease-in-out"
            onClick={() => requestFarcasterSignerFromWarpcast()}
            // @ts-ignore
            disabled={!farcasterAccount || farcasterAccount?.signerPublicKey}
          >
            [ Authorize Farcaster ]
          </button>
          {/* <CreateWalletButton /> */}
        </div>
      )}
    </div>
  ) : null}
  </>
  );
};

export default Privy;
