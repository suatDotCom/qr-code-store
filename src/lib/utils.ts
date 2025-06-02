import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import QRCode from 'qrcode';
import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { QRStyle } from '@/lib/supabase/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function formatDate(date: Date): string {
  return format(date, 'd MMMM yyyy, HH:mm', { locale: enUS });
}

// Generate QR code (as URL)
export async function generateQRCodeDataURL(
  content: string,
  style: QRStyle
): Promise<string> {
  try {
    return await QRCode.toDataURL(content, {
      width: style.size,
      color: {
        dark: style.foregroundColor,
        light: style.backgroundColor,
      },
      errorCorrectionLevel: style.level,
      margin: style.includeMargin ? 4 : 0,
    });
  } catch (error) {
    console.error('Error while generating QR code:', error);
    throw new Error('QR code could not be generated');
  }
}

export async function convertToPNG(element: HTMLElement): Promise<string> {
  try {
    return await toPng(element, { quality: 0.95 });
  } catch (error) {
    console.error('PNG conversion error:', error);
    throw new Error('PNG image could not be generated');
  }
}

export async function convertToJPEG(element: HTMLElement): Promise<string> {
  try {
    return await toJpeg(element, { quality: 0.95 });
  } catch (error) {
    console.error('JPEG conversion error:', error);
    throw new Error('JPEG image could not be generated');
  }
}

export async function convertToPDF(
  element: HTMLElement,
  filename: string
): Promise<void> {
  try {
    const imgData = await toPng(element);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
    });
    
    const imgWidth = 210 - 40; // A4 width - margins
    const imgHeight = (imgWidth * element.offsetHeight) / element.offsetWidth;
    
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('PDF conversion error:', error);
    throw new Error('PDF could not be generated');
  }
}

export function downloadFile(dataUrl: string, filename: string, fileType: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${filename}.${fileType}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
} 