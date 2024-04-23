import { useEffect, useState } from 'react';
import { FarcasterHub } from '../constants/constants'; 
import axios from 'axios';

export function useFetchUserDetails(fid: number, userDataType: string) {
  const [userResult, setUserResult] = useState<string[]>([]);
  const [loading1, setLoading1] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const getUserDataFromFid = async (fid: number, userDataType: string): Promise<string[]> => {
        try {
          //const response = await fetch(`${FarcasterHub}/v1/userDataByFid?fid=${fid}&userDataType=${userDataType}`);
          const server = "https://hubs.airstack.xyz";
          const result = await axios.get(`${server}/v1/userDataByFid?fid=${fid}&userDataType=${userDataType}`, {
            headers: {
              "Content-Type": "application/json",
              "x-airstack-hubs": "18c933b177db0481294b63138fe69648d"
              //process.env.AIRSTACK_API_KEY as string,
            },
          });
          console.log('result', result);
          if (result.status == 200) {
            console.log('result data', userDataType, result.data);
            const data = await result.data.json();
            if (data && data.userDataBody && data.userDataBody.value) {
              return [data.userDataBody.value];
            }
          }; 
        }
        catch (error) {
          console.error('Error fetching user data:', error);
          // Handle errors or invalid data format
          return [];
        }
        return [];
      };

      getUserDataFromFid(fid, userDataType).then(data => {
        setUserResult(data);
        setLoading1(false);
      });
    };

    fetchUserDetails();
  }, [fid, userDataType]);

  return {
    userResult: userResult.length > 0 ? userResult : ['No data'], // Updated to provide a default message in case of no data
    loading1,
  };
}
