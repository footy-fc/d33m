/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useExperimentalFarcasterSigner, usePrivy } from "@privy-io/react-auth";
import CreateWalletButton from "./CreateWalletButton";
import ExportWalletButton from "./ExportWalletButton";
import CreateLoginButton from "./CreateLoginButton";
import GetBalance from "./GetBalance";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";

const Privy = () => {
  const { ready, authenticated, user, logout, sendTransaction } = usePrivy();
  const { requestFarcasterSignerFromWarpcast } = useExperimentalFarcasterSigner();
  
  const farcasterAccount = user?.linkedAccounts.find((account) => account.type === 'farcaster');

  return (
    <>
      {ready && !authenticated ? (
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-start">
            <CreateLoginButton />
            <div>
              <Link href="https://www.farcaster.xyz/apps">
                <div className="bg-darkPurple py-2 px-4 text-lightPurple text-md font-semibold rounded-lg transition-all duration-200 ease-in-out mb-4">
                  [ Need an account? ]
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : (ready && authenticated) ? (
        <div className="flex items-center justify-center flex-col p-6 bg-darkPurple rounded-lg shadow-lg">
          {/* Profile Section */}
          <div className="bg-deepPink p-4 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center space-x-4 mb-6">
              {/* Display picture */}
              <img
                src={user?.farcaster?.pfp || "/default-profile.png"} 
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-darkPurple"
              />
              <div>
                {/* Display name */}
                <h2 className="text-lg font-semibold text-lightPurple">{user?.farcaster?.displayName || "User"}</h2>
                {/* @ts-ignore */}
                <p className="text-limeGreenOpacity">@{farcasterAccount?.username || "farcasterUser"}</p>
              </div>
            </div>

            {/* Balance */}
            <div className="text-notWhite text-md font-semibold mb-4">
              <GetBalance />
            </div>

            {/* Deposit */}
            <div className="mb-4">
              <Deposit />
            </div>

            {/* Withdraw */}
            <div className="mb-4">
              <Withdraw user={user} />
            </div>

            {/* Export Wallet Button */}
            <div className="bg-darkPurple py-2 px-4 text-lightPurple text-md font-semibold rounded-lg transition-all duration-200 ease-in-out mb-4">
              <ExportWalletButton />
            </div>

            {/* Authorize Farcaster */}
            {/* @ts-ignore */}
            {(!farcasterAccount || !farcasterAccount?.signerPublicKey) && (
              <div className="text-notWhite text-md font-semibold mb-4 flex flex-col">
                <p>Step 2: Authorize Farcaster to Cast</p>
                <button
                  className="bg-darkPurple py-2 px-4 text-lightPurple text-md font-semibold rounded-lg transition-all duration-200 ease-in-out mt-2"
                  onClick={() => requestFarcasterSignerFromWarpcast()}
                  // @ts-ignore
                  disabled={!farcasterAccount || Boolean(farcasterAccount?.signerPublicKey)}
                >
                  [ Authorize Farcaster ]
                </button>
              </div>
            )}

            {/* Logout */}
            <div className="bg-darkPurple py-2 px-4 text-lightPurple text-md font-semibold rounded-lg transition-all duration-200 ease-in-out mt-6">
              <button onClick={logout}>
                [ Logout {user?.farcaster?.displayName} ]
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Privy;
