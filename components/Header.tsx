import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  isConnected: boolean;  
  openPanel: () => void;
  casterFname: string[] | undefined;
  targetUrl: string;
}

const Header: React.FC<HeaderProps> = ({ isConnected, openPanel, casterFname, targetUrl }) => {
  return isConnected ? (
    <div>
      <div className="flex items-center justify-between p-4 bg-deepPink">
        <button className="text-2xl font-semibold text-lightPurple flex items-center" onClick={openPanel}>
          <span className="mr-2 flex items-center text-2xl">☰</span>
        </button>
        <div className="text-md font-semibold text-notWhite flex items-center">
          {casterFname === undefined ? "loading..." : ` `}
          {targetUrl.startsWith("chain://eip155") ? "football" : new URL(targetUrl).pathname.replace(/^\/+/g, '')}
        </div>
      </div>
    </div>
  ):(
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
    );
};

export default Header;

