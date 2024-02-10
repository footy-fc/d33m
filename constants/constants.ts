export const FarcasterAppName = "castfarer"; // used by farsing to identify the app. Change this to your app name
export const FarcasterAppFID = 196892; // used by farsing to identify the app. Change this to your app version
export const DefaultChannelDomain = "https://d33m.com/";  // this is base of your app's parentUrl ie channels
export const DefaultChannelName = "lobby1"; // using 6 characters case sensative
// export const DefaultChannel = "chain://eip155:1/erc721:0xa45662638e9f3bbb7a6fecb4b17853b7ba0f3a60";
export const FarcasterAppMneumonic = process.env.NEXT_PUBLIC_APP_MNEUMONIC;
// export const FarcasterHub = "https://834f9d.hubs-web.neynar.com:2285";
//export const FarcasterHub = "https://dabf44.hubs.neynar.com:2285";
export const FarcasterHub = "http://arena.wield.co:2281";

export const CastLengthLimit = 250; // TODO: change this to whatever it is and add length checks
export const GunPeers = ['https://gun-manhattan.herokuapp.com/gun']; // TODO: add more peers