import { useState, useEffect } from 'react';
import Gun from 'gun';
import { GunPeers } from '../constants/constants';

interface MyGunData {
  message: string;
  // ... other fields
}

const gun = Gun({
    peers: GunPeers, // specify your GunDB peers
});


const useCustomProfileData = (path: string, casterID: number) => {
  const [data, setData] = useState<MyGunData | null>(null);

  useEffect(() => {
    const specificPath = `${path}/${casterID}`;
    const gunRef = gun.get(specificPath);

    gunRef.once((snapshot: { [x: string]: any; } | undefined) => {
      if (snapshot && typeof snapshot === 'object' && 'message' in snapshot) {
        setData(snapshot as MyGunData);
      } else {
        // Handle the case where snapshot is undefined or doesn't have the expected structure
        setData(null);
      }
    });

  }, [path, casterID]);

  return data?.message;
};



export default useCustomProfileData;