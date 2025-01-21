import { ExternalEd25519Signer, HubRestAPIClient } from '@standard-crypto/farcaster-js-hub-rest';
import { FarcasterHub } from '../constants/constants';

const sendCastPrivy = async (
    casterFID: number,
    newPost: string, 
    targetUrl: string,
    privySigner: ExternalEd25519Signer,
    ) => {
      console.log('privySigner FID', casterFID, privySigner);

      const client = new HubRestAPIClient({
        //hubUrl: 'https://hubs-grpc.airstack.xyz:2281', needs header apikey ??
        hubUrl: FarcasterHub, 
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