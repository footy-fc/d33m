import React from 'react';
import { useLogin } from '@privy-io/react-auth';
import { useRouter } from 'next/router';

const CreateLoginButton = () => {
  const router = useRouter();
  const { login } = useLogin({
    onComplete: () => router.push('/?channel=gantry'),
  });

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
