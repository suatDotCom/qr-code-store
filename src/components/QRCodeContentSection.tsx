import React, { ChangeEvent, useCallback, useState } from "react";
import { QRCodeModel, ContentType } from "@/types/qrcode";
import { Tag } from "@/lib/supabase/types";
import TagSelector from "./TagSelector";

interface QRCodeContentSectionProps {
  model: QRCodeModel;
  tags?: Tag[];
  updateModel: (updates: Partial<QRCodeModel>) => void;
  handleContentChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

type ContentTypeInfo = {
  value: ContentType;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  validation: {
    pattern?: RegExp;
    message?: string;
  };
};

// Interface for Wi-Fi settings
interface WiFiSettings {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

// Interface for vCard settings
interface VCardSettings {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  address: string;
}

const contentTypes: ContentTypeInfo[] = [
  { 
    value: "text", 
    label: "Text", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    ),
    placeholder: "Enter QR code content",
    validation: {},
  },
  { 
    value: "url", 
    label: "URL", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    placeholder: "https://example.com",
    validation: {
      pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      message: "Please enter a valid URL (e.g., https://example.com)",
    }
  },
  { 
    value: "phone", 
    label: "Phone", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    placeholder: "+1 555 123 4567",
    validation: {
      pattern: /^\+?[0-9\s\-\(\)]+$/,
      message: "Please enter a valid phone number",
    }
  },
  { 
    value: "email", 
    label: "Email", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    placeholder: "example@email.com",
    validation: {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Please enter a valid email address",
    }
  },
  { 
    value: "vcard", 
    label: "vCard", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
      </svg>
    ),
    placeholder: "Name, Email, Phone, Address",
    validation: {},
  },
  { 
    value: "wifi", 
    label: "Wi-Fi", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
    placeholder: "SSID, Password, Security Type (WPA/WEP)",
    validation: {},
  },
];

