"use client";

import React, { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import { HexColorPicker } from "react-colorful";
import { toPng, toJpeg } from "html-to-image";
import Image from "next/image";

interface QrCodeTemplateProps {
  qrValue: string;
  defaultTitle?: string;
  defaultSubtitle?: string;
  defaultFooterText?: string;
  defaultTitleColor?: string;
  defaultSubtitleColor?: string;
  defaultBackgroundColor?: string;
  defaultBorderColor?: string;
  logo?: string;
  footerImage?: string;
  onBorderColorChange?: (color: string) => void;
  onTitleChange?: (title: string) => void;
}

const QrCodeTemplate: React.FC<QrCodeTemplateProps> = ({
  qrValue,
  defaultTitle,
  defaultSubtitle,
  defaultFooterText,
  defaultTitleColor,
  defaultSubtitleColor,
  defaultBackgroundColor,
  defaultBorderColor,
  logo,
  footerImage,
  onBorderColorChange,
  onTitleChange,
}) => {
  const [title, setTitle] = useState(defaultTitle);
  const [subtitle, setSubtitle] = useState(defaultSubtitle);
  const [footerText, setFooterText] = useState(defaultFooterText);
  const [titleColor, setTitleColor] = useState(defaultTitleColor);
  const [subtitleColor, setSubtitleColor] = useState(defaultSubtitleColor);
  const [backgroundColor, setBackgroundColor] = useState(
    defaultBackgroundColor
  );
  const [borderColor, setBorderColor] = useState(defaultBorderColor);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(logo || null);
  const [selectedFooterImage, setSelectedFooterImage] = useState<string | null>(
    footerImage || null
  );
  const templateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onTitleChange && title) {
      onTitleChange(title);
    }
  }, [title, onTitleChange]);

  useEffect(() => {
    if (onBorderColorChange && borderColor) {
      onBorderColorChange(borderColor);
    }
  }, [borderColor, onBorderColorChange]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setSelectedLogo(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Footer image upload function
  const handleFooterImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setSelectedFooterImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Show/hide color picker
  const toggleColorPicker = (picker: string) => {
    setShowColorPicker(showColorPicker === picker ? null : picker);
  };

  // Download functions
  const downloadAsImage = (format: "png" | "jpeg") => {
    if (!templateRef.current) return;

    const scale = 2; // 2x scale for high quality
    const options = {
      height: templateRef.current.offsetHeight * scale,
      width: templateRef.current.offsetWidth * scale,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: `${templateRef.current.offsetWidth}px`,
        height: `${templateRef.current.offsetHeight}px`,
      },
      quality: 0.95,
    };

    const exportFn = format === "png" ? toPng : toJpeg;

    exportFn(templateRef.current, options)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `qr-code-template.${format}`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Error occurred during QR code download:", err);
      });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Template Preview */}
      <div
        ref={templateRef}
        className="qr-template mx-auto w-full max-w-md p-8 rounded-xl shadow-lg relative overflow-hidden"
        style={{ backgroundColor, border: `2px solid ${borderColor}` }}
      >
        {/* Title Area */}
        <div className="text-center mb-2">
          <h1
            className="text-5xl font-bold cursor-default"
            style={{ color: titleColor }}
          >
            {title}
          </h1>
        </div>
        {/* Subtitle Area */}
        {subtitle && (
          <div className="text-center mb-8">
            <h2
              className="text-3xl cursor-default"
              style={{ color: subtitleColor }}
            >
              {subtitle}
            </h2>
          </div>
        )}
        {/* Line */}
        <div
          className="w-full h-1 mb-8"
          style={{ backgroundColor: borderColor }}
        ></div>
        {/* QR Code Drawing Frame */}
        <div
          className="mx-auto w-64 h-64 p-4 rounded-2xl border-2 border-gray-200 bg-white flex items-center justify-center relative"
          style={{ borderColor }}
        >
          <QRCode
            value={qrValue || "https://paneratech.com"}
            size={200}
            fgColor={borderColor}
            bgColor="#FFFFFF"
          />
          {/* Logo Overlay (If available) */}
          {selectedLogo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white p-1 rounded">
                <Image
                  src={selectedLogo}
                  alt="Logo"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>
        {/* Footer Information Area */}
        {footerText && (
          <div className="mt-6 text-center">
            <p className="text-sm cursor-default">{footerText}</p>
            {selectedFooterImage && (
              <div className="mt-2 flex justify-center">
                <Image
                  src={selectedFooterImage}
                  alt="Footer"
                  width={80}
                  height={40}
                  className="h-10 object-contain"
                  unoptimized
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Template Settings and Download Buttons shown only if not preview */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">Template Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Text Settings */}
          <div className="space-y-4">
            <div>
              <label className="form-label">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input w-full"
              />
            </div>

            <div>
              <label className="form-label">Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="input w-full"
              />
            </div>

            <div>
              <label className="form-label">Footer Text</label>
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                className="input w-full"
              />
            </div>
          </div>

          {/* Color Settings */}
          <div className="space-y-4">
            <div>
              <label className="form-label">Title Color</label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  style={{ backgroundColor: titleColor }}
                  onClick={() => toggleColorPicker("titleColor")}
                />
                <input
                  type="text"
                  value={titleColor}
                  onChange={(e) => setTitleColor(e.target.value)}
                  className="input w-full"
                />
              </div>
              {showColorPicker === "titleColor" && (
                <div className="mt-2">
                  <HexColorPicker color={titleColor} onChange={setTitleColor} />
                </div>
              )}
            </div>

            <div>
              <label className="form-label">Subtitle Color</label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  style={{ backgroundColor: subtitleColor }}
                  onClick={() => toggleColorPicker("subtitleColor")}
                />
                <input
                  type="text"
                  value={subtitleColor}
                  onChange={(e) => setSubtitleColor(e.target.value)}
                  className="input w-full"
                />
              </div>
              {showColorPicker === "subtitleColor" && (
                <div className="mt-2">
                  <HexColorPicker
                    color={subtitleColor}
                    onChange={setSubtitleColor}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="form-label">QR Code Color</label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  style={{ backgroundColor: borderColor }}
                  onClick={() => toggleColorPicker("borderColor")}
                />
                <input
                  type="text"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  className="input w-full"
                />
              </div>
              {showColorPicker === "borderColor" && (
                <div className="mt-2">
                  <HexColorPicker
                    color={borderColor}
                    onChange={setBorderColor}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="form-label">Background Color</label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  style={{ backgroundColor }}
                  onClick={() => toggleColorPicker("backgroundColor")}
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="input w-full"
                />
              </div>
              {showColorPicker === "backgroundColor" && (
                <div className="mt-2">
                  <HexColorPicker
                    color={backgroundColor}
                    onChange={setBackgroundColor}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Upload Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="form-label">Logo (Center)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="input w-full"
            />
            {selectedLogo && (
              <div className="mt-2 flex items-center gap-2">
                <Image
                  src={selectedLogo}
                  alt="Logo Preview"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                  unoptimized
                />
                <button
                  onClick={() => setSelectedLogo(null)}
                  className="btn btn-sm btn-ghost text-red-500"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="form-label">Footer Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFooterImageUpload}
              className="input w-full"
            />
            {selectedFooterImage && (
              <div className="mt-2 flex items-center gap-2">
                <Image
                  src={selectedFooterImage}
                  alt="Footer Preview"
                  width={64}
                  height={32}
                  className="h-8 object-contain"
                  unoptimized
                />
                <button
                  onClick={() => setSelectedFooterImage(null)}
                  className="btn btn-sm btn-ghost text-red-500"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Download Buttons - Add to the end of the grid */}
        <div className="mt-8 flex flex-col gap-4">
          <h3 className="font-semibold">Download QR Code</h3>
          <div className="flex gap-4">
            <button
              onClick={() => downloadAsImage("png")}
              className="btn btn-primary flex-1"
            >
              Download as PNG
            </button>
            <button
              onClick={() => downloadAsImage("jpeg")}
              className="btn btn-secondary flex-1"
            >
              Download as JPEG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCodeTemplate;
