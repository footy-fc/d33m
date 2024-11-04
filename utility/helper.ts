export const getRoomName = (targetURL: string) => {
  const urlObj = new URL(targetURL);
  // Split the pathname by '/' and filter out any empty strings
  const pathSegments = urlObj.pathname.split('/').filter(segment => segment);
  // Return the last segment as the name
  return pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : null;

    };