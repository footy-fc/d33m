// Privy has submit cast so not currently using this when using privy Hub call
import sendOpenAi from './sendOpenAi'; 
import { CastLengthLimit } from "../constants/constants";

const sendCast = async (
    newPost: string, 
    setNewPost: React.Dispatch<React.SetStateAction<string>>,
    setRemainingChars: React.Dispatch<React.SetStateAction<number>>,
    signer_uuid: string, 
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
        const responseAI = await sendOpenAi(newPost, openAiApiKey||"");
        setNewPost(responseAI)// TODO move to it's own affordance
        setRemainingChars(CastLengthLimit-responseAI.length);
        return;
    }
    const getApiKeyFromEnv = () => {
        const neynarKey = process.env.NEXT_PUBLIC_NEYNAR_APIKEY;
        return neynarKey;
    }; 
    const submitMessage = async () => {
        const options = {
            method: 'POST',
            headers: {
              accept: 'application/json',
              //api_key: getApiKeyFromEnv(),
              "x-airstack-hubs": "18c933b177db0481294b63138fe69648d",
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              signer_uuid: signer_uuid,
              text: newPost,
              parent: targetUrl
            })
          };
          // @ts-ignore
          // fetch('https://api.neynar.com/v2/farcaster/cast', options)
          fetch('https://hubs.airstack.xyz/v2/farcaster/cast', options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));
    };
    submitMessage();
    setNewPost("");
    setRemainingChars(CastLengthLimit);
};

export default sendCast;