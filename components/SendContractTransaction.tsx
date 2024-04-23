import React, { useState } from "react";
import { User } from "@privy-io/react-auth";
import { parseEther } from 'viem'; // Assuming this is correct
import { ToastContentProps, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {
    user: User;
    sendTransaction: any;
    maxAmount: number;
};

const SendContractTransaction: React.FC<Props> = ({ user, sendTransaction, maxAmount }) => {
    const [sendTo, setSendTo] = useState('');
    const [amount, setAmount] = useState(maxAmount); // Default amount
    const notify = (message: string | number | boolean | null | undefined) => toast(message);

    const sendTx = async () => {
        try {
            if (!user.wallet) {
                throw new Error('No wallet found.');
            }

            const weiValue = parseEther(amount.toString());
            const unsignedTx = {
                to: sendTo,
                chainId: 8453, // BASE_CHAIN_ID 8453
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


    return (
        <>
        <div>
            <button
                onClick={sendTx}
                disabled={!user.wallet}
                className="bg-fontRed py-2 px-4 text-lightPurple text-md font-semibold rounded-lg transition-all duration-200 ease-in-out"
            >
            [ Send ]
            </button>
        </div>
        </>
    );
};

export default SendContractTransaction;
