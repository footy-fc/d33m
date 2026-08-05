import { ExternalEd25519Signer, HubRestAPIClient } from '@standard-crypto/farcaster-js-hub-rest';
import { FarcasterHub } from '../constants/constants';

type PrivySignFarcasterMessage = (messageHash: Uint8Array) => Promise<Uint8Array>;

export type PrivyFarcasterSigner = ExternalEd25519Signer;

const farcasterClient = new HubRestAPIClient({
  hubUrl: FarcasterHub,
});

const sendCastPrivy = async (
  casterFID: number,
  newPost: string,
  targetUrl: string,
  privySigner: PrivyFarcasterSigner,
) => {
  if (privySigner === undefined) {
    console.error('privySigner is undefined');
    return;
  }

  return farcasterClient.submitCast(
    {
      text: newPost,
      parentUrl: targetUrl,
      embeds: [],
      embedsDeprecated: [],
      mentions: [],
      mentionsPositions: [],
    },
    casterFID,
    privySigner,
  );
};

export const createPrivyFarcasterSigner = (
  signFarcasterMessage: PrivySignFarcasterMessage,
  getFarcasterSignerPublicKey: () => Promise<Uint8Array>,
): PrivyFarcasterSigner => new ExternalEd25519Signer(signFarcasterMessage, getFarcasterSignerPublicKey);

export default sendCastPrivy;
