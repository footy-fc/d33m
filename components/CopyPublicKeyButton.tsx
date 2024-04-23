import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';

const CopyPublicKeyButton = () => {
  const { ready, authenticated, user } = usePrivy();
  // Check that your user is authenticated
  const isAuthenticated = ready && authenticated;
  // Check that your user has an embedded wallet
  const hasEmbeddedWallet = !!user?.linkedAccounts.find(
    (account) => {
      if (account.type === 'wallet' && account.walletClient === 'privy') {
        return true; // Return true if the condition is met
      }
      return false; // Return false otherwise
    }
  );

  const [copySuccess, setCopySuccess] = useState(false);

  const copyPublicKey = () => {
    const publicKey = user?.wallet?.address || '';
    navigator.clipboard.writeText(publicKey).then(() => {
      console.log('Public key copied to clipboard:', publicKey);
      // Show a tooltip or message to indicate that the copy operation was successful
      // For example, you can set a state variable to show a message for a brief moment
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 1000); // Set duration to display the "Copied!" message
    }).catch((error) => {
      console.error('Failed to copy public key to clipboard:', error);
      // Handle any errors that may occur during copying
    });
  };

  return (
    <>
      {(!isAuthenticated || !hasEmbeddedWallet) ? (
        <span>Login first</span>
      ) : (
        <div >
            <button 
              className="bg-fontRed py-2 px-4 text-lightPurple text-md font-semibold rounded-lg transition-all duration-200 ease-in-out"
              onClick={copyPublicKey} 
              disabled={copySuccess} 
              style={{
                fontSize: '16px',
                padding: '8px 16px',
                borderRadius: '4px',
                }}>
              [ Copy Address ]
            </button>
            {copySuccess && <span className="text-green-500 ml-2">Copied!</span>}
        </div>
      )}
    </>
  );
};

export default CopyPublicKeyButton;
