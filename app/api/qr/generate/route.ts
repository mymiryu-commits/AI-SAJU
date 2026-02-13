import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, options } = body;

    // Build QR content based on type
    let content = '';

    switch (type) {
      case 'url':
        content = data.url || '';
        break;

      case 'vcard':
        content = [
          'BEGIN:VCARD',
          'VERSION:3.0',
          data.firstName && data.lastName ? `N:${data.lastName};${data.firstName}` : '',
          data.firstName && data.lastName ? `FN:${data.firstName} ${data.lastName}` : '',
          data.organization ? `ORG:${data.organization}` : '',
          data.title ? `TITLE:${data.title}` : '',
          data.phone ? `TEL:${data.phone}` : '',
          data.email ? `EMAIL:${data.email}` : '',
          data.website ? `URL:${data.website}` : '',
          'END:VCARD',
        ].filter(Boolean).join('\n');
        break;

      case 'wifi':
        const encryption = data.encryption || 'WPA';
        const hidden = data.hidden ? 'H:true' : '';
        content = `WIFI:T:${encryption};S:${data.ssid || ''};P:${data.password || ''};${hidden};`;
        break;

      case 'email':
        const subject = data.subject ? `?subject=${encodeURIComponent(data.subject)}` : '';
        const emailBody = data.body ? `${subject ? '&' : '?'}body=${encodeURIComponent(data.body)}` : '';
        content = `mailto:${data.email || ''}${subject}${emailBody}`;
        break;

      case 'phone':
        content = `tel:${data.phone || ''}`;
        break;

      case 'sms':
        const smsBody = data.message ? `?body=${encodeURIComponent(data.message)}` : '';
        content = `sms:${data.phone || ''}${smsBody}`;
        break;

      case 'location':
        if (data.latitude && data.longitude) {
          content = `geo:${data.latitude},${data.longitude}`;
        } else if (data.address) {
          content = `https://maps.google.com/?q=${encodeURIComponent(data.address)}`;
        }
        break;

      case 'event':
        const formatDate = (dateStr: string) => {
          if (!dateStr) return '';
          const date = new Date(dateStr);
          return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        content = [
          'BEGIN:VEVENT',
          data.title ? `SUMMARY:${data.title}` : '',
          data.description ? `DESCRIPTION:${data.description}` : '',
          data.location ? `LOCATION:${data.location}` : '',
          data.startDate ? `DTSTART:${formatDate(data.startDate)}` : '',
          data.endDate ? `DTEND:${formatDate(data.endDate)}` : '',
          'END:VEVENT',
        ].filter(Boolean).join('\n');
        break;

      default:
        return NextResponse.json(
          { success: false, error: '지원하지 않는 QR 타입입니다.' },
          { status: 400 }
        );
    }

    if (!content) {
      return NextResponse.json(
        { success: false, error: '필수 데이터를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Generate QR code
    const qrOptions = {
      width: options?.size || 300,
      margin: options?.margin ?? 4,
      color: {
        dark: options?.color || '#000000',
        light: options?.backgroundColor || '#FFFFFF',
      },
      errorCorrectionLevel: (options?.errorCorrectionLevel || 'M') as 'L' | 'M' | 'Q' | 'H',
    };

    const qrCode = await QRCode.toDataURL(content, qrOptions);

    return NextResponse.json({
      success: true,
      qrCode,
      content,
    });
  } catch (error) {
    console.error('QR generation error:', error);
    return NextResponse.json(
      { success: false, error: 'QR 코드 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
