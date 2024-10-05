import React, { useRef, useState } from 'react';
import CopyPublicKeyButton from './CopyPublicKeyButton';
//import { ReactComponent as BaseLogo } from './assets/Base_Symbol_Blue.svg';

const Deposit: React.FC = () => {
    const [showInstructions, setShowInstructions] = useState(false);
    const instructionsRef = useRef<HTMLDivElement>(null);

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
    };

    return (
        <div className="bg-darkPurple hover:bg-darkPurple py-2 px-4 text-lightPurple text-md font-semibold rounded-lg transition-all duration-200 ease-in-out">
            <button className="text-limeGreenOpacity" onClick={toggleInstructions}>[ Deposit ]</button>
              {showInstructions && (
                <>
                <div ref={instructionsRef}>
                    <p>1 - Copy and paste the address as the recipient</p>
                    <p>2 - From your crypto wallet, select ETH on Base network</p>
                    <span dangerouslySetInnerHTML={{ __html: `<svg width="25" height="25" viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H3.9565e-07C2.35281 87.8625 26.0432 110.034 54.921 110.034Z" fill="#0052FF"/></svg>` }} />
                    <p>3 - Click "Send"</p>
                    <p>4 - Repeat with $moxie and $degen tokens if needed</p>
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
