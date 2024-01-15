const copyToClipboardAndShare = (targetUrl: string, isMobileDevice: boolean) => {
    if (navigator.clipboard) {
        if (targetUrl.includes('chain://eip155:1')) {
            console.log('targetUrl yes', targetUrl)
            targetUrl = window.location.origin+"lobby1"; // consider window.location.origin
            console.log('targetUrl done', targetUrl)
        };
        navigator.clipboard.writeText(targetUrl)
        .then(() => {
          console.log('Copied channel invite to clipboard', targetUrl);
          //const newWindow = 'https://warpcast.com/~/compose?text=Hey+I%27m+in+this+pop-up+channel+talk%27n+smack+about+the+beautiful+game.%0A%0AClick+the+link+to+join+me%21%0A%0A'; // WC
          const newWindow = 'https://twitter.com/intent/tweet?text=Hey+I%27m+in+this+pop-up+channel+talk%27n+smack+about+the+beautiful+game.%0A%0AClick+the+link+to+join+me%21%0A%0A';
          const fullUrl = newWindow + targetUrl;
         // window.open(fullUrl, '_blank');
         // Check if the Web Share API is supported
        if (navigator.share && isMobileDevice) {
          // Define the data you want to share
          const shareData = {
              title: 'd33m room',
              text: 'Join me in this pop-up channel and talk about the game.',
              url: targetUrl
          };

          // Call the share API
          navigator.share(shareData)
              .then(() => console.log('Share was successful.'))
              .catch((error) => console.error('Sharing failed', error));
        } else {
          console.log('Web Share API is not supported on this browser.');
          window.open(fullUrl, '_blank');
        }
        })
        .catch((error) => {
          console.error('Error copying to clipboard:', error);
        });
    } else {
      console.warn('Clipboard API not supported');
    }
  };
  export default copyToClipboardAndShare;
