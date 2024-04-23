import {usePrivy} from '@privy-io/react-auth';

function SignTypedDataButton() {
  const {signTypedData} = usePrivy();

  // Example from https://github.com/MetaMask/test-dapp/blob/285ef74eec90dbbb4994eff4ece8c81ba4fc77f9/src/index.js#L1585
  const domain = {
    name: 'd33m.com',
    version: '1.0.0',
    chainId: 42069,
    salt: '0',
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC' as `0x${string}`,
  };

  // The named list of all type definitions
  const types = {
    Person: [
      {name: 'name', type: 'string'},
      {name: 'wallet', type: 'address'},
    ],
    Mail: [
      {name: 'from', type: 'Person'},
      {name: 'to', type: 'Person'},
      {name: 'contents', type: 'string'},
    ],
    // Necessary to define salt param type
    EIP712Domain: [
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'version',
        type: 'string',
      },
      {
        name: 'chainId',
        type: 'uint256',
      },
      {
        name: 'salt',
        type: 'string',
      },
      {
        name: 'verifyingContract',
        type: 'string',
      },
    ],
  };

  // The data to sign
  const value = {
    from: {
      name: 'kmacb.eth',
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
    },
    to: {
      name: 'defifa.eth',
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
    },
    contents: 'LFG',
  };

  const typedData = {primaryType: 'Mail', domain: domain, types: types, message: value};
  const uiConfig = {
    title: 'Games are settled using a "social" contract',
    description: 'Nothing is stopping players from reneging on thier promises, except the community. Choose who you play with wisely.',
    buttonText: 'Cast this message in stone',
};

  return (
    <button
      onClick={async () => {
        // Use `signature` below however you'd like
        // @ts-ignore
        const signature = await signTypedData(typedData, uiConfig);
        console.log('Signature:', signature);
      }}
    >
      Example Sign Typed Data
    </button>
  );
}

export default SignTypedDataButton;