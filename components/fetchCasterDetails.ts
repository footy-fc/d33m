import { Message, UserDataType } from "@farcaster/hub-web";
import validTeamLogos from '../public/validTeams.json';
import axios from 'axios';

interface FidDetails {
  pfp: string;
  fname: string;
  bio: string;
}

interface UpdatedCast extends Message {
  fname: string;
  pfp: string;
  teamLogo: string;
  humanReadableTime: string;
}

interface UserDataMessage {
  data: {
    type: string;
    fid: number;
    timestamp: number;
    network: string;
    userDataBody: {
      type: string;
      value: string;
    };
  };
  hash: string;
  hashScheme: string;
  signature: string;
  signatureScheme: string;
  signer: string;
}

const fetchCastersDetails = async (casts: Message[], hubAddress: string, setUpdatedCasts: (casts: UpdatedCast[]) => void) => {
  const fidDetailsCache: Record<number, FidDetails> = {};

  const getUserDataFromFid = async (fid: number): Promise<FidDetails> => {
      const server = "https://hubs.airstack.xyz";
      const result = await axios.get(`${server}/v1/userDataByFid?fid=${fid}`, {
        headers: {
          "Content-Type": "application/json",
          "x-airstack-hubs": "18c933b177db0481294b63138fe69648d"
          //process.env.AIRSTACK_API_KEY as string,
        },
      });
      let pfp = '', fname = '', bio = '';  
    
    result.data.messages.forEach((message: { data: { userDataBody: any; }; }) => {
      const { userDataBody } = message.data; // Corrected access to 'data'
      switch (userDataBody.type) { // Corrected access to 'type'
        case "USER_DATA_TYPE_USERNAME":
          fname = userDataBody.value;
          break;
        case "USER_DATA_TYPE_BIO":
          bio = userDataBody.value;
          break;
        case "USER_DATA_TYPE_PFP":
          pfp = userDataBody.value;
          break;
      }
    });
    
    return { pfp, fname, bio };
  };

  const updatedData = await Promise.all(casts.filter(cast => cast.data?.castAddBody).map(async cast => {
    if (!cast.data) return null; // Guard clause for 'data' being possibly 'undefined'
    
    const fid = cast.data.fid; // Access 'fid' after checking 'data' exists
    if (!fidDetailsCache[fid]) {
      fidDetailsCache[fid] = await getUserDataFromFid(fid);
    }

    const { pfp, fname, bio } = fidDetailsCache[fid];
    let teamLogo = "defifa_spinner.gif"; // Default logo

    if (!cast.data) return null; // Additional check if necessary
    const humanReadableTime = new Date(cast.data.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return {
      ...cast,
      fname,
      pfp,
      teamLogo,
      humanReadableTime,
    } as UpdatedCast;
  }));

  const extendedCasts = updatedData.filter(cast => cast !== null) as UpdatedCast[];
  extendedCasts.reverse();
  setUpdatedCasts(extendedCasts);
};

export default fetchCastersDetails;
