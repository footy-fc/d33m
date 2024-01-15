import {
    getHubRpcClient, 
    FarcasterNetwork, 
    NobleEd25519Signer, 
    UserDataType, 
    makeUserDataAdd
  } from "@farcaster/hub-web";

const sendBio = async (newBio: string, encryptedSigner: NobleEd25519Signer, hubAddress: string, CLIENT_NAME: string) => {
    const request = JSON.parse(localStorage.getItem("farsign-" + CLIENT_NAME)!);
    newBio = newBio.replace(/^\/team\s/, ""); 
    const hub = getHubRpcClient(hubAddress); // works with open hub
    const bioUpdate = (await makeUserDataAdd({ type: UserDataType.BIO, value: newBio }, { fid: request?.userFid, network: FarcasterNetwork.MAINNET }, (encryptedSigner as NobleEd25519Signer)))._unsafeUnwrap();
    hub.submitMessage(bioUpdate); // w open hub this works
    return "bio updated";
  };
  
  export default sendBio;
  