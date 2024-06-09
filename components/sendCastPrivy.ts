import sendOpenAi from './sendOpenAi'; 
import { CastLengthLimit } from "../constants/constants";
import { usePrivy, useExperimentalFarcasterSigner, useWallets } from '@privy-io/react-auth';
import { ExternalEd25519Signer, HubRestAPIClient } from '@standard-crypto/farcaster-js';

const sendCastPrivy = async (
    casterFID: number,
    newPost: string, 
    targetUrl: string,
    privySigner: ExternalEd25519Signer,

    ) => {

      const client = new HubRestAPIClient({
        hubUrl: 'https://hub.farcaster.standardcrypto.vc:2281',
      });
      if (privySigner === undefined) {
        console.error('privySigner is undefined');
        return;
      }
      const submitCastResponse = await client.submitCast(
        {text: newPost, parentUrl: targetUrl},
        casterFID,
        privySigner,
      );
      console.log('submitCastResponse', submitCastResponse);
   
};

export default sendCastPrivy;