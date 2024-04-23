import React from 'react';
import { usePrivy } from '@privy-io/react-auth';

const CreateWalletButton = () => {
  const { ready, authenticated, user, createWallet } = usePrivy();
  const isAuthenticated = ready && authenticated;
  const hasEmbeddedWallet = !!user?.linkedAccounts.find(
    (account) => account.type === 'wallet' && account.walletClient === 'privy'
  );
  return (
    <>
      {(!isAuthenticated || !hasEmbeddedWallet) ? (
        <span>Login first</span>

      ) : (
        <button
          className="hover:bg-darkPurple py-2 px-4 text-lightPurple text-md font-semibold rounded-lg transition-all duration-200 ease-in-out"
          disabled={!isAuthenticated || !hasEmbeddedWallet}
          onClick={createWallet}
        >
          [ Create a wallet ]
        </button>
      )}
    </>
  );
};

export default CreateWalletButton;
