import { useEffect, useState } from 'react';
import { FarcasterHub } from '../constants/constants'; 

export function useFetchUserDetails(fid: number, userDataType: string) {
  const [userResult, setUserResult] = useState<string[]>([]);
  const [loading1, setLoading1] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const getUserDataFromFid = async (fid: number, userDataType: string): Promise<string[]> => {
        try {
          const response = await fetch(`${FarcasterHub}/v1/userDataByFid?fid=${fid}&userDataType=${userDataType}`);
          if (!response.ok) {
            // Handle HTTP errors
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          
          // Assuming the API returns the data in a specific format, you may need to adjust this part
          // For example, if the data is directly in the response:
          if (data && data.userDataBody && data.userDataBody.value) {
            return [data.userDataBody.value];
          }
        } catch (error) {
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
