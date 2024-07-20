// FooterNav.js
import React, { FC, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faSquare, faIdBadge, faCircleUser, faLightbulb } from '@fortawesome/free-regular-svg-icons';

interface FooterNavProps {
  onLobbyClick: () => void;
  onBadgeClick: () => void;
  onAIClick: () => void;
  onWalletClick: () => void;
  onFrameClick: () => void;
  apiKeyVisible: boolean;
  openAiApiKey: string;
  handleApiKeyChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FooterNav: FC<FooterNavProps> = ({ onLobbyClick, onBadgeClick, onAIClick, onWalletClick, onFrameClick}) => {
    return (
    <div className="flex justify-between items-center p-2 mb-1">
      <button onClick={onLobbyClick} className="flex flex-col items-center">
        <FontAwesomeIcon className="h-6 w-6" icon={faBuilding} style={{ color: '#C0B2F0'}} />
        <p className="text-xxs" style={{ color: '#C0B2F0' }}>Rooms</p>
      </button>

      <button onClick={onBadgeClick} className="flex flex-col items-center">
        <FontAwesomeIcon className="h-6 w-6" icon={faIdBadge} style={{ color: '#C0B2F0' }} />
        <p className="text-xxs" style={{ color: '#C0B2F0' }}>Club Badge</p>
      </button>

      <button onClick={onAIClick} className="flex flex-col items-center">
        <FontAwesomeIcon className="h-6 w-6" icon={faLightbulb} style={{ color: '#C0B2F0' }} />
        <p className="text-xxs" style={{ color: '#C0B2F0' }}>AI Summary</p>
      </button>

      <button onClick={onFrameClick} className="flex flex-col items-center">
        <FontAwesomeIcon className="h-6 w-6" icon={faSquare} style={{ color: '#C0B2F0' }} />
        <p className="text-xxs" style={{ color: '#C0B2F0' }}>Frame</p>
      </button> 

      <button onClick={onWalletClick} className="flex flex-col items-center">
        <FontAwesomeIcon className="h-6 w-6" icon={faCircleUser} style={{ color: '#C0B2F0' }} />
        <p className="text-xxs" style={{ color: '#C0B2F0' }}>Account</p>
      </button>
    </div>
  );
};

export default FooterNav;
{/*       <button onClick={onShareClick} className="flex flex-col items-center">
        <FontAwesomeIcon className="h-6 w-6" icon={faArrowAltCircleUp} style={{ color: '#C0B2F0' }} />
        <p className="text-xxs" style={{ color: '#C0B2F0' }}>Share</p>
      </button> */}

{/*       <div className={`flex ${apiKeyVisible ? 'flex-row' : 'flex-col'} items-center text-md`} style={{ color: '#C0B2F0' }}>
        <div onClick={onSetupClick} className="cursor-pointer flex flex-col items-center">
          <FontAwesomeIcon icon={faCircleUser} style={{ color: '#C0B2F0', fontSize: '24px' }} />
          <p className={`text-xxs ${apiKeyVisible ? 'ml-1 mr-1' : ''} text-center`}>Setup AI</p>
        </div>
        {apiKeyVisible && (
            <div className="text-md text-white mr-2">
                <input
                type="text"
                placeholder="Enter OpenAI APIKey"
                className="bg-transparent border-b border-white text-white text-sm focus:outline-none"
                value={openAiApiKey}
                onChange={handleApiKeyChange}
                />
            </div>
        )}      
      </div> */}
      