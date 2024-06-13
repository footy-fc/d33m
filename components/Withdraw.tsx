import React, { useState, useRef, useEffect } from 'react';
import SendTransaction from './SendTransaction';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { User } from "@privy-io/react-auth";

type Props = {
    user: User|null;
};

const Withdraw: React.FC<Props> = ({ user }) => {
    const [showInstructions, setShowInstructions] = useState(false);
    const instructionsRef = useRef<HTMLDivElement>(null);
    const { sendTransaction } = usePrivy();
    const [amount, setAmount] = useState('');
    const [walletBalance, setWalletBalance] = useState<number>(0); // Ensure walletBalance is initialized as a number
    const [embeddedWallet, setEmbeddedWallet] = useState<any>("");
    const { ready } = usePrivy();
    const { wallets } = useWallets();

    useEffect(() => {
        if (!ready) {
            return;
        } else {
            setup();
        }

        async function setup() {
            const embedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');

            if (embedWallet) {
                const provider = embedWallet.getEthereumProvider();
                (await provider).request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: `0x${Number(8453).toString(16)}` }],
                });

                const ethProvider = await embedWallet.getEthereumProvider();
                const walletBalance = await ethProvider.request({
                    method: 'eth_getBalance',
                    params: [embedWallet.address, 'latest']
                });

                const formattedBalance = Number(walletBalance) / 10 ** 18;
                setWalletBalance(formattedBalance);
                setEmbeddedWallet(embedWallet);
            }
        }
    }, [ready, wallets]); // Remove walletBalance from the dependency array

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
    };

    const handleToAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // No need to prevent propagation here
    };

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // No need to prevent propagation here
    };

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        toggleInstructions(); // Toggle instructions when the button is clicked
    };

    const handleInstructionsClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation(); // Prevent propagation when clicking inside the instructions div
    };

    return (
        <div className="bg-darkPurple hover:bg-darkPurple py-2 px-4 text-lightPurple text-md font-semibold rounded-lg transition-all duration-200 ease-in-out">
            <button className="text-fontRed" onClick={handleButtonClick}>[ Withdraw ]</button>
            {showInstructions && (
                <div ref={instructionsRef} onClick={handleInstructionsClick}>
                    <p>Make sure you are sending ETH to a Wallet supporting Base network</p>
                    <span dangerouslySetInnerHTML={{ __html: `<svg width="25" height="25" viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H3.9565e-07C2.35281 87.8625 26.0432 110.034 54.921 110.034Z" fill="#0052FF"/></svg>` }} />
                    <SendTransaction user={user} sendTransaction={sendTransaction} maxAmount={walletBalance} />
                </div>
            )}
        </div>
    );
};

export default Withdraw;
