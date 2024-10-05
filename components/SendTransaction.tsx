import React, { useState } from "react";
import { User } from "@privy-io/react-auth";
import { parseEther } from 'viem'; // Assuming this is correct
import { ToastContentProps, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {
    user: User|null;
    sendTransaction: any;
    maxAmount: number;
};

const SendTransaction: React.FC<Props> = ({ user, sendTransaction, maxAmount }) => {
    const [sendTo, setSendTo] = useState('');
    const [amount, setAmount] = useState(maxAmount - 0.0001); // Default amount
    const notify = (message: string | number | boolean | null | undefined) => toast(message);

    const sendTx = async () => {
        try {
            if (!user?.wallet) {
                throw new Error('No wallet found.');
            }

            const weiValue = parseEther(amount.toString());
            const unsignedTx = {
                to: sendTo,
                chainId: 8453,
                value: weiValue,
            };
            const txUiConfig = {
                header: 'Send Transaction',
                description: `Send ${amount} ETH to ${sendTo}?`,
                button: 'Send',
            };

            await sendTransaction(unsignedTx, txUiConfig);
        } catch (error: any) {
            notify(error);
        }
    };

    const handleSendToChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setSendTo(inputValue);

        // Check if the input ends with ".ens"
        if (inputValue.endsWith('.eth')) {
            try {
                const response = await fetch(`https://ensdata.net/${inputValue}`);
                if (response.ok) {
                    const data = await response.json();
                    // Perform the desired action with the data
                    console.log(data);
                    setSendTo(data.address)
                } else {
                    notify('Failed to fetch ENS data.');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
        setAmount(event.target.value);
    };

    return (
        <>
        <div>
            <input
                type="text"
                className="bg-transparent border-b border-white text-white text-sm focus:outline-none mb-4"
                placeholder="ETH amount"
                style={{ width: '100%' }}
                value={amount}
                onChange={handleAmountChange}
            />
        </div>
        <div>
            <input
                type="text"
                className="bg-transparent border-b border-white text-white text-sm focus:outline-none mb-4"
                placeholder="Withdraw to account eg kmacb.eth"
                style={{ width: '100%' }}
                value={sendTo}
                onChange={handleSendToChange}
            />
        </div>
        <div>
            <button
                onClick={sendTx}
                disabled={!user?.wallet}
                className="bg-fontRed py-2 px-4 text-lightPurple text-md font-semibold rounded-lg transition-all duration-200 ease-in-out"
            >
            [ Send ]
            </button>
        </div>
        </>
    );
};

export default SendTransaction;
