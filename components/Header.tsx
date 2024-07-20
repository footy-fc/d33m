<<<<<<< HEAD
=======
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NeynarSIWE from './NeynarSIWE';

>>>>>>> origin/main
interface HeaderProps {
  isConnected: boolean;  
  openPanel: () => void;
  //casterFname: string[] | undefined;
  targetUrl: string;
}

const Header: React.FC<HeaderProps> = ({ isConnected, openPanel, targetUrl }) => {
  return (
    <div>
      <div className="flex items-center justify-between p-2 bg-deepPink">
        <button className="text-2xl font-semibold text-lightPurple flex items-center" onClick={openPanel}>
          <span className="mr-4 flex items-center text-2xl">☰</span>
        </button>
<<<<<<< HEAD
        <div className="text-md mr-2 font-semibold text-notWhite flex items-center">
=======
        <div className="text-md font-semibold text-notWhite flex items-center">
          {casterFname === undefined ? "loading..." : ` `}
>>>>>>> origin/main
          {targetUrl.startsWith("chain://eip155") ? "football" : new URL(targetUrl).pathname.replace(/^\/+/g, '')}
        </div>
      </div>
      <NeynarSIWE />
    </div>
    );
};

export default Header;

