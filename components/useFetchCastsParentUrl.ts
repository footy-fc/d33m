import { useEffect, useState } from 'react';
import { Message } from '@farcaster/core';
import axios from "axios";
 
export function useFetchCastsParentUrl(url: string, FarcasterHub: string, pageSize: number = 10) {
  const [casts, setCasts] = useState<Message[]>([]); // Provide a type annotation for casts
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCasts = async () => {
      try {
        const castsResult = await axios.get(`${FarcasterHub}/v1/castsByParent?pageSize=10&reverse=1&url=${url}`, {
          headers: {
            "Content-Type": "application/json",
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
  }, [FarcasterHub, url]);

  return {
    casts,
    loading,
  };
}
