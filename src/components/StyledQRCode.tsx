import React, { useEffect, useRef } from "react";
import QRCodeStyling, { Options } from "qr-code-styling";

interface StyledQRCodeProps {
  value: string;
  size: number;
  dotsOptions: {
    type:
      | "square"
      | "rounded"
      | "dots"
      | "classy"
      | "classy-rounded"
      | "extra-rounded";
    color: string;
  };
  backgroundColor: string;
  foregroundColor: string;
  eyeColor: string;
  level: "L" | "M" | "Q" | "H";
}

const StyledQRCode: React.FC<StyledQRCodeProps> = ({
  value,
  size,
  dotsOptions,
  backgroundColor,
  foregroundColor,
  eyeColor,
  level,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (qrRef.current) {
      qrRef.current.update({
        data: value,
        width: size,
        height: size,
        dotsOptions: {
          type: dotsOptions.type,
          color: dotsOptions.color,
        },
        backgroundOptions: { color: backgroundColor },
        cornersSquareOptions: { color: eyeColor },
        cornersDotOptions: { color: eyeColor },
        imageOptions: { crossOrigin: "anonymous", margin: 0 },
        qrOptions: { errorCorrectionLevel: level },
      });
    } else {
      qrRef.current = new QRCodeStyling({
        width: size,
        height: size,
        data: value,
        dotsOptions: {
          type: dotsOptions.type,
          color: dotsOptions.color,
        },
        backgroundOptions: { color: backgroundColor },
        cornersSquareOptions: { color: eyeColor },
        cornersDotOptions: { color: eyeColor },
        imageOptions: { crossOrigin: "anonymous", margin: 0 },
        qrOptions: { errorCorrectionLevel: level },
      } as Options);
      ref.current.innerHTML = "";
      qrRef.current.append(ref.current);
    }

    return () => {
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [value, size, dotsOptions, backgroundColor, foregroundColor, eyeColor, level]);

  return <div ref={ref} />;
};

export default StyledQRCode;
