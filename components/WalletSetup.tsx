import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import ExportWalletButton from './ExportWalletButton';
import CreateWalletButton from './CreateWalletButton';
import { useExperimentalFarcasterSigner, usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import Privy from './Privy';

type WalletModalProps = {
    isOpen: boolean;
    onRequestClose: () => void;
};

const customStyles = {
  overlay: {
      zIndex: 15
  },
  content: {
      zIndex: 15,
  }
};

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onRequestClose }) => {
    //const {login} = usePrivy();
    const { ready, authenticated, user, logout, createWallet } = usePrivy();
    const { requestFarcasterSignerFromWarpcast } = useExperimentalFarcasterSigner();
    const farcasterAccount = user?.linkedAccounts.find((account: { type: string; }) => account.type === 'farcaster');
    const [copySuccess, setCopySuccess] = useState(false);
    const GetPublicKey = () => {
      const publicKey = user?.wallet?.address || '';
        // useEffect to reset copySuccess after a brief moment
        useEffect(() => {
          let timer: NodeJS.Timeout | null = null;
          if (copySuccess) {
            timer = setTimeout(() => {
              setCopySuccess(false);
            }, 2000); // Adjust the duration as needed
          }
          return () => {
            if (timer) clearTimeout(timer);
          };
        }, []);
      return ` ${publicKey.substring(0, 5)}....${publicKey.substring(publicKey.length - 4)}`;
    };

    const copyPublicKey = () => {
      const publicKey = user?.wallet?.address || '';
      navigator.clipboard.writeText(publicKey).then(() => {
        console.log('Public key copied to clipboard:', publicKey);
        // Show a tooltip or message to indicate that the copy operation was successful
        // For example, you can set a state variable to show a message for a brief moment
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
        }, 1000); 
      }).catch((error) => {
        console.error('Failed to copy public key to clipboard:', error);
        // Handle any errors that may occur during copying
      });
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
          <div className=" bg-deepPink text-white font-semibold text-medium p-2 rounded-lg h-full overflow-y-auto">
            <button className="absolute top-0 right-0 text-lightPurple" onClick={onRequestClose}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Privy />
          </div>
        </Modal>
    );
};  


export default WalletModal;