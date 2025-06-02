import { ContentType } from "@/types/qrcode";

export type Tag = {
  id: string;
  name: string;
  created_at?: string;
};

export type QRStyle = {
  backgroundColor: string;
  foregroundColor: string;
  size: number;
  level: 'L' | 'M' | 'Q' | 'H';
  includeMargin: boolean;
  titleColor?: string;
  subtitleColor?: string;
  title?: string;
  subtitle?: string;
  footerText?: string;
  logoImage?: string | null;
  footerImage?: string | null;
  dotsOptions?: {
    type: 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded';
    color: string;
  };
};

export type QRCodeTemplate = {
  id: string;
  name: string;
  content: string;
  type: ContentType;
  tag_ids: string[];
  style: QRStyle;
  created_at?: string;
  updated_at?: string;
  is_template?: boolean;
  thumbnail?: string;
}; 