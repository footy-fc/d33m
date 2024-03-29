import {usePrivy} from '@privy-io/react-auth';

const CreateWalletButton = () => {
  const {ready, authenticated, createWallet} = usePrivy();
  return (
    <>
    <button 
        className="hover:bg-darkPurple py-2 px-4 text-lightPurple text-md font-semibold rounded-lg transition-all duration-200 ease-in-out"
        disabled={!(ready && authenticated)} onClick={createWallet}>
      [ Create a wallet ]   
    </button>
    </>
  );
}

export default CreateWalletButton;