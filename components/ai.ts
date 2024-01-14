import axios from 'axios';

let conversationHistory: { role: string; content: any; }[] = [];

// Import any other necessary variables or constants here
const sendAi = async (aiPrompt: string, openAiApiKey: string) => {
    const prompt = aiPrompt;
    console.log('prompt in sendAi', prompt, openAiApiKey);
    if (openAiApiKey === '') {
      console.error('OpenAI API Key is missing');
      const inputVar = "OpenAI API Key is missing";
      return inputVar;
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
          console.error('Failed to fetch AI. Status code:', aiResponse.status);
        }
      } catch (error) {
        console.error('Error while fetching AI:', error);
      }
      // TODO If the request fails or other errors occur, handle them here.
    }
  };
  
  export default sendAi;
  