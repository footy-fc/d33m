/* REACT */
import { SetStateAction, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Image from "next/image";
import Link from "next/link";
import TeamsModal from './TeamLogos';

/* HOOKS */
import { useFetchUserDetails } from "./useFetchUserDetails";
import { useFetchCastsParentUrl } from './useFetchCastsParentUrl';
import fetchCastersDetails from './fetchCasterDetails';
import sendCast from './sendCast'; 

/* FARCASTER */
import { 
  useCheckSigner, 
  useToken, 
  useSigner, 
  useKeypair, 
  RequestSignatureParameters 
} from "@farsign/hooks";

import { 
  Message, 
  UserDataType, 
} from "@farcaster/hub-web";

/* CONSTANTS */
import { DefaultChannelDomain, FarcasterAppName, FarcasterHub, FarcasterAppFID, FarcasterAppMneumonic, DefaultChannelName, CastLengthLimit } from '../constants/constants'
import { useCommands } from './slashCommands';
const IMGAGE_WIDTH = 20; 

/* Functions */
import copyToClipboardAndShare from './copyToClipboardAndShare';

/* Render Components */
import SlideOutPanel from '../components/SlideOutPanel'; // Import the SlideOutPanel component
import CastItem from './CastItem';
import FooterNav from './FooterNav';
import WarpcastLogin from './WarpcastLogin';
import QRCode from './QRCodeMobile';

interface UpdatedCast extends Message {
  fname: string;
  pfp: string;
  teamLogo: string;
}

/* used by @farsign/hooks */
const DEADLINE = Math.floor(Date.now() / 1000) + 31536000; // signature is valid for 1 day you might want to extend this => I DON'T HAVE INFINITE MONEY KMAC!
const CLIENT_NAME = FarcasterAppName;

const params: RequestSignatureParameters = {
  appFid: FarcasterAppFID,
  appMnemonic: FarcasterAppMneumonic || "",
  deadline: DEADLINE,
  name: CLIENT_NAME
}

const SocialMediaFeed = () => {
  const router = useRouter();

  // Add a ref for the textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* GET PARAMS FROM URL */
  const { query } = router;

  let channelId: number|string = DefaultChannelName;
  /* QUERY Channel ID --> checking if params exist in the URL */
  /* TODO: REMOVE THIS and use dynamic routes. 404 redirects PITA */
  if (query.channel) {
    channelId = query.channel as string;
  } 

  const targetThis = DefaultChannelDomain+channelId;

  /* Initialize scrollRef with the correct type */
  let scrollRef = useRef<HTMLDivElement>(null); 
  
  const [openAiApiKey, setApiKey] = useState(''); 
  const [hubAddress] = useState(FarcasterHub); 
  const [newPost, setNewPost] = useState("");
  const [targetUrl, setTargetUrl] = useState(targetThis);
  const {casts, loading} = useFetchCastsParentUrl(targetUrl, hubAddress);
  const [updatedCasts, setUpdatedCasts] = useState<UpdatedCast[]>([]);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [remainingChars, setRemainingChars] = useState(CastLengthLimit);
  const [scrollPosition, setScrollPosition] = useState(0); // Store the scroll position
  const [keys, encryptedSigner] = useKeypair(CLIENT_NAME);
  const [isConnected, setIsConnected] = useCheckSigner(CLIENT_NAME);
  const [token] = useToken(CLIENT_NAME, params, keys!);
  const [signer] = useSigner(CLIENT_NAME, token);
  const [apiKeyVisible, setApiKeyVisible] = useState(false); // Initialize as hidden
  const [showDropdown, setShowDropdown] = useState(false);
  const {commands, setCommands, filteredCommands, setFilteredCommands} = useCommands();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [casterFID, setCasterFID] = useState<number>(FarcasterAppFID);
  const { userResult: casterBio, loading1: loadingBio } = useFetchUserDetails(casterFID, FarcasterHub, UserDataType.BIO);
  const { userResult: casterFname, loading1: loadingFname } = useFetchUserDetails(casterFID, FarcasterHub, UserDataType.FNAME);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');

  const openPanel = () => {
    setIsPanelOpen(true);
    setShowDropdown(false);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
  };

  const handleTeamSelect = (teamName: SetStateAction<string>) => {
    setSelectedTeam(teamName);
    const d33mRegex = /d33m:[^\s]+/;
    // Check if d33m:team tag already exists in casterBio
    if (d33mRegex.test(casterBio.join(' '))) {
        const updatedBio = casterBio.map(bio => bio.replace(d33mRegex, `d33m:${teamName}`)).join(' ');
        setNewPost(`/team ${updatedBio}`);    
    } else {
        setNewPost(`/team ${casterBio} d33m:${teamName}`);
    }
  };

  scrollRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const request = JSON.parse(localStorage.getItem("farsign-" + CLIENT_NAME)!);
      setCasterFID(request?.userFid || FarcasterAppFID);
    }
  }, []);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = /Mobi/i.test(navigator.userAgent);
      setIsMobileDevice(isMobile);
    }
  }, []);

  useEffect(() => {
    if (typeof signer?.signerRequest == 'object') {
      setIsConnected(true)
    }
  }, [signer])

  useEffect(() => {
    /*  Scroll to the bottom when casts change or new post is added ??
        This is a hacky solution to scroll to the bottom. Need to revisit this.
    */
    if (scrollRef.current) {
      if (scrollRef.current.scrollHeight > scrollRef.current.clientHeight) {
        if (scrollRef.current.scrollTop === scrollPosition) {
          // Restore the scroll position if it matches the stored position
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      } else {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  }, [updatedCasts]);

  useEffect(() => {
    fetchCastersDetails(casts, hubAddress, setUpdatedCasts);
  }, [casts, hubAddress]);

  useEffect(() => {
    const apiKey = getApiKeyFromLocalStorage();
    setApiKey(apiKey || ''); // Use an empty string as the default value or boom
  }, []);

  // Adjust textarea height on window resize
  useEffect(() => {
    window.addEventListener('resize', adjustTextareaHeight);
    return () => {
      window.removeEventListener('resize', adjustTextareaHeight);
    };
  }, [newPost]);
     
  useEffect(() => {
    adjustTextareaHeight();
  }, [newPost]); 
  
  useEffect(() => {
    const storedApiKey = getApiKeyFromLocalStorage();
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);
  
  // FUNCTIONS
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };    

  const setApiKeyToLocalStorage = (apiKey: string) => {
    localStorage.setItem('chatgpt-api-key', apiKey);
  };

  const getApiKeyFromLocalStorage = () => {
    return localStorage.getItem('chatgpt-api-key');
  };
  
  const handleApiKeyChange = (e: { target: { value: any; }; }) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    setApiKeyToLocalStorage(newApiKey);
  };
  
  const handlePostChange = (event: { target: { value: any; }; }) => {
    const inputValue = event.target.value;
    setNewPost(inputValue);
    const count = CastLengthLimit - inputValue.length; // TODO jut guessing here
    setRemainingChars(count);
    adjustTextareaHeight();

    if (inputValue.startsWith('/')) {
      const searchTerm = inputValue.slice(1).toLowerCase();
      const matchedCommands = commands.filter(cmd => 
        cmd.command.toLowerCase().startsWith(searchTerm)
      )
      setFilteredCommands(matchedCommands);
      setShowDropdown(matchedCommands.length > 0);

    } else {
      setShowDropdown(false);
    }

    // Check if the input starts with a command followed by parameters
    const commandMatch = inputValue.match(/^\/(\w+)\s*(.*)$/);
    if (commandMatch) {
      const command = commandMatch[1];
      const parameters = commandMatch[2];
      // TOD read from slashCommands.ts, consolidate this functionality into one place
      switch (command) {
        case 'join':
          // Check if parameters are either a 6-character string or a valid URL
          const joinMatch = parameters.match(/^(\w{6})$/) || parameters.match(/^https:\/\/\S+$/);
          if (joinMatch) {
            // If it's a 6-character string, set targetUrl as DefaultChannelDomain + sixCharacterString
            if (joinMatch[1] && joinMatch[1].length === 6) {
              const sixCharacterString = joinMatch[1];
              setTargetUrl(DefaultChannelDomain + sixCharacterString);
              setNewPost(""); // Clear the message
              setRemainingChars(CastLengthLimit);
            }
            // If it's a valid URL, set targetUrl as the provided URL
            else if (joinMatch[0]) {
              setTargetUrl(joinMatch[0]);
              setRemainingChars(CastLengthLimit-joinMatch[0].length+1);
            }
          }
          break;
  
        case 'football':
          // Check if the parameters match the expected length for /football
          setTargetUrl("chain://eip155:1/erc721:0x7abfe142031532e1ad0e46f971cc0ef7cf4b98b0");
          setShowDropdown(false);
          setNewPost(""); // Clear the message
          setRemainingChars(CastLengthLimit);
          break;

        case 'ai':
            break;

        default:
          // Handle unrecognized commands or provide a default action
          console.log("Unrecognized command:", command);
          break;
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }


  // TODO make some components for this and use them in the panel
  // TODO slide out panel only closing on affordnace click, should close on click outside
  return isConnected ? (
    <>  
      <div className="flex flex-grow flex-col min-h-screen"> {/* FULL SCREEN */}
      {/* HEADER & BODY */}
        <div className="flex-grow bg-darkPurple overflow-hidden"> {/* Apply overflow-hidden here */}
          {/* HEADER */}
          <div>
          <div className="flex items-center justify-between p-4 bg-deepPink">
              <button  className="text-2xl font-semibold text-lightPurple flex items-center"
                onClick={openPanel}>
                <span className="mr-2 flex items-center text-2xl">
                ☰
                </span>  
              </button>
              <div className="text-md font-semibold text-notWhite flex items-center">

              {(casterFname! === undefined) ? "loading..." : ` `} 
              {targetUrl.startsWith("chain://eip155") ? "football" : new URL(targetUrl).pathname.replace(/^\/+/g, '')}
           
            </div>
            </div>
          </div>
          {/* BODY */}
          <div ref={scrollRef} className="flex-grow overflow-y-auto max-h-[calc(100vh-235px)]"> {/* Apply max height here */}
            {updatedCasts?.map((updatedCast, index) => {
              const textWithLinks = updatedCast?.data?.castAddBody?.text.replace(
                /(https?:\/\/[^\s]+)/g,
                (url: any) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-deepPink">${'External Link'}</a>`
              );
              return (
                <CastItem key={index} updatedCast={updatedCast} index={index} />
              );
            })}
          </div>
        </div>
        {/* FOOTER */}  
        <div className="bg-purplePanel p-4"> 
          <div className="flex items-end space-x-2">
            {/* FOOTER PANEL SLIDE ?? */}  
            <div className="relative flex-1"> {/* Adjust flex container */}
              {isPanelOpen && (<SlideOutPanel 
              isOpen={isPanelOpen} 
              onClose={closePanel} 
              setNewPost={setNewPost}
              handlePostChange={handlePostChange}
              /> )}
              {isModalVisible && (
                  <>
                  <TeamsModal 
                  isOpen={isModalVisible} 
                  onRequestClose={() => setIsModalVisible(false)}
                  onTeamSelect={handleTeamSelect}
                />
                </>
                )}
             {showDropdown && (
              <div className="absolute bottom-full left-0 right-0 mt-1 border border-limeGreenOpacity bg-purplePanel shadow-lg z-10" style={{ width: '100%' }}>
                {filteredCommands.map(({ command, description, botSource }, index) => (
                  <div
                    key={command}
                    className={`grid grid-cols-[auto,1fr,auto] gap-2 px-4 py-2 hover:bg-darkPurple cursor-pointer ${index === filteredCommands.length - 1 ? '' : ''}`}
                    onClick={() => {
                        if (command === "football") {
                          setNewPost(`/${command}`);
                          setShowDropdown(false);
                          handlePostChange({ target: { value: "/football" } }); // change rooms immediately
                        } else {
                          setNewPost(`/${command}`);
                          setShowDropdown(false);
                          textareaRef.current?.focus(); // Set focus back to the textarea
                        }
                      }}
                    > 
                      <span className="text-sm text-lightPurple font-semibold whitespace-nowrap">🤖 /{command}</span>
                      <span className="text-sm text-lightPurple font-normal text-left">{description}</span>
                      <span className="text-sm text-lightPurple font-normal justify-self-end">{botSource}</span>
                    </div>
                  ))}
                </div>
              )}
              <textarea
                ref={textareaRef}
                className={`w-full text-white text-sm px-2 py-1 focus:outline-none border bg-darkPurple border-limeGreenOpacity resize-none overflow-hidden ${showDropdown ? 'rounded-b-lg' : 'rounded-lg'}`}
                placeholder="Cast or / for 🤖 commands" 
                //style="min-height: 1.5rem; line-height: 1.5rem;"
                value={newPost}
                onChange={handlePostChange}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendCast(newPost, setNewPost, setRemainingChars, encryptedSigner!, hubAddress, CLIENT_NAME, targetUrl, selectedTeam);
                      }
                    else if (e.key === 'Tab' && showDropdown && filteredCommands.length > 0) {
                      e.preventDefault(); // Prevent losing focus from the textarea
                      const firstCommand = filteredCommands[0].command;
                      setNewPost(`/${firstCommand}`);
                      setShowDropdown(false); 
                  }
                }}
                style={{ minHeight: '1rem', lineHeight: 'normal' }}> {/* Adjusted min-height and lineHeight */}
              </textarea>
            </div>
            <button
              className="mb-2 py-2 px-4 bg-deepPink hover:bg-pink-600 rounded-full flex items-center justify-center transition duration-300 ease-in-out shadow-md hover:shadow-lg text-lightPurple font-semibold text-medium"
              onClick={() => {
                sendCast(newPost, setNewPost, setRemainingChars, encryptedSigner!, hubAddress, CLIENT_NAME, targetUrl, selectedTeam);
                const audioElement = new Audio('/assets/soccer-ball-kick-37625.mp3');
                audioElement.play();
              }}>
              <img src="/favicon.ico" alt="Favicon" className="w-6 h-5" />

            </button>
          </div>
          <p className="text-fontRed ml-2 text-sm mt-2 mb-2">{remainingChars} characters remaining ish</p>
          {/* FOOTER NAV */}  
          <FooterNav 
            onLobbyClick={() => {
              const inputVar = { target: { value: "/join " + DefaultChannelName } };
              handlePostChange(inputVar);
            }}
            onBadgeClick={() => {
              setIsModalVisible(true);
              setShowDropdown(false); 
            }}
            onShareClick={() => copyToClipboardAndShare(targetUrl, isMobileDevice)}
            onSetupClick={() => setApiKeyVisible(!apiKeyVisible)}
            apiKeyVisible={apiKeyVisible}
            openAiApiKey={openAiApiKey} // Passed as prop
            handleApiKeyChange={handleApiKeyChange} // Passed as prop

          />
        </div>
      </div>
    </>
  ) : (
    <div>
      <div className="max-w-screen w-full mx-auto z-5000 flex flex-col h-screen">
        <div className="flex-grow bg-purplePanel overflow-hidden"> {/* Apply overflow-hidden here */}
          <div className="flex items-center justify-between px-4 py-2 bg-deepPink">
            <Link href="https://www.farcaster.xyz/apps" className="flex items-center">
              <Image
                  src={'/fc-transparent-white.png'}
                  alt="FC Logo"
                  className="rounded-full w-8 h-8"
                  width={24}
                  height={24} 
                />
              <div className="text-md mr-4 mt-2 text-white font-medium">
                Need an account?
              </div>
            </Link>
            <Link href="https://warpcast.com/kmacb.eth">
              <div className='text-sm text-white font-medium'>
                alpha v0.1 - Issues? DM @kmac
              </div>
            </Link>
          </div>
          {!isMobileDevice && (
            <QRCode deepLink={token.deepLink} />
          )}
          {isMobileDevice && (
            <WarpcastLogin deepLink={token.deepLink} />
          )}
            <div >
             {updatedCasts?.map((updatedCast, index) => {
               const textWithLinks = updatedCast?.data?.castAddBody?.text.replace(
                 /(https?:\/\/[^\s]+)/g,
                 (url: any) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-deepPink">${'External Link'}</a>`
               );
               return (
                <CastItem key={index} updatedCast={updatedCast} index={index} />
               );
             })}
            </div>
        </div>
        {/* FOOTER */}  
        <div className="bg-purplePanel p-4"> 
          <div className="flex items-end space-x-2">
            {/* FOOTER PANEL SLIDE ?? */}  
            <div className="relative flex-1"> {/* Adjust flex container */}
              {isPanelOpen && (<SlideOutPanel 
              isOpen={isPanelOpen} 
              onClose={closePanel} 
              setNewPost={setNewPost}
              handlePostChange={handlePostChange}
              /> )}
              {isModalVisible && (
                  <>
                  <TeamsModal 
                  isOpen={isModalVisible} 
                  onRequestClose={() => setIsModalVisible(false)}
                  onTeamSelect={handleTeamSelect}
                />
                </>
                )}
             {showDropdown && (
              <div className="absolute bottom-full left-0 right-0 mt-1 border border-limeGreenOpacity bg-purplePanel shadow-lg z-10" style={{ width: '100%' }}>
                {filteredCommands.map(({ command, description, botSource }, index) => (
                  <div
                    key={command}
                    className={`grid grid-cols-[auto,1fr,auto] gap-2 px-4 py-2 hover:bg-darkPurple cursor-pointer ${index === filteredCommands.length - 1 ? '' : ''}`}
                    onClick={() => {
                        if (command === "football") {
                          setNewPost(`/${command}`);
                          setShowDropdown(false);
                          handlePostChange({ target: { value: "/football" } }); // change rooms immediately
                        } else {
                          setNewPost(`/${command}`);
                          setShowDropdown(false);
                          textareaRef.current?.focus(); // Set focus back to the textarea
                        }
                      }}
                    > 
                      <span className="text-sm text-lightPurple font-semibold whitespace-nowrap">🤖 /{command}</span>
                      <span className="text-sm text-lightPurple font-normal text-left">{description}</span>
                      <span className="text-sm text-lightPurple font-normal justify-self-end">{botSource}</span>
                  </div>
                ))}
              </div>
            )}
          </div>           
        </div>
        {/* FOOTER NAV */}  
        <FooterNav 
          onLobbyClick={() => {
            const inputVar = { target: { value: "/join " + DefaultChannelName } };
            handlePostChange(inputVar);
          }}
          onBadgeClick={() => {
            setIsModalVisible(true);
            setShowDropdown(false); 
          }}
          onShareClick={() => copyToClipboardAndShare(targetUrl, isMobileDevice)}
          onSetupClick={() => setApiKeyVisible(!apiKeyVisible)}
          apiKeyVisible={apiKeyVisible}
          openAiApiKey={openAiApiKey} // Passed as prop
          handleApiKeyChange={handleApiKeyChange} // Passed as prop
        />
        </div>
      </div>
    </div>
  );
}
export default SocialMediaFeed