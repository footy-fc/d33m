import { FarcasterNetwork, Message, makeCastAdd, NobleEd25519Signer } from "@farcaster/core";
import axios from "axios";
import sendBio from './bioUpdate'; 
import sendAi from './ai'; 
import { CastLengthLimit, NeynarAPI } from "../constants/constants";

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
    const submitMessage = async () => {
        const request = JSON.parse(localStorage.getItem("farsign-" + CLIENT_NAME)!);
            const server = hubAddress;
            const url = `${server}/v1/submitMessage`;
        const postConfig = {
            headers: {    "Content-Type": "application/json",
            //    "Content-Type": "application/octet-stream"
            //, "api_key": NeynarAPI }
            }
        };
        const castBody =
        {
            text: newPost,
            parentUrl: targetUrl,
            embeds: [],
            embedsDeprecated: [],
            mentions: [],
            mentionsPositions: [],
        };
        const castAdd = (await makeCastAdd(castBody, 
          { fid: request?.userFid, network: FarcasterNetwork.MAINNET }, 
          (encryptedSigner as NobleEd25519Signer)))._unsafeUnwrap();

        const messageBytes = Buffer.from(Message.encode(castAdd).finish());
        try {
            const response = await axios.post(url, messageBytes, postConfig);
        } catch (e:any) {
            console.error("Error submitting message: ", e.response.data);
        }
    };
    submitMessage();
    setNewPost("");
    setRemainingChars(CastLengthLimit);
};

export default sendCast;

