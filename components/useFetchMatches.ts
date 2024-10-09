import { useEffect, useState } from 'react';

function useEventsData(sports: string[]) {
  const [events, setEvents] = useState<{ sport: string; data: any[] }[]>([]);

  useEffect(() => {
    async function fetchEventsData() {
      try {
        const promises = sports.map(async (sport) => {
          let apiUrl = '';
          switch (sport) {
            case 'epl':
              apiUrl = 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard';
              break;
            case 'ucl':
              apiUrl = 'https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard';
              break;
            case 'nba':
              apiUrl = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard';
              break;
            case 'uel':
              apiUrl = 'https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.europa/scoreboard';
              break;
            case 'fac':
              apiUrl = 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.fa/scoreboard';
              break;
            case 'eur':
              apiUrl = 'https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.euro/scoreboard';
              break;
            case 'con':
              apiUrl = 'https://site.api.espn.com/apis/site/v2/sports/soccer/conmebol.america/scoreboard';
              break;
            default:
              apiUrl = 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard';
          }

          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch data for ${sport}`);
          }
          const data = await response.json();
          return { sport, data: data.events || [] }; // Structure each sport's events
        });

        const results = await Promise.all(promises);
        setEvents(results);
      } catch (error) {
        console.error(error);
      }
    }

    fetchEventsData();
  }, [sports]);

  return events;
}

export default useEventsData;
