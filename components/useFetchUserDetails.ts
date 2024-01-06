import { useEffect, useState } from 'react';
import { HubRpcClient, Message, UserDataAddData, UserDataType, getHubRpcClient, isUserDataAddMessage } from '@farcaster/hub-web';

export function useFetchUserDetails(fid: number, FarcasterHub: string, userDataType: UserDataType) {
  const [userResult, setUserResult] = useState<string[]>([]);
  const [loading1, setLoading1] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const client = getHubRpcClient(FarcasterHub);
      const getUserDataFromFid = async (fid: number, client: HubRpcClient, userDataType: UserDataType): Promise<string[]> => {
        const result = await client.getUserData({ fid: fid, userDataType: userDataType });
        if (result.isOk()) {
          const message = result.value as Message & { data: UserDataAddData };
          if (isUserDataAddMessage(message)) {
            return [message.data.userDataBody.value];
          }
        }
        return [];
      };

      getUserDataFromFid(fid, client, userDataType).then(data => {
        setUserResult(data);
        setLoading1(false);
      });
    };

    fetchUserDetails();
  }, [fid, userDataType]); 

  return {
    userResult: userResult.length > 0 ? userResult : [''], 
    loading1,
  };
}
