import { HubRpcClient, Message, SignatureScheme, UserDataAddData, UserDataType, getHubRpcClient, isUserDataAddMessage } from "@farcaster/hub-web";
import validTeamLogos from '../public/validTeams.json';

interface FidDetails {
  pfp: string;
  fname: string;
  bio: string;
  // Add other fields as necessary
}

interface UpdatedCast extends Message {
    fname: string;
    pfp: string;
    teamLogo: string;
  }

interface Cast {
    data: undefined;
}
interface UpdatedCast { /* define the structure of UpdatedCast object */ }

const fetchCastersDetails = async (casts:  Message[], hubAddress: string, setUpdatedCasts: (casts: UpdatedCast[]) => void) => {
  const client = getHubRpcClient(hubAddress);
  const fidDetailsCache: Record<number, FidDetails> = {};

  const getUserDataFromFid = async (
    fid: number,
    userDataType: UserDataType,
    client: HubRpcClient
  ): Promise<string> => {
    const result = await client.getUserData({ fid: fid, userDataType: userDataType });
    if (result.isOk()) {
      const userDataAddMessage = result.value as Message & {
        data: UserDataAddData;
        signatureScheme: SignatureScheme.ED25519;
      };
      if (isUserDataAddMessage(userDataAddMessage)) {
        return userDataAddMessage.data.userDataBody.value;
      } else {
        return "";
      }
    } else {
      // Handle the error case here
      throw new Error(result.error.toString());
    }
  };
  const updatedData = casts
    .filter((cast) => cast.data !== undefined)
    .map(async (cast) => {
    if (cast.data?.castAddBody) {
        const { fid } = cast.data;

        // Check cache first, if not present then fetch data
        if (!fidDetailsCache[fid]) {
        const pfp = await getUserDataFromFid(fid, 1, client);
        const fname = await getUserDataFromFid(fid, 2, client);
        const bio = await getUserDataFromFid(fid, 3, client);

        fidDetailsCache[fid] = { pfp, fname, bio }; // Store in cache
        }

        const { pfp, fname, bio } = fidDetailsCache[fid]; // Retrieve from cache

        let teamLogo = '';
        const d33mIndex = bio.indexOf('d33m:');
        if (d33mIndex !== -1) {
        const substringFromD33m = bio.substring(d33mIndex);
        const parts = substringFromD33m.split(':');
        if (parts.length >= 2) {
            const teamPart = parts[1];
            const spaceIndex = teamPart.indexOf(' ');
            const teamCode = spaceIndex === -1 ? teamPart : teamPart.substring(0, spaceIndex);
            teamLogo = validTeamLogos.hasOwnProperty(teamCode)
                        ? validTeamLogos[teamCode as keyof typeof validTeamLogos]
                        : "defifa_spinner.gif";
        }
        } else {
        teamLogo = "defifa_spinner.gif";
        }

        const humanReadableTime = new Date(cast.data.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return {
        ...(cast as UpdatedCast),
        pfp: pfp ?? '',
        fname: fname ?? '',
        teamLogo: teamLogo ?? '',
        humanReadableTime: humanReadableTime ?? '',
        };
    } else {
        return null;
    }
    });

    const extendedCasts = (await Promise.all(updatedData)).filter((cast) => cast !== null) as unknown as UpdatedCast[];
    extendedCasts.reverse();
    setUpdatedCasts(extendedCasts);
  };


export default fetchCastersDetails;

