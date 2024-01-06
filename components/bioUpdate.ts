import {
    getHubRpcClient, 
    FarcasterNetwork, 
    NobleEd25519Signer, 
    UserDataType, 
    makeUserDataAdd
  } from "@farcaster/hub-web";
import { useSigner } from "@farsign/hooks";

const sendBio = async (newBio: string, encryptedSigner: NobleEd25519Signer, hubAddress: string, CLIENT_NAME: string) => {
    const request = JSON.parse(localStorage.getItem("farsign-" + CLIENT_NAME)!);
    newBio = newBio.replace(/^\/team\s/, ""); // remove the /bio command
    console.log("bio newPost", newBio);
    // setNewPost("bio updated");
    const hub = getHubRpcClient(hubAddress); // works with open hub
    // Update bio field in the profile (other fields are similar, just change the type)
    const bioUpdate = (await makeUserDataAdd({ type: UserDataType.BIO, value: newBio }, { fid: request?.userFid, network: FarcasterNetwork.MAINNET }, (encryptedSigner as NobleEd25519Signer)))._unsafeUnwrap();
    hub.submitMessage(bioUpdate); // w open hub this works
    console.log("bioUpdate", bioUpdate);
    // setNewPost("");
    return "bio updated";
  };
  
  export default sendBio;
  