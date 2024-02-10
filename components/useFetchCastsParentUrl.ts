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
        const castsResult:any = await axios.get(`${FarcasterHub}/v1/castsByParent?pageSize=10&reverse=1&url=${url}`);
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
