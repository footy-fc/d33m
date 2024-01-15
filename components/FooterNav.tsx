// FooterNav.js
import React, { FC, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faArrowAltCircleUp, faIdBadge, faCircleUser } from '@fortawesome/free-regular-svg-icons';

interface FooterNavProps {
  onLobbyClick: () => void;
  onBadgeClick: () => void;
  onShareClick: () => void;
  onSetupClick: () => void;
  apiKeyVisible: boolean;
  openAiApiKey: string;
  handleApiKeyChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FooterNav: FC<FooterNavProps> = ({ onLobbyClick, onBadgeClick, onShareClick, onSetupClick, apiKeyVisible, openAiApiKey,handleApiKeyChange}) => {
      
    return (
    <div className="flex justify-between items-center p-2 mb-2">
      <button onClick={onLobbyClick} className="flex flex-col items-center">
        <FontAwesomeIcon icon={faBuilding} style={{ color: '#C0B2F0', fontSize: '24px' }} />
        <p className="text-xxs" style={{ color: '#C0B2F0' }}>Lobby</p>
      </button>

      <button onClick={onBadgeClick} className="flex flex-col items-center">
        <FontAwesomeIcon icon={faIdBadge} style={{ color: '#C0B2F0', fontSize: '24px' }} />
        <p className="text-xxs" style={{ color: '#C0B2F0' }}>Badge</p>
      </button>

      <button onClick={onShareClick} className="text-md text-lightPurple font-semibold text-medium">
        <FontAwesomeIcon icon={faArrowAltCircleUp} style={{ color: '#C0B2F0', fontSize: '24px' }} />
        <p className="text-xxs" style={{ color: '#C0B2F0' }}>Share</p>
      </button>

      <div className={`flex ${apiKeyVisible ? 'flex-row' : 'flex-col'} items-center text-md`} style={{ color: '#C0B2F0' }}>
        <div onClick={onSetupClick} className="cursor-pointer flex flex-col items-center">
          <FontAwesomeIcon icon={faCircleUser} style={{ color: '#C0B2F0', fontSize: '24px' }} />
          <p className={`text-xxs ${apiKeyVisible ? 'ml-1 mr-1' : ''} text-center`}>Setup</p>
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
      </div>
    </div>
  );
};

export default FooterNav;
