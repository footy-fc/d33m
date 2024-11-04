// FooterNav.js
import React, { FC, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFutbolBall, faSquare, faIdBadge, faCircleUser, faNewspaper, faListAlt, faFontAwesomeFlag } from '@fortawesome/free-regular-svg-icons';

interface FooterNavProps {
  onLobbyClick: () => void;
  onBadgeClick: () => void;
  onWalletClick: () => void;
  onAIClick: () => void;
  isGantry: boolean;
  /*onFrameClick: () => void;
  onTableClick: () => void; */
}

//const FooterNav: FC<FooterNavProps> = ({ onLobbyClick, onBadgeClick, onAIClick, onWalletClick, onTableClick, onFrameClick}) => {
const FooterNav: FC<FooterNavProps> = ({ onLobbyClick, onBadgeClick, onAIClick, onWalletClick, isGantry}) => {

    return (
    <div className="flex justify-between items-center p-2">
      <button onClick={onLobbyClick} className="flex flex-col items-center">
        <FontAwesomeIcon className="h-6 w-6" icon={faFutbolBall} style={{ color: '#C0B2F0'}} />
        <p className="text-xxs" style={{ color: '#C0B2F0' }}>Matches</p>
      </button>

      <button onClick={onBadgeClick} className="flex flex-col items-center">
        <FontAwesomeIcon className="h-6 w-6" icon={faIdBadge} style={{ color: '#C0B2F0' }} />
        <p className="text-xxs" style={{ color: '#C0B2F0' }}>Club Badge</p>
      </button>
      
      <button disabled={isGantry} onClick={onAIClick} className="flex flex-col items-center">
        {/* change color and set cursor to none if isGantry is true */}
      {/* <FontAwesomeIcon className={`h-6 w-6 ${isGantry ? 'cursor-none': ''}`} icon={faNewspaper} style={{ color: ` ${isGantry ? 'gray': ' #C0B2F0'}` }} /> */}

        <FontAwesomeIcon className={`h-6 w-6 ${isGantry ? 'cursor-none': ''}`} icon={faNewspaper} style={{ color: `#C0B2F0` }} />
        <p className="text-xxs" style={{ color: '#C0B2F0' }}>AI News</p>
      </button>
     {/*}
      <button onClick={onFrameClick} className="flex flex-col items-center">
        <FontAwesomeIcon className="h-6 w-6" icon={faSquare} style={{ color: '#C0B2F0' }} />
        <p className="text-xxs" style={{ color: '#C0B2F0' }}>Frame</p>
      </button> 
      
     <button onClick={onPlayerClick} className="flex flex-col items-center">
        <FontAwesomeIcon className="h-6 w-6" icon={faIdBadge} style={{ color: '#C0B2F0' }} />
        <p className="text-xxs" style={{ color: '#C0B2F0' }}>Players</p>
      </button>
      
      <button onClick={onTableClick} className="flex flex-col items-center">
        <FontAwesomeIcon className="h-6 w-6" icon={faListAlt} style={{ color: '#C0B2F0' }} />
        <p className="text-xxs" style={{ color: '#C0B2F0' }}>FEPL Table</p>
      </button>
    
      <button onClick={onWalletClick} className="flex flex-col items-center">
        <FontAwesomeIcon className="h-6 w-6" icon={faCircleUser} style={{ color: '#C0B2F0' }} />
        <p className="text-xxs" style={{ color: '#C0B2F0' }}>Account</p>
      </button> */}
    </div>
  );  
};

export default FooterNav;
      