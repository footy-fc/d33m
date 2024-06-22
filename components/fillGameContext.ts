import sendOpenAi from './sendOpenAi';
import dotenv from 'dotenv';

dotenv.config();

const fillGameContext = async (sixCharacterString: string): Promise<void> => {
  const scoreboardUrl = 'https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.euro/scoreboard';
  const summaryUrl = (eventId: string) => `https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.euro/summary?event=${eventId}`;
  const openAiApiKey = "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"; // Replace with your actual OpenAI API key
  const prefix = "Clear the context and start over.";

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
        const clear = await sendOpenAi(`no match events for ${sixCharacterString.slice(0,2)} at the moment`, openAiApiKey); // hack to clear the context
        console.log('AI context cleared', sixCharacterString.slice(0,2));
        return;
      } 
      const summarizedEvents = summaryData.keyEvents.map((event: {
        text: any;
        shortText: any;
        team: { displayName: any };
        participants: any[];
        clock: { displayValue: any };
        period: { number: any };
        venue: { fullName: any, address: any};
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
       // Add gameInfo to the summary
       const gameInfo = summaryData.gameInfo;
       const standings = summaryData.standings;
       //const odds = summaryData.odds;
       const jsonData = JSON.stringify({ summarizedEvents, gameInfo, standings});
       //console.log('odds:', odds);
       //const jsonOddsData = JSON.stringify(odds);
      const aiPrompt = prefix + jsonData;
      const clear = await sendOpenAi(prefix, openAiApiKey); // hack to clear the context
      const summary = await sendOpenAi(aiPrompt, openAiApiKey);

      console.log('AI context set with:', summarizedEvents);
    } else {
      console.error('No matching event found for:', sixCharacterString);
      const clear = await sendOpenAi(prefix, openAiApiKey); // hack to clear the context
      const lobby = JSON.stringify(events);
      const lobbyResult = await sendOpenAi(lobby, openAiApiKey); // hack to clear the context

    }
  } catch (error) {
    console.error('Error setting AI context:', error);
  }
};

export default fillGameContext;
