import Link from "next/link";
import QRCode from "react-qr-code";
import { FC } from "react";

interface WarpcastLoginProps {
    deepLink: string;
}

const QRCodeMobile: FC<WarpcastLoginProps> = ({ deepLink }) => {

    return (
        <div className="p-4 flex flex-col items-center justify-center">
        <div style={{ height: "auto", margin: "0 auto", maxWidth: 150, width: "100%" }}>
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={deepLink}
            viewBox={`0 0 256 256`}
          />
          <span className="block text-fontRed text-center text-lg mt-2">Login with Warpcast</span>
        </div>
    </div>
    );
};

export default QRCodeMobile;