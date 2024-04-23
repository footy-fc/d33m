import Link from "next/link";
import { useExperimentalFarcasterSigner, usePrivy } from "@privy-io/react-auth";
import CreateWalletButton from "./CreateWalletButton";
import ExportWalletButton from "./ExportWalletButton";
import CreateLoginButton from "./CreateLoginButton";
import CopyPublicKeyButton from "./CopyPublicKeyButton";
import GetBalance from "./GetBalance";
import { useEffect, useState } from "react";
import SetupAI from "./SetupAI";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
//import SendTransaction from "./SendTransaction";

const Privy = () => {
  const { ready, authenticated, user, logout, sendTransaction } = usePrivy();
  const { requestFarcasterSigner } = useExperimentalFarcasterSigner();
  const [openAiApiKey, setApiKey] = useState(''); 
  const [apiKeyVisible, setApiKeyVisible] = useState(false); // Initialize as hidden

  useEffect(() => {
    const apiKey = getApiKeyFromLocalStorage();
    setApiKey(apiKey || ''); // Use an empty string as the default value or boom
  }, []);

  useEffect(() => {
    const storedApiKey = getApiKeyFromLocalStorage();
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const setApiKeyToLocalStorage = (apiKey: string) => {
    localStorage.setItem('chatgpt-api-key', apiKey);
  };

  const getApiKeyFromLocalStorage = () => {
    return localStorage.getItem('chatgpt-api-key');
  };

  const handleApiKeyChange = (e: { target: { value: any; }; }) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    setApiKeyToLocalStorage(newApiKey);
  };
  
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
            className="mt-2 mb-2"
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
            onClick={() => requestFarcasterSigner()}
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
