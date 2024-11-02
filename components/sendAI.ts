import sendOpenAi from './sendOpenAi'; 
import { CastLengthLimit } from "../constants/constants";
import fillGameContext from './fillGameContext';

const sendAI = async (
    newPost: string, 
    setNewPost: React.Dispatch<React.SetStateAction<string>>,
    setRemainingChars: React.Dispatch<React.SetStateAction<number>>,
    targetUrl: string,
    selectedTeam:string,
    ) => {
    const getApiKeyFromLocalStorage = () => {
       // d33m sponsoring game context
       return process.env.NEXT_PUBLIC_OPENAIKEY;
    };    
    const gameCode = new URL(targetUrl).pathname.substring(1);
    setNewPost("Loading AI. It's like waiting for VAR. "); // TODO: change this to a spinner
    await fillGameContext(gameCode);
    const aiPost = /^\/ai\s/; 
    if (aiPost.test(newPost)) {
        const openAiApiKey = getApiKeyFromLocalStorage();
        const responseAI = await sendOpenAi(newPost, openAiApiKey||"");
        setNewPost(responseAI)// TODO move to it's own affordance
        setRemainingChars(CastLengthLimit-responseAI.length);
        return;
    }
    setNewPost("");
    setRemainingChars(CastLengthLimit);
};

export default sendAI;

