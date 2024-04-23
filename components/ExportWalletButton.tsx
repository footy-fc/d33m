import {usePrivy} from '@privy-io/react-auth';

const ExportWalletButton = () => {
  const {ready, authenticated, user, exportWallet } = usePrivy();
  // Check that your user is authenticated
  const isAuthenticated = ready && authenticated;
  // Check that your user has an embedded wallet
  const hasEmbeddedWallet = !!user?.linkedAccounts.find(
    (account) => {
      if (account.type === 'wallet' && account.walletClient === 'privy') {
        return true; // Return true if the condition is met
      }
      return false; // Return false otherwise
    }
  );
  
  return ( 
        <>
    {(!isAuthenticated || !hasEmbeddedWallet) ? (
             <span>Login first</span>

    ) : (
    <button onClick={exportWallet} 
        disabled={!isAuthenticated || !hasEmbeddedWallet}
    className="hover:bg-darkPurple py-2 px-4 text-lightPurple text-md font-semibold rounded-lg transition-all duration-200 ease-in-out"
    >
     [ Copy Private Key ]
    </button>
  )}
    </>
    );
};
export default ExportWalletButton;