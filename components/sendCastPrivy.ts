//import sendOpenAi from './sendOpenAi'; 
//import { CastLengthLimit } from "../constants/constants";
//import { usePrivy, useExperimentalFarcasterSigner, useWallets } from '@privy-io/react-auth';
import { ExternalEd25519Signer, HubRestAPIClient } from '@standard-crypto/farcaster-js-hub-rest';

const sendCastPrivy = async (
    casterFID: number,
    newPost: string, 
    targetUrl: string,
    privySigner: ExternalEd25519Signer,
    ) => {
      console.log('privySigner FID', casterFID, privySigner);

      const client = new HubRestAPIClient({
        //hubUrl: 'https://hubs-grpc.airstack.xyz:2281', needs header apikey ??
        hubUrl: 'https://hub.farcaster.standardcrypto.vc:2281',
      });
      console.log('privySigner', privySigner);
      if (privySigner === undefined) {
        console.error('privySigner is undefined');
        return;
      }
      const submitCastResponse = await client.submitCast(
        {text: newPost, parentUrl: targetUrl},
        casterFID,
        privySigner,
      );
};

export default sendCastPrivy;