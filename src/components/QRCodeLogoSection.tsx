import React, { ChangeEvent, useRef } from "react";
import { QRCodeModel } from "@/types/qrcode";
import Image from "next/image";

interface QRCodeLogoSectionProps {
  model: QRCodeModel;
  handleLogoUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFooterImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  updateStyle: (updates: Partial<QRCodeModel["style"]>) => void;
}

const QRCodeLogoSection: React.FC<QRCodeLogoSectionProps> = ({
  model,
  handleLogoUpload,
  handleFooterImageUpload,
  updateStyle,
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const footerInputRef = useRef<HTMLInputElement>(null);

  const handleRemoveLogo = () => {
    updateStyle({ logoImage: null });
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  const handleRemoveFooter = () => {
    updateStyle({ footerImage: null });
    if (footerInputRef.current) {
      footerInputRef.current.value = "";
    }
  };

  return (
    <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Logo</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Logo (Center)</label>
          <label
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary transition group"
            style={{ minHeight: 120 }}
          >
            <span className="text-gray-500 group-hover:text-primary text-lg font-semibold">
              Upload
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              ref={logoInputRef}
            />
          </label>
          {model.style.logoImage && (
            <div className="mt-2 flex items-center gap-2">
              <Image
                src={model.style.logoImage}
                alt="Logo Preview"
                width={40}
                height={40}
                className="w-10 h-10 object-contain rounded"
              />
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="btn btn-sm btn-ghost text-red-500"
              >
                Remove
              </button>
            </div>
          )}
        </div>
        <div>
          <label className="form-label">Footer Image</label>
          <label
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary transition group"
            style={{ minHeight: 120 }}
          >
            <span className="text-gray-500 group-hover:text-primary text-lg font-semibold">
              Upload
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFooterImageUpload}
              className="hidden"
              ref={footerInputRef}
            />
          </label>
          {model.style.footerImage && (
            <div className="mt-2 flex items-center gap-2">
              <Image
                src={model.style.footerImage}
                alt="Footer Preview"
                width={60}
                height={32}
                className="h-8 object-contain rounded"
              />
              <button
                type="button"
                onClick={handleRemoveFooter}
                className="btn btn-sm btn-ghost text-red-500"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeLogoSection;
