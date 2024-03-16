import { useEffect, useState } from 'react';
import { getHubRpcClient, HubRpcClient, Message } from '@farcaster/hub-web';
import axios from "axios";
import { FarcasterAppFID } from '../constants/constants';

// TODO: Move to Neynar. 
/*  const options = {   method: 'GET',
  headers: {accept: 'application/json', api_key: 'NEYNAR_API_DOCS'}
};

fetch('https://api.neynar.com/v2/farcaster/feed?feed_type=filter&filter_type=parent_url&parent_url=https%3A%2F%2Fd33m.com%2Flobby1&with_recasts=true&limit=25', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err)); */
 
export function useFetchCastsParentUrl(url: string, FarcasterHub: string) {
  const [casts, setCasts] = useState<Message[]>([]); // Provide a type annotation for casts
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCasts = async () => {
      //const client: HubRpcClient = getHubRpcClient(FarcasterHub);
      try {
        const castsResult:any = await axios.get(`${FarcasterHub}/v1/castsByParent?pageSize=10&reverse=1&url=${url}`);
        //const castsResult:any = await axios.get(`${client}/v1/castsByParent?pageSize=10&reverse=1&url=${url}`);
        if (castsResult.status === 200) {
          setCasts(castsResult.data.messages);
        } else {
          console.error('Failed to fetch casts:', castsResult.isErr());
        }
      } catch (error) {
        console.error('Failed to fetch casts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCasts();
    const intervalId = setInterval(fetchCasts, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [url]);

  return {
    casts,
    loading,
  };
}
