import { useEffect, useState } from 'react';
import { getHubRpcClient, HubRpcClient, Message } from '@farcaster/hub-web';
import axios from "axios";
import { FarcasterAppFID } from '../constants/constants';

export function useFetchCastsParentUrl(url: string, FarcasterHub: string) {
  const [casts, setCasts] = useState<Message[]>([]); // Provide a type annotation for casts
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCasts = async () => {
      const client: HubRpcClient = getHubRpcClient(FarcasterHub);
      try {
        const castsResult:any = await axios.get(`https://834f9d.hubs.neynar.com:2281/v1/castsByParent?fid`+{FarcasterAppFID}+`&pageSize=10&reverse=1&url=${url}`);
        // const castsResult:any = await axios.get(`https://834f9d.hubs-web.neynar.com:2281/v1/castsByParent?fid=4163&pageSize=10&reverse=1&url=chain://eip155:1/erc721:0x7abfe142031532e1ad0e46f971cc0ef7cf4b98b0`);
        // const castsResult:any = await axios.get(`https://834f9d.hubs-web.neynar.com:2281/v1/castsByParent?fid=4163&pageSize=10&reverse=1&url=chain%3A%2F%2Feip155%3A1%2Ferc721%3A0x7abfe142031532e1ad0e46f971cc0ef7cf4b98b0`);
        // console.log('response:', castsResult);
        if (castsResult.status === 200) {
          setCasts(castsResult.data.messages);
          // console.log('parentUrl:', url);
          // console.log('Casts in hook:', castsResult);
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
