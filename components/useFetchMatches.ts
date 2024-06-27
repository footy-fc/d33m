import { useEffect, useState } from 'react';

function useEventsData(sport: string) {
  const [events, setEvents] = useState([]);
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
        break;conmebol.america
    case 'con':
        apiUrl = 'https://site.api.espn.com/apis/site/v2/sports/soccer/conmebol.america/scoreboard';
        break;    
    default:
        apiUrl = 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard';
    }


  //const apiUrl = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard';
   // basketball/nba and soccer/eng.1
  useEffect(() => {
    async function fetchEventsData() {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const eventsArray = data.events;
        if (!eventsArray) {
          throw new Error('Failed to fetch data');
        }   
        setEvents(eventsArray);
      } catch (error) {
        console.error(error);
      }
    }

    fetchEventsData();
  }, [apiUrl]);

  return events;
}

export default useEventsData;
