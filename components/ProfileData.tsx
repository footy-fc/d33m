import React, { useState, useRef, useEffect } from 'react';
import UpdateProfileUrl from './UpdateProfileUrl';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { User } from "@privy-io/react-auth";

type Props = {
    user: User|null;
};

const ProfileData: React.FC<Props> = ({ user }) => {
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

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        toggleInstructions(); // Toggle instructions when the button is clicked
    };

    const handleInstructionsClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation(); // Prevent propagation when clicking inside the instructions div
    };

    return (
        <div className="bg-darkPurple hover:bg-darkPurple py-2 px-4 text-lightPurple text-md font-semibold rounded-lg transition-all duration-200 ease-in-out">
            <button className="text-fontRed" onClick={handleButtonClick}>[ Update Profile ]</button>
            {showInstructions && (
                <div ref={instructionsRef} onClick={handleInstructionsClick}>
                    <p>Add website to your Farcaster Profile</p>
                    <UpdateProfileUrl user={user} />
                </div>
            )}
        </div>
    );
};

export default ProfileData;
