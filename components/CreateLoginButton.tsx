import React from 'react';
import { usePrivy } from '@privy-io/react-auth';

const CreateLoginButton = () => {
  const { login } = usePrivy();
  return (
    <>
        <button
            className="bg-darkPurple py-2 px-4 text-lightPurple text-md font-semibold rounded-lg transition-all duration-200 ease-in-out mb-4 mt-4"
            onClick={login} >
            [ Login with Farcaster ]
        </button>
    </>
  );
};

export default CreateLoginButton;
