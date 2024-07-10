import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Message } from "@farcaster/core";
import useCustomProfileData from './useCustomProfileData';
import { customEmojis } from '../constants/customEmojis'; // Adjust the import path as necessary

interface UpdatedCast extends Message {
  fname: string;
  pfp: string;
  teamLogo: string;
}

interface CastItemProps {
  index: number;
  updatedCast: UpdatedCast;
  room: string;
}

interface CustomEmojis {
  [key: string]: string;
}

const CastItem: React.FC<CastItemProps> = ({ index, updatedCast, room }) => {
  const parsedUrl = room.replace('https://', '');
  const IMGAGE_WIDTH = 20;
  const [imageWidth, setImageWidth] = useState(IMGAGE_WIDTH);
  const [imageHeight, setImageHeight] = useState(IMGAGE_WIDTH);

  // Use the hook at the top level
  const profileData = useCustomProfileData(parsedUrl, updatedCast?.data?.fid ?? 2); // 2 is @v lol now the default
  const imageSrc = profileData ? "/assets/eur/" + profileData + ".png" : "/assets/eur/defifa_spinner.gif";

  useEffect(() => {
    const aspectRatio = imageWidth / IMGAGE_WIDTH;
    const newHeight = IMGAGE_WIDTH / aspectRatio;
    setImageHeight(newHeight);
  }, [imageWidth]);

  const replaceCustomEmojis = (text: string | undefined) => {
    return text?.replace(/:\d+:/g, (match) => {
      return customEmojis[match] || match;
    });
  };
    // Logic for processing cast data
    let textWithLinks = updatedCast?.data?.castAddBody?.text.replace(
      /(https?:\/\/[^\s]+)/g,
      (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-deepPink">${'External Link'}</a>`
    );
  
    textWithLinks = replaceCustomEmojis(textWithLinks);

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
            src={imageSrc}
            alt="Overlay Team Logo"
            className="w-5 h-5 p-0.5  rounded-full absolute right-0 top-0"
            style={{ transform: 'translate(40%, -40%)' }}
            width={imageWidth}
            height={imageHeight}
            onLoad={(e) => {
              const imgElement = e.target as HTMLImageElement;
              setImageWidth(imgElement.width);
            }}
          />
        </div>
        <span className="text-sm ml-2 text-notWhite font-semibold">
          {updatedCast.fname}
          <span
            className="text-sm ml-2 text-lightPurple font-normal break-words"
            dangerouslySetInnerHTML={{ __html: textWithLinks ?? '' }}
          ></span>
        </span>
      </div>
    );
  };
  
  export default CastItem;