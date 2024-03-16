import React, { FC, useRef, useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import useEventsData from './useFetchMatches';

/* TYPES */
interface TeamLogos {
    [key: string]: string;
  }

interface SlideOutPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SlideOutPanelProps {
    isOpen: boolean;
    onClose: () => void;
    setNewPost: (value: string) => void;
    handlePostChange: (event: { target: { value: string } }) => void;
}

interface Event {
    competitions: {
      competitors: {
        team: {
          id: number;
          name: string;
          logo: string;
          score: number;
        };
        score: number;
      }[];
    }[];
    id: string;
    date: string;
    shortName: string;
    // Add other properties as needed
}

type EventsArray = Event[];

const SlideOutPanel: FC<SlideOutPanelProps> = ({ isOpen, onClose, setNewPost, handlePostChange }) => {  
    const [eventsEpl, setEventsEpl] = useState<EventsArray>([]);
    const [eventsUcl, setEventsUcl] = useState<EventsArray>([]);
    const [eventsFac, setEventsFac] = useState<EventsArray>([]);
    const [eventsNfl, setEventsNfl] = useState<EventsArray>([]);

    const [isAffordanceClicked, setIsAffordanceClicked] = useState(true);
    const [isEplDropdownOpen, setIsEplDropdownOpen] = useState(true);
    const [isUclDropdownOpen, setIsUclDropdownOpen] = useState(true);
    const [isFacDropdownOpen, setIsFacDropdownOpen] = useState(true);
    const [isNflDropdownOpen, setIsNflDropdownOpen] = useState(true);

    // Create a ref to the panel element
    const panelRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = (menu: string) => {
        switch (menu) {
            case 'epl':
                setIsEplDropdownOpen(!isEplDropdownOpen);
                break;
            case 'ucl':
                setIsUclDropdownOpen(!isUclDropdownOpen);
                break;
            case 'fac':
                setIsFacDropdownOpen(!isFacDropdownOpen);
                break;        
            case 'nba':
                setIsFacDropdownOpen(!isFacDropdownOpen);
                break;
            case 'nfl':
                setIsNflDropdownOpen(!isNflDropdownOpen);
                break;
            default:
                setIsEplDropdownOpen(!isEplDropdownOpen);
            }
        };

    // Function to handle click outside of the panel
    function getInnermostElement(element: HTMLElement): HTMLElement {
        let currentElement = element;
        while (currentElement.firstElementChild) {
          currentElement = currentElement.firstElementChild as HTMLElement;
        }
        return currentElement;
      }

    const handleClickOutside = (event: MouseEvent) => {
        // console.log("SlideOutPanel: panelRef.current: ",isOpen, panelRef.current);
        if (isOpen && panelRef.current) {
            const target = event.target as HTMLElement;
            // TODO: Fix this shit. Still not closing when click outside of panel.
            // It's a simple toggle and I can't figure it out. crying
            if (!panelRef.current.contains(getInnermostElement(target)) && !isAffordanceClicked) {
                onClose(); // Close the panel
            }
        }
    };

    // Function to close the panel
    const closePanel = () => {
        setIsAffordanceClicked(false); // Reset isAffordanceClicked when the panel is closed
    };
    
    function convertTo12HourTime(militaryTime: string) {
        const parts = militaryTime.split(":");
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        const period = hours >= 12 ? "PM" : "AM";
        const hours12 = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${hours12}:${formattedMinutes} ${period}`;
    }

    function ensureSixCharacters(text: string) {
        const length = text.length;
    
        if (length === 6) {
            return text;
        } else if (length < 6) {
            return text + '1'.repeat(6 - length);
        }
    }

    // Add an event listener when the component mounts
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        // Remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]); // Only add/remove the listener when the panel's open state changes

    // Fetch events data using the useEventsData hook
    const fetchedEventsEpl = useEventsData("epl");
    const fetchedEventsUcl = useEventsData("ucl");
    const fetchedEventsFac = useEventsData("fac");
    const fetchedEventsNfl = useEventsData("nfl");

    // Update the state with the fetched data
    useEffect(() => {
        setEventsEpl(fetchedEventsEpl);
        setEventsUcl(fetchedEventsUcl);
        setEventsFac(fetchedEventsFac);
        setEventsNfl(fetchedEventsNfl);
    }, [fetchedEventsEpl,fetchedEventsFac, fetchedEventsNfl]);
    
    const combinedEvents = [...eventsEpl, ...eventsUcl];

    // Function to get the team logos from the shortName
    const renderImages = (event: Event) => {
        //return combinedEvents.map((event) => {
            // const [awayTeam, homeTeam] = getTeamLogosFromShortName(event.shortName);
            const homeTeam = event.shortName.split('@')[1].trim().toLowerCase();
            const awayTeam = event.shortName.split('@')[0].trim().toLowerCase();
            const eventTime = new Date(event.date);
            const milTime = eventTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
            const formattedTime = convertTo12HourTime(milTime);
            const oneHourBeforeEventTime = new Date(eventTime.getTime() - 60 * 60 * 1000); // Subtract one hour in milliseconds

            const currentTime = new Date();
            let timeDisplay: JSX.Element | null = null;
            const roomId = ensureSixCharacters(homeTeam+awayTeam);
            if (oneHourBeforeEventTime < currentTime) {
                const milTime = eventTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
                const formattedTime = convertTo12HourTime(milTime);
                timeDisplay = <span className="ml-3 text-sm text-lightPurple font-semibold">{formattedTime}</span>;
            } return (
                <div key={event.id} className="sidebar">
                        <div className="dropdown-content">
                            <div key={event.id} className="hover:bg-deepPink cursor-pointer">
                                <button
                                    onClick={() => {
                                        setNewPost(roomId||'');
                                        handlePostChange({
                                            target: {
                                                value: '/join ' + roomId,
                                            },
                                        });
                                        closePanel();
                                        onClose();
                                    }}
                                    className="w-full"
                                >
                            <div className="flex items-center ml-2">
                                <Image
                                    src={event.competitions[0]?.competitors[0]?.team.logo || '/assets/defifa_spinner.gif'}
                                    alt="Home Team Logo"
                                    className="rounded-full w-8 h-8"
                                    width={20}
                                    height={20}
                                />
                                <span className="ml-2 mr-2 text-sm text-lightPurple font-semibold">vs</span>
                                <Image
                                    src={event.competitions[0]?.competitors[1]?.team.logo || '/assets/defifa_spinner.gif'}
                                    alt="Away Team Logo"
                                    className="rounded-full w-8 h-8"
                                    width={20}
                                    height={20}
                                />
                                
                                <div className="ml-3">
                                    <span className="text-sm text-lightPurple font-semibold">
                                        {event.competitions[0]?.competitors[0]?.score}
                                    </span>
                                    <span className="text-sm text-lightPurple font-semibold">-</span>
                                    <span className="text-sm text-lightPurple font-semibold">
                                        {event.competitions[0]?.competitors[1]?.score}
                                    </span>
                                </div>
                                {timeDisplay}
                            </div>
                                </button>
                            </div>
                        </div>
                </div>
            );
        //});
    };
      
    return ( // TODO standardize hirearchy of evnet types and events dry up code
    <div className="opacity-100">
        {/* Overlay */}
        <div  className={`fixed inset-0 flex transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div ref={panelRef} className="relative w-64 h-full bg-purplePanel shadow-md">
                <div className="flex items-left  p-4 ml-2" onClick={onClose}>
                    {/* Content of the slide-out panel */}
                    <span className="text-notWhite mr-5 mt-1 font-semibold">Choose Room</span>
                    <button className="absolute top-2 right-2 p-1 mt-2 mr-1 text-lightPurple font-semibold"
                        onClick={() => {
                            setIsAffordanceClicked(true); // Set the flag when the affordance is clicked
                            closePanel(); // Close the panel
                            onClose(); // Close the panel
                        }}>
                        x
                    </button>
                </div>
                <div className="p-4 overflow-auto max-h-[90vh]">
                    <div className="sidebarEPL`">
                        <button onClick={() => toggleDropdown("epl")} className="dropdown-button cursor-pointer flex items-center mb-2 w-full">
                        <span className="mt-2 mb-2 flex flex-grow items-center ml-2 text-notWhite">
                            <Image src="/assets/epl/epl.png" alt="EPL Logo" className="rounded-full w-8 h-8" width={20} height={20} />
                            Premier League
                            </span>
                            <span className="ml-2 text-notWhite">
                                {isEplDropdownOpen ? "\u25B2" : "\u25BC"} {/* Up arrow for close, down arrow for open */}
                            </span>
                     
                        </button>
                        {isEplDropdownOpen && (
                            <div className="dropdown-content">
                                {eventsEpl.map((event) => renderImages(event))}
                            </div>
                        )}
                    </div>  
                    <div className="sidebarFac">
                        <button onClick={() => toggleDropdown("fac")} className="dropdown-button cursor-pointer flex items-center mb-2 w-full">
                        <span className="mt-2 mb-2 flex flex-grow items-center ml-2 text-notWhite">
                            <Image src="/assets/epl/fac.png" alt="FA Cup Logo" className="rounded-full w-8 h-8" width={20} height={20} />
                            FA Cup
                            </span>
                            <span className="ml-3 text-notWhite">
                                {isFacDropdownOpen ? "\u25B2" : "\u25BC"} {/* Up arrow for close, down arrow for open */}
                            </span>
                      
                        </button>
                        {isFacDropdownOpen && (
                            <div className="dropdown-content">
                                {eventsFac.map((event) => renderImages(event))}
                            </div>
                        )}
                    </div>
                    <div className="sidebarUcl">
                        <button onClick={() => toggleDropdown("ucl")} className="dropdown-button cursor-pointer flex items-center mb-2 w-full">
                        <span className="mt-2 mb-2 flex flex-grow items-center ml-2 text-notWhite">
                            <Image src="/assets/ucl/ucl.png" alt="UCL Logo" className="rounded-full w-8 h-8" width={20} height={20} />
                            Champions League 
                            </span>
                            <span className="ml-3 text-notWhite">
                                {isUclDropdownOpen ? "\u25B2" : "\u25BC"} {/* Up arrow for close, down arrow for open */}
                            </span>
                      
                        </button>
                        {isUclDropdownOpen && (
                            <div className="dropdown-content">
                                {eventsUcl.map((event) => renderImages(event))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default SlideOutPanel;