// Wi-Fi form component
const WiFiForm: React.FC<{
  value: string;
  onChange: (content: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
}> = ({ value, onChange, error, setError }) => {
  // Parse Wi-Fi settings from existing content or create empty settings
  const [wifiSettings, setWifiSettings] = useState<WiFiSettings>(() => {
    try {
      // If content is in WIFI: format, parse it
      if (value.startsWith("WIFI:")) {
        const parts = value.slice(5).split(';');
        return {
          ssid: parts.find(p => p.startsWith("S:"))?.slice(2) || "",
          password: parts.find(p => p.startsWith("P:"))?.slice(2) || "",
          encryption: (parts.find(p => p.startsWith("T:"))?.slice(2) || "WPA") as "WPA" | "WEP" | "nopass",
          hidden: parts.find(p => p.startsWith("H:"))?.slice(2) === "true"
        };
      }
    // eslint-disable-next-line no-empty
    } catch {}
    
    // Default empty settings
    return {
      ssid: "",
      password: "",
      encryption: "WPA",
      hidden: false
    };
  });

  // Convert Wi-Fi settings to QR code content format
  const formatWiFiContent = (settings: WiFiSettings): string => {
    return `WIFI:S:${settings.ssid};T:${settings.encryption};P:${settings.password};H:${settings.hidden};`;
  };

  // Handle form changes
  const handleChange = (field: keyof WiFiSettings, fieldValue: unknown) => {
    const newSettings = {
      ...wifiSettings,
      [field]: fieldValue
    };
    
    setWifiSettings(newSettings);
    onChange(formatWiFiContent(newSettings));
    
    // SSID validation
    if (field === 'ssid' && !fieldValue) {
      setError("Network name (SSID) is required");
    } else {
      setError(null);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="ssid" className="flex items-center mb-1 text-sm font-medium text-gray-700">
          Network Name (SSID) <span className="text-primary ml-1">*</span>
        </label>
        <input
          id="ssid"
          type="text"
          className={`input w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/40 focus:border-primary ${
            error && !wifiSettings.ssid ? "border-red-400 bg-red-50" : ""
          }`}
          value={wifiSettings.ssid}
          onChange={(e) => handleChange("ssid", e.target.value)}
          placeholder="Wi-Fi network name"
          required
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          className={`input w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/40 focus:border-primary ${
            error && !wifiSettings.password ? "border-red-400 bg-red-50" : ""
          }`}
          value={wifiSettings.password}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder="Wi-Fi password"
        />
      </div>
      
      <div>
        <label htmlFor="encryption" className="block mb-1 text-sm font-medium text-gray-700">
          Security Type
        </label>
        <select
          id="encryption"
          className={`input w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/40 focus:border-primary ${
            error && !wifiSettings.encryption ? "border-red-400 bg-red-50" : ""
          }`}
          value={wifiSettings.encryption}
          onChange={(e) => handleChange("encryption", e.target.value as "WPA" | "WEP" | "nopass")}
        >
          <option value="WPA">WPA/WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">No Password</option>
        </select>
      </div>
      
      <div className="flex items-center">
        <input
          id="hidden"
          type="checkbox"
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          checked={wifiSettings.hidden}
          onChange={(e) => handleChange("hidden", e.target.checked)}
        />
        <label htmlFor="hidden" className="ml-2 block text-sm text-gray-700">
          Hidden network
        </label>
      </div>
    </div>
  );
};

// vCard form component
const VCardForm: React.FC<{
  value: string;
  onChange: (content: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
}> = ({ value, onChange, error, setError }) => {
  // Parse vCard settings from existing content or create empty settings
  const [vCardSettings, setVCardSettings] = useState<VCardSettings>(() => {
    try {
      // If content is in vCard format, parse it (simple parsing)
      if (value.startsWith("BEGIN:VCARD")) {
        return {
          firstName: value.match(/N:([^;]*);/)?.[1] || "",
          lastName: value.match(/N:[^;]*;([^;]*)/)?.[1] || "",
          organization: value.match(/ORG:(.*?)(?:\r\n|\r|\n)/)?.[1] || "",
          title: value.match(/TITLE:(.*?)(?:\r\n|\r|\n)/)?.[1] || "",
          email: value.match(/EMAIL:(.*?)(?:\r\n|\r|\n)/)?.[1] || "",
          phone: value.match(/TEL:(.*?)(?:\r\n|\r|\n)/)?.[1] || "",
          website: value.match(/URL:(.*?)(?:\r\n|\r|\n)/)?.[1] || "",
          address: value.match(/ADR:(.*?)(?:\r\n|\r|\n)/)?.[1] || "",
        };
      }
    // eslint-disable-next-line no-empty
    } catch {}
    
    // Default empty settings
    return {
      firstName: "",
      lastName: "",
      organization: "",
      title: "",
      email: "",
      phone: "",
      website: "",
      address: ""
    };
  });

  // Convert vCard settings to QR code content format
  const formatVCardContent = (settings: VCardSettings): string => {
    return `BEGIN:VCARD
VERSION:3.0
N:${settings.lastName};${settings.firstName};;;
FN:${settings.firstName} ${settings.lastName}
ORG:${settings.organization}
TITLE:${settings.title}
TEL:${settings.phone}
EMAIL:${settings.email}
URL:${settings.website}
ADR:;;${settings.address};;;;
END:VCARD`;
  };

  // Handle form changes
  const handleChange = (field: keyof VCardSettings, fieldValue: string) => {
    const newSettings = {
      ...vCardSettings,
      [field]: fieldValue
    };
    
    setVCardSettings(newSettings);
    onChange(formatVCardContent(newSettings));
    
    // Validation
    if ((field === 'firstName' || field === 'lastName') && 
        !newSettings.firstName && !newSettings.lastName) {
      setError("First name or last name is required");
    } else if (field === 'email' && newSettings.email && 
              !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newSettings.email)) {
      setError("Please enter a valid email address");
    } else if (field === 'phone' && newSettings.phone && 
              !/^\+?[0-9\s\-\(\)]+$/.test(newSettings.phone)) {
      setError("Please enter a valid phone number");
    } else {
      setError(null);
    }
  };

  return (
    <div className="space-y-3 grid grid-cols-1 gap-x-4">
      <div className="grid grid-cols-2 gap-x-4">
        <div>
          <label
            htmlFor="firstName"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            className={`input w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/40 focus:border-primary ${
              error && !vCardSettings.firstName && !vCardSettings.lastName
                ? "bg-red-50"
                : ""
            }`}
            value={vCardSettings.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder="First name"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            className={`input w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/40 focus:border-primary ${
              error && !vCardSettings.firstName && !vCardSettings.lastName
                ? "bg-red-50"
                : ""
            }`}
            value={vCardSettings.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            placeholder="Last name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <div>
          <label
            htmlFor="organization"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Organization
          </label>
          <input
            id="organization"
            type="text"
            className="input w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/40 focus:border-primary"
            value={vCardSettings.organization}
            onChange={(e) => handleChange("organization", e.target.value)}
            placeholder="Company or organization"
          />
        </div>

        <div>
          <label
            htmlFor="title"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            className="input w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/40 focus:border-primary"
            value={vCardSettings.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Job title"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <div>
          <label
            htmlFor="email"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`input w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/40 focus:border-primary ${
              error && error.includes("email") ? "bg-red-50" : ""
            }`}
            value={vCardSettings.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Email address"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            className={`input w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/40 focus:border-primary ${
              error && error.includes("phone") ? "bg-red-50" : ""
            }`}
            value={vCardSettings.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Phone number"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <div>
          <label
            htmlFor="website"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Website
          </label>
          <input
            id="website"
            type="url"
            className="input w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/40 focus:border-primary"
            value={vCardSettings.website}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="Website"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="address"
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <textarea
          id="address"
          className="input w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/40 focus:border-primary"
          value={vCardSettings.address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="Address"
          rows={2}
        />
      </div>
    </div>
  );
};

const QRCodeContentSection: React.FC<QRCodeContentSectionProps> = ({
  model,
  updateModel,
  handleContentChange,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  // Change selected content type
  const handleContentTypeChange = useCallback(
    (type: ContentType) => {
      if (model.contentType !== type) {
        updateModel({ contentType: type });
        setValidationError(null); // Clear error message when type changes
      }
    },
    [model.contentType, updateModel]
  );

  // Content validation
  const validateContent = useCallback(
    (value: string): boolean => {
      const selectedType = contentTypes.find(ct => ct.value === model.contentType);
      
      if (!selectedType || !selectedType.validation.pattern) {
        return true; // If no validation pattern, consider valid
      }
      
      if (value && !selectedType.validation.pattern.test(value)) {
        setValidationError(selectedType.validation.message || "Invalid format");
        return false;
      }
      
      setValidationError(null);
      return true;
    },
    [model.contentType]
  );

  // Handle content changes and validate
  const handleContentInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    handleContentChange(e);
    validateContent(e.target.value);
  };

  // Special form content change
  const handleSpecialContentChange = (content: string) => {
    // Create a synthetic event since we don't have a TextArea event
    const syntheticEvent = {
      target: { value: content },
      currentTarget: { value: content },
      preventDefault: () => {},
      stopPropagation: () => {}
    } as unknown as ChangeEvent<HTMLTextAreaElement>;
    
    handleContentChange(syntheticEvent);
  };

  // Update tag selection
  const handleTagsChange = useCallback(
    (selectedTagIds: string[]) => {
      updateModel({ tags: selectedTagIds });
    },
    [updateModel]
  );

  // Find current selected content type
  const currentContentType = contentTypes.find(ct => ct.value === model.contentType) || contentTypes[0];

  // Render content input based on type
  const renderContentInput = () => {
    switch (model.contentType) {
      case 'wifi':
        return (
          <WiFiForm 
            value={model.content} 
            onChange={handleSpecialContentChange}
            error={validationError}
            setError={setValidationError}
          />
        );
      case 'vcard':
        return (
          <VCardForm 
            value={model.content} 
            onChange={handleSpecialContentChange}
            error={validationError}
            setError={setValidationError}
          />
        );
      default:
        return (
          <textarea
            id="content"
            className={`input w-full min-h-24 resize-y border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors ${
              validationError ? "border-red-400 bg-red-50" : "border-gray-300"
            }`}
            value={model.content}
            onChange={handleContentInputChange}
            placeholder={currentContentType.placeholder}
            required
            aria-required="true"
          />
        );
    }
  };

  return (
    <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Content</h3>
      
      {/* QR Code Name */}
      <div className="form-group mb-4">
        <label htmlFor="name" className="form-label flex items-center mb-1.5 text-sm font-medium text-gray-700">
          QR Code Name
          <span className="text-primary ml-1">*</span>
        </label>
        <input
          id="name"
          type="text"
          className="input w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/40 focus:border-primary"
          value={model.name}
          onChange={(e) => updateModel({ name: e.target.value })}
          placeholder="QR Code Name"
          required
          aria-required="true"
        />
      </div>

      {/* Content Type Selection */}
      <div className="form-group mb-4">
        <label className="form-label block mb-1.5 text-sm font-medium text-gray-700">
          Content Type
        </label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
          {contentTypes.map((ct) => (
            <button
              key={ct.value}
              type="button"
              className={`flex flex-col items-center justify-center p-3 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border-2 aspect-square select-none
                ${model.contentType === ct.value
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-primary/10 hover:border-primary hover:text-primary"}
              `}
              tabIndex={0}
              aria-label={ct.label}
              aria-pressed={model.contentType === ct.value}
              onClick={() => handleContentTypeChange(ct.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleContentTypeChange(ct.value);
              }}
            >
              <div className="text-center mb-1">{ct.icon}</div>
              <span className="text-xs font-medium">{ct.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <label htmlFor="content" className="form-label flex items-center mb-1.5 text-sm font-medium text-gray-700">
          Content
          <span className="text-primary ml-1">*</span>
        </label>
        
        {renderContentInput()}
        
        {validationError && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {validationError}
          </p>
        )}
      </div>

      {/* Tag Selection */}
      <div className="mb-4">
        <label className="form-label block mb-1.5 text-sm font-medium text-gray-700">Tags</label>
        <TagSelector
          selectedTags={model.tags}
          onChange={handleTagsChange}
          placeholder="Search and select tags..."
        />
      </div>
    </div>
  );
};

export default QRCodeContentSection; 