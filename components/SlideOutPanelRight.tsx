import React, { FC, useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding } from '@fortawesome/free-regular-svg-icons';
import FrameModal from '../components/FrameModal';

interface SlideOutPanelRightProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FrameData {
  name: string;
  link: string;
  image: string | null;
}

// TODO: Move this data to a separate file and consider how to admin this without a code change
const framesData = [
    {
        name: "Join FC FEPL",
        link: "https://frames.neynar.com/f/9f7a193f/da85c346",
        image: null,
    },
    {
        name: "The False Nine",
        link: "https://paragraph.xyz/@thefalsenine?referrer=0x8b80755C441d355405CA7571443Bb9247B77Ec16",
        image: null,
    },
    {
        name: "Polymarket",
        link: "https://polymarket.com/event/epl-manchester-united-vs-fulham?tid=1723690420156",
        image: null,
    },
    {
        name: "Football Bets",
        link: "https://fp-lbets.vercel.app/",
        image: null,
    },
    {
        name: "Moxie Rewards",
        link: "https://ny-1.frames.sh/v/38917",
        image: null,
    }
  // Add more frames as needed
];
const placeholderImageUrl = 'https://d33m.com/assets/defifa_spinner.gif';

const SlideOutPanel: FC<SlideOutPanelRightProps> = ({ isOpen, onClose }) => {  
  const [isAffordanceClicked, setIsAffordanceClicked] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFrameUrl, setSelectedFrameUrl] = useState<string | null>(null);
  const [frameList, setFrameList] = useState<FrameData[]>(framesData);

  const panelRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (isOpen && panelRef.current) {
      const target = event.target as HTMLElement;
      if (!panelRef.current.contains(target) && !isAffordanceClicked) {
        onClose();
      }
    }
  };

  const closePanel = () => {
    setIsAffordanceClicked(false);
  };

  const openModal = (frameUrl: string) => {
    setSelectedFrameUrl(frameUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFrameUrl(null);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside, isOpen]);

  useEffect(() => {
    const loadFrameImages = async () => {
      const updatedFrames = await Promise.all(
        framesData.map(async (frame) => {
          const imageUrl = await fetchFrameImage(frame.link);
          return { ...frame, image: imageUrl };
        })
      );
      setFrameList(updatedFrames);
    };

    loadFrameImages();
  }, []);
  const fetchFrameImage = async (frameUrl: string): Promise<string | null> => {
    try {
      const response = await fetch(frameUrl);
      const htmlText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      const metaTag = doc.querySelector('meta[property="fc:frame:image"]');
      return metaTag?.getAttribute('content') || null;
    } catch (error) {
      console.error('Error fetching frame image:', error);
      return null;
    }
  };
  
  return (
    <>
      <div className="opacity-100">
        {/* Overlay */}
        <div className={`fixed inset-0 flex transition-transform transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div ref={panelRef} className="relative w-64 h-full bg-purplePanel shadow-md ml-auto">
            <div className="flex items-left p-4 ml-2">
              <span className="text-notWhite mr-5 font-semibold">Mini Apps</span>
              <button
                className="absolute top-2 right-2 p-1 mt-1 mr-1 text-lightPurple font-semibold"
                onClick={() => {
                  setIsAffordanceClicked(true);
                  closePanel();
                  onClose();
                }}
              >
                x
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[90vh]">
              {frameList.map((frame, index) => (
                <div key={index} className="mb-4">
                  <button onClick={() => openModal(frame.link)} className="flex items-center space-x-4">
                    {frame.image ? (
                      <Image src={frame.image} alt={frame.name} width={50} height={50} className="rounded" />
                    ) : (
                        <Image src={placeholderImageUrl} alt="Loading..." width={50} height={50} className="rounded" /> // Using defifa_spinner as a placeholder
                    )}
                    <span className="text-notWhite">{frame.name}</span>
                  </button>
                </div>
              ))}
            </div>
            <button
              className="absolute bottom-6 right-4 p-1 text-lightPurple font-semibold"
              onClick={() => {
                setIsAffordanceClicked(true);
                closePanel();
                onClose();
              }}
            >
              <FontAwesomeIcon className="h-6 w-6" icon={faBuilding} style={{ color: '#C0B2F0' }} />
              <p className="text-xxs" style={{ color: '#C0B2F0' }}>Close</p>
            </button>
          </div>
        </div>
      </div>

      {/* Frame Modal frameUrl={selectedFrameUrl} */}
      <FrameModal isOpen={isModalOpen} onRequestClose={closeModal} frameUrl={selectedFrameUrl} />
    </>
  );
};

export default SlideOutPanel;
