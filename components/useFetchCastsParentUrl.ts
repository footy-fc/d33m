import { useEffect, useState } from 'react';
//import { getHubRpcClient, HubRpcClient, Message } from '@farcaster/hub-web';
import { Message } from '@farcaster/core';
import axios from "axios";
import { FarcasterAppFID } from '../constants/constants';
import { config } from "dotenv";

config();

// TODO: Move to Neynar. 
/*  const options = {   method: 'GET',
  headers: {accept: 'application/json', api_key: 'NEYNAR_API_DOCS'}
};

fetch('https://api.neynar.com/v2/farcaster/feed?feed_type=filter&filter_type=parent_url&parent_url=https%3A%2F%2Fd33m.com%2Flobby1&with_recasts=true&limit=25', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err)); */
 
export function useFetchCastsParentUrl(url: string, FarcasterHub: string, pageSize: number = 10) {
  const [casts, setCasts] = useState<Message[]>([]); // Provide a type annotation for casts
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCasts = async () => {
      //const client: HubRpcClient = getHubRpcClient(FarcasterHub);
      try {
        //const castsResult:any = await axios.get(`${FarcasterHub}/v1/castsByParent?pageSize=${pageSize}&reverse=1&url=${url}`);
        //const castsResult:any = await axios.get(`${client}/v1/castsByParent?pageSize=10&reverse=1&url=${url}`);
        const server = "https://hub.farcaster.standardcrypto.vc:2281";
  
        //const server = "https://hubs.airstack.xyz";
            const castsResult = await axios.get(`${server}/v1/castsByParent?pageSize=10&reverse=1&url=${url}`, {
              headers: {
                "Content-Type": "application/json",
                //"x-airstack-hubs": "18c933b177db0481294b63138fe69648d"
                //process.env.AIRSTACK_API_KEY as string,
              },
            });
          
            if (castsResult.status === 200) {
              setCasts(castsResult.data.messages);
            } else {
              console.error('Failed to fetch casts:', castsResult.statusText);
            }
          } catch (e) {
            console.error('Failed to fetch casts:', e);
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
