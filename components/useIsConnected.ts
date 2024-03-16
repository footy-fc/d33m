import { useState, useEffect } from 'react';

const useIsConnected = () => {
  const [hookIsConnected, setIsConnected] = useState(false);
  const [hookCasterFID, setCasterFID] = useState(4163);
  const [hookSigner_uuid, setSigner_uuid] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const request = JSON.parse(localStorage.getItem("neynar-SignInData")!);
      setIsConnected(request?.is_authenticated || false);
      setCasterFID(request?.fid || 2);
      setSigner_uuid(request?.signer_uuid || '');
    }
  }, []);

  return {
    isConnected: hookIsConnected,
    casterFID: hookCasterFID,
    signer_uuid: hookSigner_uuid,
  };
};

export default useIsConnected;
