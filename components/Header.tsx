interface HeaderProps {
  isConnected: boolean;  
  openPanel: () => void;
  //casterFname: string[] | undefined;
  targetUrl: string;
}

const Header: React.FC<HeaderProps> = ({ isConnected, openPanel, targetUrl }) => {
  return (
    <div>
      <div className="flex items-center justify-between p-4 bg-deepPink">
        <button className="text-2xl font-semibold text-lightPurple flex items-center" onClick={openPanel}>
          <span className="mr-2 flex items-center text-2xl">☰</span>
        </button>
        <div className="text-md font-semibold text-notWhite flex items-center">
          {targetUrl.startsWith("chain://eip155") ? "football" : new URL(targetUrl).pathname.replace(/^\/+/g, '')}
        </div>
      </div>
    </div>
    );
};

export default Header;

