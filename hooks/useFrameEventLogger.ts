// Declare a type for frameEmbedder
interface FrameEmbedder {
  performAction: (
    frameId: string,
    frameInputs: any,
    frameState: any,
    buttonIndex: string,
    transactionData: {
      network: number;
      address: string;
      transactionId: string;
    }
  ) => void;
}

// Extend the Window interface
declare global {
  interface Window {
    frameEmbedder?: FrameEmbedder;
  }
}
import { useEffect } from 'react';

const useFrameEventLogger = () => {
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (typeof e.data !== 'object' || !('content' in e.data) || !('type' in e.data)) {
        return;
      }

      switch (e.data.type) {
        case 'Frame loading':
          console.log('Frame loading:', e.data);
          break;
        case 'Frame rendered':
          console.log('Frame rendered:', e.data);
          break;
        case 'Frame failed render':
          console.log('Frame failed render:', e.data);
          break;
        case 'Frame button clicked':
          console.log('Frame button clicked:', e.data);
          break;
        case 'Frame transaction':
          console.log('Frame transaction:', e.data);
          handleTransaction(e.data);
          break;
        case 'Frame mint':
          console.log('Frame mint:', e.data);
          break;
        default:
          console.log('Unknown event:', e.data);
      }
    };

    const handleTransaction = (data: any) => {
      // Extract relevant details from the event data
      const frameId = data.content.frameId;
      const frameInputs = data.content.inputs;
      const buttonIndex = data.content.button.type.replace('button', '');
      const frameState = data.content.state;

      // Declare the network and sender address of the transaction - provide these details from your modal data
      const [network, address] = [8453, '0x...'];

      // Declare the transaction id
      const transactionId = '0x...';

      // Construct the transaction data
      const transactionData = {
        network,
        address,
        transactionId
      };

      // Perform the action
      if (window.frameEmbedder) {
        window.frameEmbedder.performAction(frameId, frameInputs, frameState, buttonIndex, transactionData);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
};

export default useFrameEventLogger;
