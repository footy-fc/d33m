import { useEffect, useState } from "react";
import fillHeaderContext from "./fillHeaderContext";
import Image from 'next/image'; // Adjust the import based on your image handling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";

interface HeaderProps {
  isConnected: boolean;  
  openPanel: () => void;
  targetUrl: string;
  onWalletClick: () => void; 
}

const Header: React.FC<HeaderProps> = ({ isConnected, openPanel, targetUrl, onWalletClick }) => {
  const [matchInfo, setMatchInfo] = useState<{ 
    matchup: string; 
    clock: any; 
    homeLogo: string; 
    awayLogo: string; 
    homeScore: string; 
    awayScore: string;
    notFound: boolean;
  }>({ 
    matchup: 'h-v-a', 
    clock: '0', 
    homeLogo: '/assets/defifa_spinner.gif', 
    awayLogo: '/assets/defifa_spinner.gif', 
    awayScore: '0', 
    homeScore: '0',
    notFound: false,
  });
  
  const pathName = new URL(targetUrl).pathname.replace(/^\/+/g, '');
  const lastSixCharacters = targetUrl.slice(-6);

  useEffect(() => {
    const fetchMatchInfo = async () => {
      try {
        const result = await fillHeaderContext(pathName);
        if (result && result.gameInfo) {
          const { gameInfo } = result;
          console.log('Match info:', pathName, gameInfo);
          setMatchInfo({ 
            matchup: `${gameInfo.homeTeam} - ${gameInfo.awayTeam}`, 
            clock: gameInfo.clock,
            homeLogo: gameInfo.homeLogo,
            awayLogo: gameInfo.awayLogo,
            homeScore: gameInfo.homeScore,
            awayScore: gameInfo.awayScore,
            notFound: false,
          });
        } else {
          setMatchInfo(prevState => ({ ...prevState, notFound: true }));
          console.info('No matching event found for:', pathName);
        }
      } catch (error) {
        console.error('Error fetching match info:', error);
      }
    };

    fetchMatchInfo();

    const intervalId = setInterval(fetchMatchInfo, 60000); // Fetch every 60 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [targetUrl]);

  return (
    <div>
<     div className="flex items-center justify-between p-5 lg:p-2 bg-deepPink">
          <div className="ml-2 flex text-md items-center font-semibold text-notWhite ">
          {targetUrl.startsWith("chain://eip155") 
            ? "football" 
            : pathName === "gantry" 
              ? pathName 
              : matchInfo.notFound 
                ? lastSixCharacters 
                : (
                  <div className="flex items-center">
                    <Image src={matchInfo.homeLogo} alt="Home Team Logo" className="w-8 h-8 mr-2" width={32} height={32} />
                    <span>{matchInfo.homeScore} - {matchInfo.awayScore}</span>
                    <Image src={matchInfo.awayLogo} alt="Away Team Logo" className="w-8 h-8 ml-2" width={32} height={32} />
                    <span className="ml-2">{matchInfo.clock}</span>
                  </div>
                )
          }
        </div>
        <button className="text-2xl font-semibold text-lightPurple flex items-center" onClick={openPanel}>
          {/* <span className="mr-4 flex items-center text-2xl">☰</span> */}
        </button>
        <button className="mr-2 text-2xl font-semibold text-lightPurple" onClick={onWalletClick}>
        <FontAwesomeIcon className="h-6 w-6" icon={faCircleUser} style={{ color: '#C0B2F0' }} />
        </button>
      </div>
    </div>
  );
};  

export default Header;
