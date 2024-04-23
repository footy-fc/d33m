import {usePrivy} from '@privy-io/react-auth';
import { ReactElement, JSXElementConstructor, ReactNode, PromiseLikeOfReactNode } from 'react';
import { ToastContainer, ToastContentProps, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function SignMessageButton() {
  const {signMessage} = usePrivy();
  const message = 'I promise to abide by the rules of the game.';
  const uiConfig = {
    title: 'Games are settled using a "social" contract',
    description: 'Nothing is stopping players from reneging on thier promises, except the community. Choose who you play with wisely.',
    buttonText: 'Cast this message in stone',
  };
  const notify = (message: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | PromiseLikeOfReactNode | ((props: ToastContentProps<unknown>) => ReactNode) | null | undefined) => toast(message);

  return (
    <>
    <button
      onClick={async () => {
        try {
          const signature = await signMessage(message, uiConfig);
        } catch (error: any) {
          console.error(error);
          notify(error.message);
          // Do something with the error
        }

      }}
    >
      Agree to the rules of the game
    </button>
    <ToastContainer
      position="top-center"
    />
              </>
  );
}

export default SignMessageButton;