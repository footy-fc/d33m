"use client";
import React from 'react';
import Modal from 'react-modal';
import validTeamLogos from '../public/validTeams.json';
import { FrameUI } from './FrameUI';
import {
  fallbackFrameContext,
} from "@frames.js/render";
import { signFrameAction, FarcasterSigner } from '@frames.js/render/farcaster'
import { FrameImageNext } from "@frames.js/render/next";
import { FrameButton } from "frames.js";
import { useFrame } from "@frames.js/render/use-frame";
 

type FrameModalProps = {
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

const FrameModal: React.FC<FrameModalProps> = ({ isOpen, onRequestClose }) => {
    const farcasterSigner: FarcasterSigner = {
        fid: 1,
        status: 'approved',
        publicKey:
          "0x00000000000000000000000000000000000000000000000000000000000000000",
        privateKey:
          "0x00000000000000000000000000000000000000000000000000000000000000000",
      };
      
      const frameState = useFrame({
        // replace with your frame url
        homeframeUrl:
          "https://fc-polls.vercel.app/polls/73c6efda-bae7-4d46-8f36-3bb3b8377448",
        // corresponds to the name of the route for POST in step 3
        frameActionProxy: "/frames",
        connectedAddress: undefined,
        // corresponds to the name of the route for GET in step 3
        frameGetProxy: "/frames",
        frameContext: fallbackFrameContext,
        // map to your identity if you have one
        signerState: {
          hasSigner: farcasterSigner !== undefined,
          signer: farcasterSigner,
          onSignerlessFramePress: () => {
            // Only run if `hasSigner` is set to `false`
            // This is a good place to throw an error or prompt the user to login
            alert("A frame button was pressed without a signer. Perhaps you want to prompt a login");
          },
          signFrameAction: signFrameAction,
        },
      });  
  
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <div className="flex flex-col items-center bg-deepPink text-white font-semibold text-medium p-2 rounded-lg h-full">
                <button className="absolute top-0 right-0 text-lightPurple" onClick={onRequestClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="w-full flex flex-col gap-1">
                    <FrameUI frameState={frameState} theme={{}} FrameImage={FrameImageNext} />

                    <div className="ml-auto text-sm text-slate-500">
                    <a href={frameState.homeframeUrl} target="_blank" rel="noopener noreferrer">
                        {frameState.homeframeUrl}
                    </a>
                    </div>
                    </div>
            </div>
        </Modal>
    );
};

export default FrameModal;
