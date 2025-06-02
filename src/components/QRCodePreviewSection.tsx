import React, { useCallback } from "react";
import { QRCodeModel } from "@/types/qrcode";
import StyledQRCode from "./StyledQRCode";
import Image from "next/image";
import { toPng } from "html-to-image";

interface QRCodePreviewSectionProps {
  model: QRCodeModel;
  updateStyle: (updates: Partial<QRCodeModel["style"]>) => void;
  handleTextEdit: (field: string) => void;
  handleTextEditComplete: (e: React.KeyboardEvent) => void;
  updateUI: (updates: Partial<QRCodeModel["ui"]>) => void;
  previewRef?: React.RefObject<HTMLDivElement | null>;
}

const Divider: React.FC<{ color: string }> = React.memo(({ color }) => (
  <div
    className="w-full h-1 mb-4"
    style={{ backgroundColor: color }}
  ></div>
));

Divider.displayName = "Divider";

const QRCodePreviewSection: React.FC<QRCodePreviewSectionProps> = ({
  model,
  updateStyle,
  handleTextEdit,
  handleTextEditComplete,
  updateUI,
  previewRef,
}) => {
    const handleDownloadPng = useCallback(async () => {
      if (!previewRef?.current) return;
      try {
        const dataUrl = await toPng(previewRef.current, {
          quality: 0.92,
          pixelRatio: 2,
        });
        
        const blob = await fetch(dataUrl).then(res => res.blob());
        const blobUrl = URL.createObjectURL(blob);
        
        const newWindow = window.open(blobUrl, '_blank');
        
        if (newWindow) {
          setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
          }, 100);
        } else {
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = `qrcode-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        }
      } catch (err) {
        console.error("Image could not be downloaded:", err);
      }
    }, [previewRef]);

  return (
  <aside className="w-full min-h-screen lg:block">
    <div className="lg:sticky lg:top-20">
      <div
        ref={previewRef}
        className="bg-white rounded-2xl shadow-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.18)] p-8 flex flex-col items-center"
      >
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          {/* Title Area */}
          <div className="text-center mb-2">
            {model.ui.isEditing === "title" ? (
              <input
                type="text"
                value={model.style.title}
                onChange={(e) => updateStyle({ title: e.target.value })}
                onKeyDown={handleTextEditComplete}
                onBlur={() => updateUI({ isEditing: null })}
                className="text-3xl font-bold border border-gray-300 rounded px-2 py-1 w-full text-center"
                autoFocus
              />
            ) : (
              <h1
                className="text-5xl font-bold cursor-pointer relative group"
                style={{ color: model.style.titleColor }}
                onClick={() => handleTextEdit("title")}
              >
                {model.style.title}
                <span className="absolute inset-0 border-2 border-dashed border-blue-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Click to edit</span>
              </h1>
            )}
          </div>

          {/* Divider */}
          {model.style.showDivider && (
            <Divider color={model.style.dividerColor} />
          )}

          {/* Subtitle Area */}
          <div className="text-center mb-8">
            {model.ui.isEditing === "subtitle" ? (
              <input
                type="text"
                value={model.style.subtitle}
                onChange={(e) => updateStyle({ subtitle: e.target.value })}
                onKeyDown={handleTextEditComplete}
                onBlur={() => updateUI({ isEditing: null })}
                className="text-xl border border-gray-300 rounded px-2 py-1 w-full text-center"
                autoFocus
              />
            ) : (
              <h2
                className="text-3xl cursor-pointer relative group"
                style={{ color: model.style.subtitleColor }}
                onClick={() => handleTextEdit("subtitle")}
              >
                {model.style.subtitle}
                <span className="absolute inset-0 border-2 border-dashed border-blue-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Click to edit</span>
              </h2>
            )}
          </div>

          {/* QR Code Drawing Frame */}
          <div
            className="mx-auto w-64 h-64 p-4 rounded-2xl border-2 border-gray-200 bg-white flex items-center justify-center relative"
            style={{ borderColor: model.style.qrBorderColor }}
          >
            <StyledQRCode
              value={model.content || "https://paneratech.com"}
              size={model.style.size}
              dotsOptions={
                model.style.dotsOptions || {
                  type: "square",
                  color: model.style.foregroundColor,
                }
              }
              backgroundColor={model.style.backgroundColor}
              foregroundColor={model.style.foregroundColor}
              eyeColor={model.style.eyeColor}
              level={model.style.level}
            />
            {/* Logo Overlay (If exists) */}
            {model.style.logoImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white p-1 rounded">
                  <Image
                    src={model.style.logoImage}
                    alt="Logo"
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Area */}
          <div className="mt-6 text-center">
            {model.ui.isEditing === "footer" ? (
              <input
                type="text"
                value={model.style.footerText}
                onChange={(e) => updateStyle({ footerText: e.target.value })}
                onKeyDown={handleTextEditComplete}
                onBlur={() => updateUI({ isEditing: null })}
                className="text-sm border border-gray-300 rounded px-2 py-1 w-full text-center"
                autoFocus
              />
            ) : model.style.footerText ? (
              <p
                className="text-sm cursor-pointer relative group"
                onClick={() => handleTextEdit("footer")}
              >
                {model.style.footerText}
                <span className="absolute inset-0 border-2 border-dashed border-blue-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Click to edit</span>
              </p>
            ) : null}

            {model.style.footerImage && (
              <div className="mt-2 flex justify-center">
                <Image
                  src={model.style.footerImage}
                  alt="Footer"
                  width={80}
                  height={40}
                  className="h-10 object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8 sticky bottom-0">
        <button
          type="button"
          onClick={handleDownloadPng}
          className="btn btn-primary w-full max-w-xs"
          aria-label="Download QR Code"
          tabIndex={0}
      >
          Download
        </button>
      </div>
    </div>
  </aside>
  );
};

export default QRCodePreviewSection;
