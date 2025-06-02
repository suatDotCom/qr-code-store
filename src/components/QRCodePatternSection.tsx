import React from "react";
import { QRCodeModel } from "@/types/qrcode";
import { HexColorPicker } from "react-colorful";
import Image from "next/image";
import SearchableDropdown from "./SearchableDropdown";

interface QRCodePatternSectionProps {
  model: QRCodeModel;
  updateStyle: (updates: Partial<QRCodeModel["style"]>) => void;
}

const patternTypes = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "dots", label: "Dots" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy Rounded" },
  { value: "extra-rounded", label: "Extra Rounded" },
] as const;

type PatternType = (typeof patternTypes)[number]["value"];

// SVG icons
const patternIcons: Record<PatternType, React.JSX.Element> = {
  square: (
    <Image
      src="/qr-patterns/square.png"
      alt="Square QR Pattern"
      width={100}
      height={100}
      style={{ objectFit: "contain" }}
    />
  ),
  rounded: (
    <Image
      src="/qr-patterns/rounded.png"
      alt="Rounded QR Pattern"
      width={100}
      height={100}
      style={{ objectFit: "contain" }}
    />
  ),
  dots: (
    <Image
      src="/qr-patterns/dots.png"
      alt="Dots QR Pattern"
      width={100}
      height={100}
      style={{ objectFit: "contain" }}
    />
  ),
  classy: (
    <Image
      src="/qr-patterns/classy.png"
      alt="Classy QR Pattern"
      width={100}
      height={100}
      style={{ objectFit: "contain" }}
    />
  ),
  "classy-rounded": (
    <Image
      src="/qr-patterns/classy-rounded.png"
      alt="Classy Rounded QR Pattern"
      width={100}
      height={100}
      style={{ objectFit: "contain" }}
    />
  ),
  "extra-rounded": (
    <Image
      src="/qr-patterns/extra-rounded.png"
      alt="Extra Rounded QR Pattern"
      width={100}
      height={100}
      style={{ objectFit: "contain" }}
    />
  ),
};

const QRCodePatternSection: React.FC<QRCodePatternSectionProps> = ({
  model,
  updateStyle,
}) => {
  const safeDotsOptions = React.useMemo(
    () =>
      model.style.dotsOptions ?? {
        type: "square",
        color: "#000",
      },
    [model.style.dotsOptions]
  );

  // State to manage open color picker
  const [showColorPicker, setShowColorPicker] = React.useState<
    null | "pattern" | "qrBorder" | "eyeColor"
  >(null);

  // Close picker when clicked outside
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const pickers = document.querySelectorAll(".color-picker-popover");
      let clickedInside = false;
      pickers.forEach((picker) => {
        if (picker.contains(e.target as Node)) clickedInside = true;
      });
      if (!clickedInside) setShowColorPicker(null);
    };
    if (showColorPicker) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showColorPicker]);

  // Pattern color changer
  const handlePatternColorChange = React.useCallback(
    (color: string) => {
      updateStyle({
        dotsOptions: {
          ...safeDotsOptions,
          color,
          type: safeDotsOptions.type as PatternType,
        },
      });
    },
    [safeDotsOptions, updateStyle]
  );

  const handleQRBorderColorChange = React.useCallback(
    (color: string) => {
      updateStyle({
        qrBorderColor: color,
      });
    },
    [updateStyle]
  );

  const handleEyeColorChange = React.useCallback(
    (color: string) => {
      updateStyle({
        eyeColor: color,
      });
    },
    [updateStyle]
  );

  // Common ColorPicker field
  const renderColorPickerField = (
    label: string,
    color: string,
    onColorChange: (color: string) => void,
    pickerKey: "pattern" | "qrBorder" | "eyeColor",
    inputId: string
  ) => (
    <div className="relative">
      <label className="block text-sm font-medium mb-2" htmlFor={inputId}>
        {label}
      </label>
      <div className="flex items-center gap-2 w-full">
        <div
          className="w-8 h-8 border border-gray-300 rounded cursor-pointer flex-shrink-0"
          style={{ backgroundColor: color }}
          onClick={() => setShowColorPicker(pickerKey)}
          tabIndex={0}
          aria-label={`${label} picker`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ")
              setShowColorPicker(pickerKey);
          }}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="input w-full"
          id={inputId}
        />
      </div>
      {showColorPicker === pickerKey && (
        <div className="color-picker-popover absolute z-20 mt-2">
          <HexColorPicker color={color} onChange={onColorChange} />
        </div>
      )}
    </div>
  );

  return (
    <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Body Patterns</h3>
      {/* Body Patterns */}
      <div className="mb-6">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {patternTypes.map((pattern) => (
            <div
              key={pattern.value}
              className={`cursor-pointer border p-3 rounded-md flex flex-col items-center justify-center transition-all duration-150 select-none ${
                safeDotsOptions.type === pattern.value
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-gray-300"
              }`}
              onClick={() =>
                updateStyle({
                  dotsOptions: {
                    ...safeDotsOptions,
                    type: pattern.value as PatternType,
                    color: safeDotsOptions.color || "#000",
                  },
                })
              }
              tabIndex={0}
              aria-label={`Pattern type: ${pattern.label}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  updateStyle({
                    dotsOptions: {
                      ...safeDotsOptions,
                      type: pattern.value as PatternType,
                      color: safeDotsOptions.color || "#000",
                    },
                  });
                }
              }}
              role="button"
            >
              {patternIcons[pattern.value as PatternType]}
            </div>
          ))}
        </div>
      </div>
      {/* Pattern Color, QR Border Color, and Eye Color: three columns side by side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {renderColorPickerField(
          "Pattern Color",
          safeDotsOptions.color,
          handlePatternColorChange,
          "pattern",
          "pattern-color-picker"
        )}
        {renderColorPickerField(
          "QR Border Color",
          model.style.qrBorderColor,
          handleQRBorderColorChange,
          "qrBorder",
          "qr-border-color-picker"
        )}
        {renderColorPickerField(
          "Eye Color",
          model.style.eyeColor,
          handleEyeColorChange,
          "eyeColor",
          "eye-color-picker"
        )}
      </div>
      {/* Error correction level and QR size fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Error Correction Level */}
        <div>
          <SearchableDropdown
            id="qr-level-select"
            label="Error Correction Level"
            placeholder="Select level"
            value={model.style.level}
            onChange={val => updateStyle({ level: val as QRCodeModel["style"]["level"] })}
            items={[
              { id: "L", name: "L (Low - 7%)" },
              { id: "M", name: "M (Medium - 15%)" },
              { id: "Q", name: "Q (High - 25%)" },
              { id: "H", name: "H (Very High - 30%)" },
            ]}
            required={false}
            disabled={false}
            className="w-full"
            hideCleanButton
          />
        </div>
        {/* QR Size */}
        <div>
          <label htmlFor="qr-size-slider" className="block text-sm font-medium mb-2">
            QR Size (px)
          </label>
          <div className="flex items-center gap-3 max-w-xs">
            <input
              id="qr-size-slider"
              type="range"
              min={128}
              max={280}
              step={8}
              className="w-full accent-primary"
              value={model.style.size}
              onChange={e => {
                const value = Math.max(128, Math.min(280, Number(e.target.value)));
                updateStyle({ size: value });
              }}
              aria-label="QR code size"
            />
            <span className="w-16 text-sm font-semibold text-center" aria-live="polite">{model.style.size} px</span>
          </div>
        </div>
      </div>
      {/* Other settings (color, corner, size, etc.) will be moved from the main form */}
    </div>
  );
};

export default QRCodePatternSection;
