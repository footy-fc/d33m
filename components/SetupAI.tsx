import { useEffect, useState } from "react";

function SetupAI() {
    const [openAiApiKey, setApiKey] = useState(''); 
  
    useEffect(() => {
      const apiKey = getApiKeyFromLocalStorage();
      setApiKey(apiKey || ''); // Use an empty string as the default value or boom
    }, []);
  
    useEffect(() => {
      const storedApiKey = getApiKeyFromLocalStorage();
      if (storedApiKey) {
        setApiKey(storedApiKey);
      }
    }, []);
  
    const setApiKeyToLocalStorage = (apiKey: string) => {
      localStorage.setItem('chatgpt-api-key', apiKey);
    };
  
    const getApiKeyFromLocalStorage = () => {
      return localStorage.getItem('chatgpt-api-key');
    };
  
    const handleApiKeyChange = (e: { target: { value: any; }; }) => {
      const newApiKey = e.target.value;
      setApiKey(newApiKey);
      setApiKeyToLocalStorage(newApiKey);
    };
      
  
    return (
        <>
          <p className="text-notWhite">
            BYO AI Key:
          </p>
          <div className="text-md ml-18">
            <input
            type="password"
            placeholder="Enter OpenAI API Key"
            className="bg-transparent border-b border-white text-white text-sm focus:outline-none mb-4"
            value={openAiApiKey}
            onChange={handleApiKeyChange}
            />
          </div>
        </>
    );
  }
  
  export default SetupAI;