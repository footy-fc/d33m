import {usePrivy, useWallets} from '@privy-io/react-auth';
import { use, useEffect, useState } from 'react';


function CallTransaction() {
  const [walletBalance, setWalletBalance] = useState<any>("");    
  const [embeddedWallet, setEmbeddedWallet] = useState<any>("");
  const {signMessage, ready } = usePrivy();
  const { wallets } = useWallets();
  useEffect(() => {
    if (!ready) {
      return
    } else {
      setup(); }
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
          const formattedBalance = Number(walletBalance) / 10**18;
          setWalletBalance(formattedBalance);
          setEmbeddedWallet(embedWallet);
        }
    }
  }, [ready, wallets, walletBalance]);

  return (
    <p>
     Balance: {walletBalance} Ξ        
    </p>
  );
}

export default CallTransaction;