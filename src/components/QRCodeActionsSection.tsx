import React from "react";

interface QRCodeActionsSectionProps {
  isFormValid: boolean;
  handleSaveAsTemplate: () => void;
}

const QRCodeActionsSection: React.FC<QRCodeActionsSectionProps> = ({
  isFormValid,
  handleSaveAsTemplate,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if ((e.key === "Enter" || e.key === " ") && isFormValid) {
      handleSaveAsTemplate();
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center gap-4">
      <button
        type="button"
        className={`w-full max-w-xs btn ${
          isFormValid
            ? "btn-primary"
            : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
        }`}
        disabled={!isFormValid}
        onClick={isFormValid ? handleSaveAsTemplate : undefined}
        aria-label="Save as template"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        Save
      </button>
    </div>
  );
};

export default QRCodeActionsSection;
