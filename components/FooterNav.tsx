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
}

const FooterNav: FC<FooterNavProps> = ({ onLobbyClick, onBadgeClick, onAIClick, onWalletClick, onFrameClick}) => {
    return (
    <div className="flex justify-between items-center p-2">
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
        <p className="text-xxs" style={{ color: '#C0B2F0' }}>Match Summary</p>
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
      