import { generateId } from '@/lib/utils';

export type ContentType = 'text' | 'url' | 'phone' | 'email' | 'vcard' | 'wifi';

export interface QRCodeModel {
  id: string;
  name: string;
  content: string;
  tags: string[];
  contentType: ContentType;
  style: {
    size: number;
    level: 'L' | 'M' | 'Q' | 'H';
    foregroundColor: string;
    backgroundColor: string;
    includeMargin: boolean;
    title: string;
    subtitle: string;
    footerText: string;
    titleColor: string;
    subtitleColor: string;
    logoImage: string | null;
    footerImage: string | null;
    dotsOptions?: {
      type: 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded';
      color: string;
    };
    showDivider: boolean;
    qrBorderColor: string;
    eyeColor: string;
    dividerColor: string;
  };
  ui: {
    showColorPicker: string | null;
    isEditing: string | null;
  };
}

export const defaultQRModel: QRCodeModel = {
  id: generateId(),
  name: "",
  content: "",
  tags: [],
  contentType: "text",
  style: {
    size: 200,
    level: "M",
    foregroundColor: "#5384ad",
    backgroundColor: "#FFFFFF",
    includeMargin: false,
    title: "Scan Me",
    subtitle: "Scan to get started",
    footerText: "",
    titleColor: "#5384ad",
    subtitleColor: "#5384ad",
    logoImage: null,
    footerImage: null,
    dotsOptions: {
      type: "square",
      color: "#000000",
    },
    showDivider: true,
    qrBorderColor: "#000000",
    eyeColor: "#000000",
    dividerColor: "#5384ad",
  },
  ui: {
    showColorPicker: null,
    isEditing: null,
  },
}; 