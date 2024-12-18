import sendOpenAi from './sendOpenAi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fillGameContext = async (sixCharacterString: string): Promise<void> => {
    const openAiApiKey = process.env.NEXT_PUBLIC_OPENAIKEY;
    const prefix = "Clear the context history and start over with the following info:";
    const maxTokens = 16385;
    let messageHistory: any[] = [];

    // Function to count tokens in a string (basic estimate)
    function countTokens(text: { split: (arg0: RegExp) => { (): any; new(): any; length: any; }; }) {
      // Simple tokenization: split by whitespace
      return text.split(/\s+/).length;
    }
    // Function to manage message history
    const manageContext = (messages: any[], newMessage: any, maxTokens: number) => {
      messages.push(newMessage);
      let totalTokens = messages.reduce((sum: any, msg: any) => sum + countTokens(msg), 0);

      // Remove oldest messages if total exceeds maxTokens
      while (totalTokens > maxTokens) {
          totalTokens -= countTokens(messages.shift()); // Remove the oldest message
      }
      return messages;
    };

    async function fill(sixCharacterString: string, tournament: string): Promise<any> {
      const scoreboardUrl = `https://site.api.espn.com/apis/site/v2/sports/soccer/${tournament}/scoreboard`;
      const summaryUrl = (eventId: string) => `https://site.api.espn.com/apis/site/v2/sports/soccer/${tournament}/summary?event=${eventId}`;
      let summarizedEvents = [];

      try {
        // Step 1: Fetch the list of events
        const scoreboardResponse = await fetch(scoreboardUrl);
        const scoreboardData = await scoreboardResponse.json();
        const events = scoreboardData.events;
        
        // Step 2: Find the event whose shortName matches the sixCharacterString
        const matchingEvent = events.find((event: { id: string, shortName: string }) => {
          const formattedShortName = event.shortName.split('@').reverse().join('').replace(/\s/g, '').toLowerCase();
          return formattedShortName === sixCharacterString.toLowerCase();
        });
  
        if (matchingEvent) {
          // Step 3: Fetch the summary of the matching event
          const summaryResponse = await fetch(summaryUrl(matchingEvent.id));
          const summaryData = await summaryResponse.json();
          console.log('Summary data:', summaryData);
          
          if (!openAiApiKey) {
            const errorMessage = 'OpenAI API key is missing';
            console.error(errorMessage);
            toast.error(errorMessage);
            return null;
          }

          if (!summaryData.keyEvents) {
            console.log('No key events found for:', sixCharacterString, 'loading standings instead');
            await sendOpenAi(`Here are the EPL standings: ${summaryData.standings}`, openAiApiKey);
            console.log('AI context standings', summaryData.standings);
             summarizedEvents = summaryData.standings.groups[0].groups.entries;
          } else {
            //const summarizedEvents = summaryData.keyEvents.map((event: {
            summarizedEvents = summaryData.keyEvents.map((
            event: {
              text: any;
              shortText: any;
              team: { displayName: any };
              participants: any[];
              clock: { displayValue: any };
              period: { number: any };
              venue: { fullName: any, address: any };
            }) => ({
              text: event.text,
              //shortText: event.shortText,
              team: event.team ? event.team.displayName : null,
              //participants: event.participants ? event.participants.map(p => p.athlete.displayName) : [],
              time: event.clock.displayValue,
              //period: event.period.number,
              //venue: event.venue ? event.venue.fullName : null,
            }));
          }
          // Step 4: Use sendOpenAi to process the event summary
          const gameInfo = summaryData.gameInfo;
          const standings = summaryData.standings;
          const jsonData = JSON.stringify({ summarizedEvents, gameInfo, standings });
          messageHistory = manageContext(messageHistory, jsonData, maxTokens);
          console.log('AI context messageHistory', messageHistory);
          await sendOpenAi(jsonData, openAiApiKey||"");
          console.log('AI context set with:', summarizedEvents);
          return matchingEvent;
        }
  
        return null;
      } catch (error) {
        console.log('Error setting AI context:', error);
        return null;
      }
    }
  
    const tournaments = ["eng.1"];
    let matchingEvent = null;
  
    for (const tournament of tournaments) {
      matchingEvent = await fill(sixCharacterString, tournament);
      if (matchingEvent) {
        break;
      }
    }
  
    if (!matchingEvent) {
      console.log('No matching event found for:', sixCharacterString);
      await sendOpenAi(prefix, openAiApiKey||""); // hack to clear the context
      await sendOpenAi('No events found', openAiApiKey||"");
    }
  };
  
  

export default fillGameContext;
