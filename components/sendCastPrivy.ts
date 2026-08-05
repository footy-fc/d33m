import axios from 'axios';
import { CastType, FarcasterNetwork, HubError, Message, Signer, SignatureScheme, makeCastAdd } from '@farcaster/core';
import { err, ok } from 'neverthrow';
import { FarcasterHub } from '../constants/constants';

type PrivySignFarcasterMessage = (messageHash: Uint8Array) => Promise<Uint8Array>;

export type PrivyFarcasterSigner = Signer;

const sendCastPrivy = async (
  casterFID: number,
  newPost: string,
  targetUrl: string,
  privySigner: Signer,
) => {
  if (privySigner === undefined) {
    console.error('privySigner is undefined');
    return;
  }

  const cast = await makeCastAdd(
    {
      text: newPost,
      type: CastType.CAST,
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

  if (cast.isErr()) {
    throw cast.error;
  }

  return axios.post(
    `${FarcasterHub}/v1/submitMessage`,
    Buffer.from(Message.encode(cast.value).finish()),
    { headers: { 'Content-Type': 'application/octet-stream' } },
  );
};

export const createPrivyFarcasterSigner = (
  signFarcasterMessage: PrivySignFarcasterMessage,
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
  signMessageHash: async (messageHash: Uint8Array) => {
    try {
      return ok(await signFarcasterMessage(messageHash));
    } catch (error) {
      return err(new HubError('unknown', error instanceof Error ? error.message : 'Unable to sign message hash'));
    }
  },
});

export default sendCastPrivy;
