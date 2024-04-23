import axios, { AxiosError } from 'axios';
import { ToastContainer, ToastContentProps, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let conversationHistory: { role: string; content: any; }[] = [];

const sendAi = async (aiPrompt: string, openAiApiKey: string) => {
    const prompt = aiPrompt;
    //console.log('prompt in sendAi', prompt, openAiApiKey);
    const notify = (message: string | number | boolean | null | undefined) => toast(message);

    if (openAiApiKey === '') {
      notify('OpenAI API Key is missing. Please add it in the Account settings.');
      return "";
    } else {
      const apiKey = openAiApiKey;
      const apiUrl = 'https://api.openai.com/v1/chat/completions';
      conversationHistory.push({ role: 'user', content: aiPrompt });
      const requestData = {
        model: 'gpt-3.5-turbo',
        // messages: [{ role: 'user', content: prompt }],
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 500,
      };
  
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      };
  
      try {
        const aiResponse = await axios.post(apiUrl, requestData, { headers });
        if (aiResponse.status === 200) {
          const aiResponseContent = aiResponse.data.choices[0].message.content;
          conversationHistory.push({ role: 'system', content: aiResponseContent });
          console.log('aiResponseContent', aiResponseContent);
          return aiResponseContent;
        } else {
          notify('Failed to fetch AI. Status code:' + aiResponse.status);
        }
      } catch (error) {
        console.error('Error while fetching AI:', error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
      
          // Check if the error response is available and has data
          if (error.response && error.response.data) {
            const errorMessage = error.response.data.error.message;
            //console.error('Error Message:', errorMessage);
            notify(errorMessage);
            return '';
          } else {
            notify('An unknown error occurred while fetching AI.');
          }
        } else {
          notify('An unexpected error occurred.');
        }
     };
    }
  };  
  export default sendAi;
  