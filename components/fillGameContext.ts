import sendOpenAi from './sendOpenAi';

const fillGameContext = async (sixCharacterString: string): Promise<void> => {
    const openAiApiKey = process.env.NEXT_PUBLIC_OPENAIKEY;
    const prefix = "Clear the context and start over.";
  
    async function fill(sixCharacterString: string, tournament: string): Promise<any> {
      const scoreboardUrl = `https://site.api.espn.com/apis/site/v2/sports/soccer/${tournament}/scoreboard`;
      const summaryUrl = (eventId: string) => `https://site.api.espn.com/apis/site/v2/sports/soccer/${tournament}/summary?event=${eventId}`;
  
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
  
          if (!summaryData.keyEvents) {
            console.log('No key events found for:', sixCharacterString);
            await sendOpenAi(`no match events for ${sixCharacterString.slice(0, 2)} at the moment`, openAiApiKey);
            console.log('AI context cleared', sixCharacterString.slice(0, 2));
            return null;
          }
  
          const summarizedEvents = summaryData.keyEvents.map((event: {
            text: any;
            shortText: any;
            team: { displayName: any };
            participants: any[];
            clock: { displayValue: any };
            period: { number: any };
            venue: { fullName: any, address: any };
          }) => ({
            text: event.text,
            shortText: event.shortText,
            team: event.team ? event.team.displayName : null,
            participants: event.participants ? event.participants.map(p => p.athlete.displayName) : [],
            time: event.clock.displayValue,
            period: event.period.number,
            venue: event.venue ? event.venue.fullName : null,
          }));
  
          // Step 4: Use sendOpenAi to process the event summary
          const gameInfo = summaryData.gameInfo;
          const standings = summaryData.standings;
          const jsonData = JSON.stringify({ summarizedEvents, gameInfo, standings });
          const aiPrompt = prefix + jsonData;
          await sendOpenAi(prefix, openAiApiKey||""); // hack to clear the context
          await sendOpenAi(aiPrompt, openAiApiKey||"");
  
          console.log('AI context set with:', summarizedEvents);
          return matchingEvent;
        }
  
        return null;
      } catch (error) {
        console.error('Error setting AI context:', error);
        return null;
      }
    }
  
    const tournaments = ["uefa.euro", "conmebol.america"];
    let matchingEvent = null;
  
    for (const tournament of tournaments) {
      matchingEvent = await fill(sixCharacterString, tournament);
      if (matchingEvent) {
        break;
      }
    }
  
    if (!matchingEvent) {
      console.error('No matching event found for:', sixCharacterString);
      await sendOpenAi(prefix, openAiApiKey||""); // hack to clear the context
      await sendOpenAi('No events found', openAiApiKey||"");
    }
  };
  
  

export default fillGameContext;
