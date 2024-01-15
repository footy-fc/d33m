import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Message } from "@farcaster/hub-web";
  
interface UpdatedCast extends Message {
    fname: string;
    pfp: string;
    teamLogo: string;
  }
interface CastItemProps {
    index: number;
    updatedCast: UpdatedCast;
  }
  
  // CastItem Component
const CastItem: React.FC<CastItemProps> = ({ index, updatedCast }) => {
    const IMGAGE_WIDTH = 20; 
    const [imageWidth, setImageWidth] = useState(IMGAGE_WIDTH); // Set the initial width
    const [imageHeight, setImageHeight] = useState(IMGAGE_WIDTH); // Set the initial height
    
     // Calculate the aspect ratio and update the height
    useEffect(() => {
        const aspectRatio = imageWidth / IMGAGE_WIDTH; // Assuming the original width is 20
        const newHeight = IMGAGE_WIDTH / aspectRatio;
        setImageHeight(newHeight);
    }, [imageWidth]);

    // Logic for processing cast data
    const textWithLinks = updatedCast?.data?.castAddBody?.text.replace(
      /(https?:\/\/[^\s]+)/g,
      (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-deepPink">${'External Link'}</a>`
    );
  
    return (
        <div key={index} className="flex bg-darkPurple p-2 ml-2 mr-2 items-start">
        <div className="relative min-w-8 mr-2">
          <Image
            src={updatedCast.pfp || '/assets/defifa_spinner.gif'}
            alt="Author Avatar"
            className="rounded-full w-8 h-8"
            width={24}
            height={24}
          />
          <Image
            src={"/assets/epl/" + updatedCast.teamLogo}
            alt="Overlay Team Logo"
            className="w-5 h-5 p-0.5 bg-deepPink rounded-full absolute right-0 top-0"
            style={{ transform: 'translate(40%, -40%)' }} // Adjusted to 20% overlap
            width={imageWidth}
            height={imageHeight}
            onLoad={(e) => {
              const imgElement = e.target as HTMLImageElement;
              setImageWidth(imgElement.width);
            }}
          />
        </div>
        <span className="text-sm ml-2 text-notWhite font-semibold">
          {typeof updatedCast.fname === 'object' ? updatedCast.fname : updatedCast.fname}
          {" "}
          <span
            className="text-sm text-lightPurple font-normal"
            dangerouslySetInnerHTML={{
              __html: textWithLinks ?? '',
            }}
          ></span>
        </span>
      </div>
    );
  };
  
  export default CastItem;
  