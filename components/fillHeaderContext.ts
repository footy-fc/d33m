export const fillHeaderContext = async (sixCharacterString: string) => {
  async function fill(sixCharacterString: string, tournament: string) {
    const scoreboardUrl = `https://site.api.espn.com/apis/site/v2/sports/soccer/${tournament}/scoreboard`;
    const summaryUrl = (eventId: any) => `https://site.api.espn.com/apis/site/v2/sports/soccer/${tournament}/summary?event=${eventId}`;

    try {
      // Step 1: Fetch the list of events
      const scoreboardResponse = await fetch(scoreboardUrl);
      const scoreboardData = await scoreboardResponse.json();
      const events = scoreboardData.events;
      // // console.log('Events:', events);

      // Step 2: Find the event whose shortName matches the sixCharacterString
      const matchingEvent = events.find((event: { shortName: string; }) => {
        const formattedShortName = event.shortName.split('@').reverse().join('').replace(/\s/g, '').toLowerCase();
        return formattedShortName === sixCharacterString.toLowerCase();
      });
      // console.log('Matching event:', matchingEvent);

      if (matchingEvent) {
        // Step 3: Fetch the summary of the matching event
        const summaryResponse = await fetch(summaryUrl(matchingEvent.id));
        const summaryData = await summaryResponse.json();
        // console.log('Summary data:', summaryData);

        if (!summaryData.boxscore) {
          //console.log('No key events found for:', sixCharacterString);
          return null;
        }

        const summarizedEvents = summaryData.boxscore.teams.map((team: { team: { shortDisplayName: any; logo: any; }; }) => ({
          shortDisplayName: team.team.shortDisplayName,
          logo: team.team.logo,
        }));
        const homeTeam = summaryData.boxscore.teams[0].team;
        const awayTeam = summaryData.boxscore.teams[1].team;
        console.log('summaryData:', summaryData);
        console.log('matchingEvent:', matchingEvent.competitions[0].status.displayClock);
        const gameInfo = {
          homeTeam: homeTeam.shortDisplayName,
          awayTeam: awayTeam.shortDisplayName,
          homeLogo: homeTeam.logo,
          awayLogo: awayTeam.logo,
          homeScore: matchingEvent.competitions[0].competitors[0].score, //home
          awayScore: matchingEvent.competitions[0].competitors[1].score, //away
          period: summaryData.boxscore.period,
          clock: matchingEvent.competitions[0].status.displayClock,
        };
        // console.log('Header context set with:', summarizedEvents, gameInfo);
        return { summarizedEvents, gameInfo };
      }

      return null;
    } catch (error) {
      console.error('Error setting Header context:', error);
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
    // console.log('No matching event found for:', sixCharacterString);
  }

  return matchingEvent;
};

export default fillHeaderContext;
