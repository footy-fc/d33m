import { FarcasterNetwork, NobleEd25519Signer } from "@farcaster/hub-web";
import { makeCastAdd, getHubRpcClient } from "@farcaster/hub-web";
import sendBio from './bioUpdate'; 
import sendAi from './ai'; 
import { CastLengthLimit } from "../constants/constants";

const sendCast = async (
    newPost: string, 
    setNewPost: React.Dispatch<React.SetStateAction<string>>,
    setRemainingChars: React.Dispatch<React.SetStateAction<number>>,
    encryptedSigner: NobleEd25519Signer, 
    hubAddress: string, 
    CLIENT_NAME: string, 
    targetUrl: string,
    selectedTeam:string,
    ) => {
    const getApiKeyFromLocalStorage = () => {
        return localStorage.getItem('chatgpt-api-key');
    };    
    const aiPost = /^\/ai\s/; 
    if (aiPost.test(newPost)) {
        setNewPost("Loading AI... checking for your API key \u2198"); // TODO: change this to a spinner
        const openAiApiKey = getApiKeyFromLocalStorage();
        const responseAI = await sendAi(newPost, openAiApiKey||"");
        setNewPost(responseAI)// TODO move to it's own affordance
        setRemainingChars(CastLengthLimit-responseAI.length);
        return;
    }
    const bioPost = /^\/team\s/; 
    if (bioPost.test(newPost)) {
        setNewPost("Updating your Farcaster bio...");
        const responseBio = await sendBio(newPost, encryptedSigner!,hubAddress, CLIENT_NAME,);
        setNewPost(responseBio+" d33m:"+selectedTeam);
        setRemainingChars(CastLengthLimit);
        setNewPost(""); 
        return;
    }
    const castBody = newPost;
    const hub = getHubRpcClient(hubAddress); // works with open hub
    const request = JSON.parse(localStorage.getItem("farsign-" + CLIENT_NAME)!);
    const cast = (await makeCastAdd({
        text: castBody,
        parentUrl: targetUrl,
        embeds: [],
        embedsDeprecated: [],
        mentions: [],
        mentionsPositions: [],
    }, { fid: request?.userFid, network: FarcasterNetwork.MAINNET }, (encryptedSigner as NobleEd25519Signer)))._unsafeUnwrap();
    hub.submitMessage(cast); // w open hub this works
    setNewPost("");
    setRemainingChars(CastLengthLimit);
};

export default sendCast;

