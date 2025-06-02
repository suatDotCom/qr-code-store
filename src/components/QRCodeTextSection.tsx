import React, { useRef, useEffect } from "react";
import { QRCodeModel } from "@/types/qrcode";
import { HexColorPicker } from "react-colorful";

interface QRCodeTextSectionProps {
  model: QRCodeModel;
  updateStyle: (updates: Partial<QRCodeModel["style"]>) => void;
  toggleColorPicker: (picker: string) => void;
}

const QRCodeTextSection: React.FC<QRCodeTextSectionProps> = ({
  model,
  updateStyle,
  toggleColorPicker,
}) => {
  const dividerPickerRef = useRef<HTMLDivElement>(null);
  const titlePickerRef = useRef<HTMLDivElement>(null);
  const subtitlePickerRef = useRef<HTMLDivElement>(null);
  const dividerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (model.ui.showColorPicker !== "dividerColor") return;
    function handleClickOrFocusOut(event: MouseEvent | FocusEvent) {
      const input = dividerInputRef.current;
      const picker = dividerPickerRef.current;
      if (!input || !picker) return;
      if (
        event.target instanceof Node &&
        !input.contains(event.target) &&
        !picker.contains(event.target)
      ) {
        toggleColorPicker("");
      }
    }
    document.addEventListener("mousedown", handleClickOrFocusOut);
    document.addEventListener("focusin", handleClickOrFocusOut);
    return () => {
      document.removeEventListener("mousedown", handleClickOrFocusOut);
      document.removeEventListener("focusin", handleClickOrFocusOut);
    };
  }, [model.ui.showColorPicker, toggleColorPicker]);

  return (
    <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Text</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Title</label>
          <input
            type="text"
            value={model.style.title}
            onChange={(e) => updateStyle({ title: e.target.value })}
            className="input w-full focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
        </div>
        <div>
          <label className="form-label">Subtitle</label>
          <input
            type="text"
            value={model.style.subtitle}
            onChange={(e) => updateStyle({ subtitle: e.target.value })}
            className="input w-full focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
        </div>
      </div>
      <div className="mt-6">
        <label className="form-label">Footer Text</label>
        <input
          type="text"
          value={model.style.footerText}
          onChange={(e) => updateStyle({ footerText: e.target.value })}
          className="input w-full focus:ring-2 focus:ring-primary/40 focus:border-primary"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="flex items-center h-full">
          <label
            htmlFor="show-divider"
            className="flex items-center cursor-pointer select-none"
          >
            <div className="relative">
              <input
                id="show-divider"
                type="checkbox"
                checked={model.style.showDivider}
                onChange={(e) => updateStyle({ showDivider: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-300 rounded-full peer-checked:bg-primary transition-colors duration-200"></div>
              <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200 peer-checked:translate-x-6"></div>
            </div>
            <span className="ml-4 form-label">Show Divider</span>
          </label>
        </div>
        <div className="flex items-center h-full">
          {model.style.showDivider && (
            <div className="relative w-full" ref={dividerPickerRef}>
              <label
                className="form-label mb-2 block"
                htmlFor="divider-color-picker"
              >
                Divider Color
              </label>
              <div className="flex items-center gap-2 w-full">
                <div
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer flex-shrink-0"
                  style={{ backgroundColor: model.style.dividerColor }}
                  onClick={() => toggleColorPicker("dividerColor")}
                  tabIndex={0}
                  aria-label="Divider color picker"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      toggleColorPicker("dividerColor");
                  }}
                />
                <input
                  type="text"
                  value={model.style.dividerColor}
                  onChange={(e) =>
                    updateStyle({ dividerColor: e.target.value })
                  }
                  className="input w-full focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  id="divider-color-picker"
                  ref={dividerInputRef}
                />
              </div>
              {model.ui.showColorPicker === "dividerColor" && (
                <div
                  className="mt-2 absolute z-10 left-0"
                  ref={dividerPickerRef}
                  tabIndex={-1}
                >
                  <HexColorPicker
                    color={model.style.dividerColor}
                    onChange={(color) => updateStyle({ dividerColor: color })}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Title Color</label>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              style={{ backgroundColor: model.style.titleColor }}
              onClick={() => toggleColorPicker("titleColor")}
            />
            <input
              type="text"
              value={model.style.titleColor}
              onChange={(e) => updateStyle({ titleColor: e.target.value })}
              className="input flex-1 focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
          </div>
          {model.ui.showColorPicker === "titleColor" && (
            <div className="mt-2 absolute z-10" ref={titlePickerRef}>
              <HexColorPicker
                color={model.style.titleColor}
                onChange={(color) => updateStyle({ titleColor: color })}
              />
            </div>
          )}
        </div>
        <div>
          <label className="form-label">Subtitle Color</label>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              style={{ backgroundColor: model.style.subtitleColor }}
              onClick={() => toggleColorPicker("subtitleColor")}
            />
            <input
              type="text"
              value={model.style.subtitleColor}
              onChange={(e) => updateStyle({ subtitleColor: e.target.value })}
              className="input flex-1 focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
          </div>
          {model.ui.showColorPicker === "subtitleColor" && (
            <div className="mt-2 absolute z-10" ref={subtitlePickerRef}>
              <HexColorPicker
                color={model.style.subtitleColor}
                onChange={(color) => updateStyle({ subtitleColor: color })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeTextSection; 