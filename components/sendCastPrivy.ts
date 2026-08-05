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
    hubUrl: FarcasterHub,
  });

  if (privySigner === undefined) {
    console.error('privySigner is undefined');
    return;
  }

  const submitCastResponse = await client.submitCast(
    { text: newPost, parentUrl: targetUrl },
    casterFID,
    privySigner,
  );

  return submitCastResponse;
};

export default sendCastPrivy;
