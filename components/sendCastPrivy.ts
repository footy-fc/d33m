import axios from 'axios';
import { FarcasterNetwork, HubError, Message, Signer, SignatureScheme, makeCastAdd } from '@farcaster/core';
import { err, ok } from 'neverthrow';
import { FarcasterHub } from '../constants/constants';
export type PrivyFarcasterSigner = Signer;

const sendCastPrivy = async (
  casterFID: number,
  newPost: string,
  targetUrl: string,
  privySigner: Signer,
) => {
  console.log('privySigner FID', casterFID, privySigner);

  if (privySigner === undefined) {
    console.error('privySigner is undefined');
    return;
  }

  const submitCastMessage = await makeCastAdd(
    {
      text: newPost,
      parentUrl: targetUrl,
      embeds: [],
      embedsDeprecated: [],
      mentions: [],
      mentionsPositions: [],
    },
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

export const createPrivyFarcasterSigner = (
  signFarcasterMessage: (messageHash: Uint8Array) => Promise<Uint8Array>,
  getFarcasterSignerPublicKey: () => Promise<Uint8Array>,
): PrivyFarcasterSigner => ({
  scheme: SignatureScheme.ED25519,
  getSignerKey: async () => {
    try {
      return ok(await getFarcasterSignerPublicKey());
    } catch (error) {
      return err(new HubError('unknown', error instanceof Error ? error.message : 'Unable to get signer key'));
    }
  },
  signMessageHash: async (hash: Uint8Array) => {
    try {
      return ok(await signFarcasterMessage(hash));
    } catch (error) {
      return err(new HubError('unknown', error instanceof Error ? error.message : 'Unable to sign message hash'));
    }
  },
});

export default sendCastPrivy;
