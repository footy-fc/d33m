import React, { useState } from "react";
import { useFarcasterSigner, User } from "@privy-io/react-auth";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ExternalEd25519Signer, HubRestAPIClient } from '@standard-crypto/farcaster-js-hub-rest';
import { FarcasterNetwork, makeUserDataAdd, Message, UserDataType } from "@farcaster/core";
import { FarcasterHub } from "../constants/constants";

type Props = {
  user: User | null;
};

const UpdateProfileUrl: React.FC<Props> = ({ user }) => {
  const [urlIPNS, setUrlIPNS] = useState('');
  const [message, setMessage] = useState('');
  const { getFarcasterSignerPublicKey, signFarcasterMessage } = useFarcasterSigner();
  const privySigner = new ExternalEd25519Signer(signFarcasterMessage, getFarcasterSignerPublicKey);

  const notify = (message: string) => toast(message);

  // Function to write user data
  const writeUserData = async (type: UserDataType, value: string) => {
    if (!user?.farcaster?.fid) {
      notify('User FID is missing.');
      return;
    }

    const userDataMessage = await makeUserDataAdd(
      { type, value },
      { fid: user.farcaster.fid, network: FarcasterNetwork.MAINNET },
      privySigner
    );

    if (userDataMessage.isErr()) {
      throw new Error(userDataMessage.error);
    }

    const responseJson = await submitMessage(userDataMessage.value);
    return responseJson;
  };

  // Function to submit the message
  const submitMessage = async (message: Message) => {
    const messageEncoded = Message.encode(message).finish();

    const response = await fetch(`${FarcasterHub}/v1/submitMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "api_key": process.env.HUB_API_KEY || "",
      },
      body: messageEncoded,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to submit message: ${errorText}`);
    }

    return await response.json();
  };

  const handleUpdateUrl = async () => {
    try {
      const response = await writeUserData(UserDataType.URL, urlIPNS); // Pass type and URL

      console.log('Response:', response);
      setMessage('URL updated successfully!');
      notify('URL updated successfully!'); // Notify the user
    } catch (error) {
      console.error('Error updating URL:', error);
      setMessage('Failed to update URL.');
      notify('Failed to update URL.'); // Notify the user
    }
  };

  return (
    <>
      <div>
        <input
          type="text"
          className="bg-transparent border-b border-white text-white text-sm focus:outline-none mb-4"
          placeholder="Enter ipns:// or ipfs:// "
          style={{ width: '100%' }}
          value={urlIPNS}
          onChange={(e) => setUrlIPNS(e.target.value)} // Update URL state
        />
        <button
          onClick={handleUpdateUrl}
          className="bg-fontRed py-2 px-4 text-lightPurple text-md font-semibold rounded-lg transition-all duration-200 ease-in-out mb-4"
        >
          Update
        </button>
      </div>
      {message && <p className="text-white">{message}</p>} {/* Display any messages */}
    </>
  );
};

export default UpdateProfileUrl;
