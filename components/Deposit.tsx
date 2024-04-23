import React, { useRef, useState } from 'react';
import CopyPublicKeyButton from './CopyPublicKeyButton';

const Deposit: React.FC = () => {
    const [showInstructions, setShowInstructions] = useState(false);
    const instructionsRef = useRef<HTMLDivElement>(null);

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
    };

    return (
        <div className="bg-darkPurple hover:bg-darkPurple py-2 px-4 text-lightPurple text-md font-semibold rounded-lg transition-all duration-200 ease-in-out">
            <button className="text-limeGreenOpacity" onClick={toggleInstructions}>[ Depost ]</button>
              {showInstructions && (
                <>
                <div ref={instructionsRef}>
                    <p>1 - Copy and paste the address as the recipient</p>
                    <p>2 - From your crypto wallet, select ETH on Base network</p>
                    <p>3 - Click "Send"</p>
                    <div className="text-lightPurple text-sm font-semibold mt-2">
                        <CopyPublicKeyButton />
                    </div>
                </div>
                </>
            )}
        </div>
    );
};

export default Deposit;
