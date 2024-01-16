import Link from "next/link";
import { FC } from "react";

interface WarpcastLoginProps {
    deepLink: string;
}

const WarpcastLogin: FC<WarpcastLoginProps> = ({ deepLink }) => {

    return (
        <div className="p-4 flex-grow">
        <Link href={deepLink}>
          <button
            className="flex items-center gap-2 bg-deepPink text-white font-medium py-2 px-4 rounded-md mt-2"
          >
            Authenticate with Warpcast
          </button>
        </Link>
      </div>
    );
}

export default WarpcastLogin;