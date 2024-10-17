import React, { FC, useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import useEventsData from './useFetchMatches';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';

/* TYPES */
interface SlideOutPanelProps {
  isOpen: boolean;
  onClose: () => void;
  setNewPost: (value: string) => void;
  handlePostChange: (event: { target: { value: string } }) => void;
}

interface Event {
  competitions: {
    status: {
      clock: number;
      displayClock: string;
      type: {
        id: string;
        name: string;
        state: string;
        completed: boolean;
        description: string;
        detail: string;
        shortDetail: string;
      };
    };
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
}

type EventsArray = Event[];

const SlideOutPanel: FC<SlideOutPanelProps> = ({ isOpen, onClose, setNewPost, handlePostChange }) => {
  const [isEplDropdownOpen, setIsEplDropdownOpen] = useState(true);
  const [isUclDropdownOpen, setIsUclDropdownOpen] = useState(true);
  const [isFacDropdownOpen, setIsFacDropdownOpen] = useState(true);
  const [isUelDropdownOpen, setIsUelDropdownOpen] = useState(true);
  const [isEurDropdownOpen, setIsEurDropdownOpen] = useState(true);
  const [isConDropdownOpen, setIsConDropdownOpen] = useState(true);

  // Create a ref to the panel element for outside-click handling
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch event data using the refactored hook
  const allEvents = useEventsData(['epl', 'ucl', 'fac', 'uel', 'eur', 'con']);

  const filterEvents = (sport: string) => {
    const sportData = allEvents.find((e) => e.sport === sport);
    return sportData ? sportData.data : [];
  };

  const eventsEpl = filterEvents('epl');
  const eventsUcl = filterEvents('ucl');
  const eventsFac = filterEvents('fac');
  const eventsUel = filterEvents('uel');
  const eventsEur = filterEvents('eur');
  const eventsCon = filterEvents('con');

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
      case 'uel':
        setIsUelDropdownOpen(!isUelDropdownOpen);
        break;
      case 'eur':
        setIsEurDropdownOpen(!isEurDropdownOpen);
        break;
      case 'con':
        setIsConDropdownOpen(!isConDropdownOpen);
        break;
      default:
        setIsEplDropdownOpen(!isEplDropdownOpen);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && isOpen) {
        onClose(); // Close the panel if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const renderImages = (event: Event) => {
    const homeTeam = event.shortName.split('@')[1].trim().toLowerCase();
    const awayTeam = event.shortName.split('@')[0].trim().toLowerCase();
    const eventTime = new Date(event.date);
    const dateTimeString = eventTime.toLocaleDateString('en-GB', { month: '2-digit', day: '2-digit' }) + 
      ' ' + eventTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

    return (
      <div key={event.id} className="sidebar">
        <div className="dropdown-content">
          <div key={event.id} className="hover:bg-deepPink cursor-pointer">
            <button
              onClick={() => {
                setNewPost(homeTeam + awayTeam || '');
                handlePostChange({
                  target: {
                    value: '/join ' + homeTeam + awayTeam,
                  },
                });
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
                <span className="ml-2 text-sm text-lightPurple font-semibold">{dateTimeString}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="opacity-100">
      <div className={`fixed inset-0 flex transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div ref={panelRef} className="relative w-64 h-full bg-purplePanel shadow-md">
          <div className="flex items-left p-4 ml-2" onClick={onClose}>
            <span className="text-notWhite mr-5 mt-1 font-semibold">Choose Room</span>
          </div>

          <div className="p-4 overflow-auto max-h-[90vh]">
            {/* Initial Gantry room */}
            <div className="sidebarGantry">
              <button
                onClick={() => {
                  setNewPost("gantry");
                  handlePostChange({
                    target: {
                      value: '/join gantry',
                    },
                  });
                  onClose();
                }}
                className="dropdown-button cursor-pointer flex items-center mb-2 w-full"
              >
                <span className="mt-2 mb-2 flex flex-grow items-center ml-2 mr-2 text-notWhite">
                  <Image src="/assets/defifa_spinner.gif" alt="Gantry Logo" className="w-8 h-8" width={20} height={20} style={{ marginRight: '8px' }} />
                  The Gantry
                </span>
              </button>
            </div>

            {/* EPL Matches */}
            <div className="sidebarEPL">
              <button onClick={() => toggleDropdown('epl')} className="dropdown-button cursor-pointer flex items-center mb-2 w-full">
                <span className="mt-2 mb-2 flex flex-grow items-center ml-2 text-notWhite">
                  <Image src="/assets/epl/epl.png" alt="EPL Logo" className="rounded-full w-8 h-8" width={20} height={20} />
                  Premier League
                </span>
                <span className="ml-2 text-notWhite">{isEplDropdownOpen ? '\u25B2' : '\u25BC'}</span>
              </button>
              {isEplDropdownOpen && <div className="dropdown-content">{eventsEpl.map(renderImages)}</div>}
            </div>

            {/* Other sports dropdowns */}
          </div>

          <button className="absolute bottom-6 left-6 p-1 text-lightPurple font-semibold" onClick={onClose}>
            <FontAwesomeIcon className="h-6 w-6" icon={faCircleXmark} style={{ color: '#C0B2F0' }} />
            <p className="text-xxs" style={{ color: '#C0B2F0' }}>Close</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlideOutPanel;
