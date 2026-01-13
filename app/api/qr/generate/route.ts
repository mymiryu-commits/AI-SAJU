import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import QRCode from 'qrcode';

// QR Code Types
type QRType = 'url' | 'vcard' | 'wifi' | 'email' | 'phone' | 'sms' | 'location' | 'event';

interface QRGenerateRequest {
  type: QRType;
  data: Record<string, string>;
  options?: {
    size?: number;
    color?: string;
    backgroundColor?: string;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    margin?: number;
  };
}

// Format QR code data based on type
function formatQRData(type: QRType, data: Record<string, string>): string {
  switch (type) {
    case 'url':
      return data.url || '';

    case 'vcard':
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${data.lastName || ''};${data.firstName || ''};;;`,
        `FN:${data.firstName || ''} ${data.lastName || ''}`,
        data.organization ? `ORG:${data.organization}` : '',
        data.title ? `TITLE:${data.title}` : '',
        data.phone ? `TEL;TYPE=CELL:${data.phone}` : '',
        data.email ? `EMAIL:${data.email}` : '',
        data.website ? `URL:${data.website}` : '',
        data.address ? `ADR;TYPE=WORK:;;${data.address};;;` : '',
        'END:VCARD',
      ].filter(Boolean).join('\n');

    case 'wifi':
      return `WIFI:T:${data.encryption || 'WPA'};S:${data.ssid || ''};P:${data.password || ''};;`;

    case 'email':
      return `mailto:${data.email || ''}?subject=${encodeURIComponent(data.subject || '')}&body=${encodeURIComponent(data.body || '')}`;

    case 'phone':
      return `tel:${data.phone || ''}`;

    case 'sms':
      return `sms:${data.phone || ''}?body=${encodeURIComponent(data.message || '')}`;

    case 'location':
      return `geo:${data.latitude || '0'},${data.longitude || '0'}?q=${encodeURIComponent(data.address || '')}`;

    case 'event':
      const startDate = data.startDate?.replace(/[-:]/g, '') || '';
      const endDate = data.endDate?.replace(/[-:]/g, '') || '';
      return [
        'BEGIN:VEVENT',
        `SUMMARY:${data.title || ''}`,
        data.description ? `DESCRIPTION:${data.description}` : '',
        data.location ? `LOCATION:${data.location}` : '',
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        'END:VEVENT',
      ].filter(Boolean).join('\n');

    default:
      return data.text || '';
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body: QRGenerateRequest = await request.json();
    const { type, data, options = {} } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Type and data are required' },
        { status: 400 }
      );
    }

    // Format QR data based on type
    const qrContent = formatQRData(type, data);

    if (!qrContent) {
      return NextResponse.json(
        { error: 'Invalid data for QR code' },
        { status: 400 }
      );
    }

    // Generate QR code
    const qrOptions = {
      errorCorrectionLevel: (options.errorCorrectionLevel || 'M') as 'L' | 'M' | 'Q' | 'H',
      type: 'image/png' as const,
      quality: 1,
      margin: options.margin ?? 4,
      width: Math.min(options.size || 300, 2000), // Max 2000px
      color: {
        dark: options.color || '#000000',
        light: options.backgroundColor || '#FFFFFF',
      },
    };

    const qrDataUrl = await QRCode.toDataURL(qrContent, qrOptions);

    // Save to database if user is logged in
    let savedQR = null;
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: qrRecord, error } = await (supabase as any)
        .from('qr_codes')
        .insert({
          user_id: user.id,
          type,
          content: qrContent,
          data: JSON.stringify(data),
          options: JSON.stringify(options),
        })
        .select()
        .single();

      if (!error) {
        savedQR = qrRecord;
      }
    }

    return NextResponse.json({
      success: true,
      qrCode: qrDataUrl,
      content: qrContent,
      savedId: savedQR?.id || null,
    });
  } catch (error) {
    console.error('QR generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
