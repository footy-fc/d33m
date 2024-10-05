
import { CastLengthLimit } from "../constants/constants";
//import { useEffect, useState } from 'react';
import { parseUnits } from 'viem';
//import { ethers } from "ethers";


const sendTip = async (
    newPost: string, 
    setNewPost: React.Dispatch<React.SetStateAction<string>>,
    setRemainingChars: React.Dispatch<React.SetStateAction<number>>,
    ready: boolean,
    address: string|undefined,
    sendTransaction: any,
    notify: (message: string | number | boolean | null | undefined) => void, // Pass notify function as an argument
) => {
    //const mintPost = /^\/tip\s/;    
    let txReceipt: any;

    if (!ready) {
        return;
    } else {
        await setup();
        if (txReceipt) {
            console.log("sendTip: txReceipt: ", txReceipt);
            const castThis = "I tipped 50 Moxie to the d33m team. " + `https://basescan.org/tx/${txReceipt.transactionHash}` + " https://d33m.com";
            setNewPost(castThis)
            setRemainingChars(CastLengthLimit);  
        } else {
            setNewPost("");
            setRemainingChars(CastLengthLimit);
        };
    };
    async function setup() {    
        console.log("sendTip: setup: ", newPost, ready, address);   
        function hexZeroPad(value: string, length: number): string {
            if (value.length >= length) {
                return value;
            }
            const paddedValue = '0'.repeat(length - value.length) + value;
            return paddedValue;
        }
        function toHexString(byteArray: Uint8Array): string {
            return Array.from(byteArray, (byte: number) => {
                return ('0' + (byte & 0xFF).toString(16)).slice(-2);
            }).join('');
        }
                
        try {
            if (!address) {
                notify('No wallet found.');
            }
            const sendThisToken = '0x8C9037D1Ef5c6D1f6816278C7AAF5491d24CD527';//moxie
            //'0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed'; // degen token address
            const degenTokenAmount = '50'; // token amount

            const reciever ='0x35Ea81cb0B759df6B2D2E6eC69DF1C5F3B3a30D1'; // contract or eoa            
            const tokenAmount = parseUnits(degenTokenAmount, 18); 
            const sendToHex = reciever.slice(2); // Convert sendTo to hex
            const functionSelector = '0xa9059cbb'; // Transfer function 0xa9059cbb
            const paddedSendTo = hexZeroPad(sendToHex, 64); // Pad the hexadecimal representation of sendTo
                    
            const tokenAmountHex = tokenAmount.toString(16); // Convert to hexadecimal string
            const paddedTokenAmountHex = hexZeroPad(tokenAmountHex, 64); // Pad to 32 bytes (64 characters)
            const data = functionSelector + paddedSendTo + paddedTokenAmountHex;
            console.log("sendTip: data: ", data);
        
            const unsignedTx = {
                to: sendThisToken,
                chainId: 8453, // BASE_CHAIN_ID 8453, 84531 for testnet
                value: '0x0', // For token transactions, set value to zero
                data: data,
                gasLimit: 210000, // Set gas limit to 210000
            };
            const txUiConfig = {
                header: 'Tip Transaction',
                description: `Send ${degenTokenAmount} Moxie to d33m team?`,
                buttonText: 'Tip d33m team',
            };
            setNewPost(`Transaction is processing: ${degenTokenAmount} Moxie. Please wait..`)
            txReceipt = await sendTransaction(unsignedTx, txUiConfig);
            return txReceipt;
        } catch (error: any) {
            notify(error);
        }
    };
};

export default sendTip;
