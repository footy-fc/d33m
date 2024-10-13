import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Message } from '@farcaster/core';
import useCustomProfileData from './useCustomProfileData';
import { customEmojis } from '../constants/customEmojis';
import { formatDistanceToNow, format } from 'date-fns'; // For human-readable timestamp
import { time } from 'console';

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
  const [imageSrc, setImageSrc] = useState<string>('/assets/eur/defifa_spinner.gif');

  // Hook for fetching profile data
  const profileData = useCustomProfileData(parsedUrl, updatedCast?.data?.fid ?? 2);

  // Process profile data for team logo
  useEffect(() => {
    if (profileData) {
      setImageSrc(`/assets/epl/${profileData}.png`);
    } else {
      setImageSrc('/assets/eur/defifa_spinner.gif');
    }
  }, [profileData]);

  // Adjust image height to maintain aspect ratio
  useEffect(() => {
    const aspectRatio = imageWidth / IMGAGE_WIDTH;
    const newHeight = IMGAGE_WIDTH / aspectRatio;
    setImageHeight(newHeight);
  }, [imageWidth]);

  // Replace emojis in text with custom emojis
  const replaceCustomEmojis = (text: string | undefined) => {
    return text?.replace(/:\d+:/g, (match) => {
      return customEmojis[match] || match;
    });
  };

  // Replace links with anchor tags and style the links
  let textWithLinks = updatedCast?.data?.castAddBody?.text?.replace(
    /(https?:\/\/[^\s]+)/g,
    (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-deepPink underline">${'External Link'}</a>`
  );

  textWithLinks = replaceCustomEmojis(textWithLinks);

  // Convert timestamp to human-readable format
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Timestamp is in seconds
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const detailedTime = (timestamp: any) => {
    const now = new Date();
    const date = new Date(timestamp * 1000);
    const isWithin24Hours = (now.getTime() - date.getTime()) < 24 * 60 * 60 * 1000;

    if (isWithin24Hours) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, 'MMM d, h:mm a'); // Example: "Oct 7, 5:30 PM"
    }
  };

  return (
    <div key={index} className="flex bg-darkPurple p-4 mb-3 rounded-lg items-start shadow-lg">
      {/* Profile Picture and Team Logo */}
      <div className="relative min-w-8 mr-4">
        <Image
          src={updatedCast.pfp || '/assets/defifa_spinner.gif'}
          alt="Author Avatar"
          className="rounded-full w-10 h-10"
          width={40}
          height={40}
        />
        <Image
          src={imageSrc}
          alt="Overlay Team Logo"
          className="w-6 h-6 p-0.5 rounded-full absolute right-0 top-0"
          style={{ transform: 'translate(30%, -30%)', border: '2px solid #181424' }}
          width={imageWidth}
          height={imageHeight}
          onLoad={(e) => {
            const imgElement = e.target as HTMLImageElement;
            setImageWidth(imgElement.width);
          }}
          onError={() => {
            setImageSrc('/assets/eur/defifa_spinner.gif'); // Fallback image on error
          }}
        />
      </div>

      {/* Cast Message and User Info */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          {/* User's Name */}
          <span className="text-sm text-notWhite font-semibold">{updatedCast.fname}</span>
          {/* Time: Human-readable timestamp TOP RIGHT CORNER */}
        </div>

        {/* Message Body */}
        <div className="text-sm mt-1 text-lightPurple font-normal leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: textWithLinks ?? '' }}></span>
        </div>

        {/* Detailed Timestamp  */}
        <div className="text-xs text-limeGreenOpacity mt-1">
          <span>{detailedTime(updatedCast?.data?.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

export default CastItem;
