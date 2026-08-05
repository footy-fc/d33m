import axios from 'axios';
import { Ed25519Signer, FarcasterNetwork, Message, makeCastAdd } from '@farcaster/core';
import { FarcasterHub } from '../constants/constants';

const sendCastPrivy = async (
  casterFID: number,
  newPost: string,
  targetUrl: string,
  privySigner: Ed25519Signer,
) => {
  console.log('privySigner FID', casterFID, privySigner);

  if (privySigner === undefined) {
    console.error('privySigner is undefined');
    return;
  }

  const submitCastMessage = await makeCastAdd(
    { text: newPost, parentUrl: targetUrl },
    {
      fid: casterFID,
      network: FarcasterNetwork.MAINNET,
    },
    privySigner,
  );

  if (submitCastMessage.isErr()) {
    throw submitCastMessage.error;
  }

  const messageBytes = Buffer.from(Message.encode(submitCastMessage.value).finish());

  const submitCastResponse = await axios.post(
    `${FarcasterHub}/v1/submitMessage`,
    messageBytes,
    {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    },
  );

  return submitCastResponse.data;
};

export type PrivyFarcasterSigner = Pick<Ed25519Signer, 'scheme' | 'getSignerKey' | 'signMessageHash'>;

export const createPrivyFarcasterSigner = (
  signFarcasterMessage: (messageHash: Uint8Array) => Promise<Uint8Array>,
  getFarcasterSignerPublicKey: () => Promise<Uint8Array>,
): PrivyFarcasterSigner => ({
  scheme: FarcasterNetwork ? 1 : 1,
  getSignerKey: async () => ({
    isOk: () => true,
    isErr: () => false,
    value: await getFarcasterSignerPublicKey(),
  }) as Awaited<ReturnType<Ed25519Signer['getSignerKey']>>,
  signMessageHash: async (hash: Uint8Array) => ({
    isOk: () => true,
    isErr: () => false,
    value: await signFarcasterMessage(hash),
  }) as Awaited<ReturnType<Ed25519Signer['signMessageHash']>>,
});

export default sendCastPrivy;
