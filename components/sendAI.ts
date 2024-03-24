import sendAi from './ai'; 
import { CastLengthLimit } from "../constants/constants";
import { usePrivy, useExperimentalFarcasterSigner, useWallets } from '@privy-io/react-auth';

const sendCast = async (
    newPost: string, 
    setNewPost: React.Dispatch<React.SetStateAction<string>>,
    setRemainingChars: React.Dispatch<React.SetStateAction<number>>,
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
    setNewPost("");
    setRemainingChars(CastLengthLimit);
};

export default sendCast;

