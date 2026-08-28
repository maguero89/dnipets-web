export interface CountryOption {
  code: string;
  country: string;
  flag: string;
  example: string;
}

export const COUNTRY_CODES: CountryOption[] = [
  { code: '+549', country: 'Argentina', flag: '🇦🇷', example: '2613820372 (sin 0 ni 15)' },
  { code: '+569', country: 'Chile', flag: '🇨🇱', example: '912345678' },
  { code: '+598', country: 'Uruguay', flag: '🇺🇾', example: '99123456' },
  { code: '+52', country: 'México', flag: '🇲🇽', example: '5512345678' },
  { code: '+34', country: 'España', flag: '🇪🇸', example: '612345678' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴', example: '3001234567' },
  { code: '+51', country: 'Perú', flag: '🇵🇪', example: '912345678' },
  { code: '+1', country: 'EE.UU. / Canadá', flag: '🇺🇸', example: '2025550143' },
];

/**
 * Convierte cualquier número telefónico al formato internacional limpio de WhatsApp (wa.me)
 */
export function formatWhatsAppPhone(phone?: string, countryCode: string = '+549'): string {
  if (!phone) return '';
  let clean = phone.replace(/[^0-9]/g, '');
  if (!clean) return '';

  // Si arranca con '0', quitarlo (ej: 0261 -> 261)
  if (clean.startsWith('0')) {
    clean = clean.substring(1);
  }

  // Si ya arranca con el código de Argentina (54)
  if (clean.startsWith('54')) {
    if (!clean.startsWith('549') && clean.length === 12) {
      clean = '549' + clean.substring(2);
    }
    return clean;
  }

  // Si es un número argentino de 10 dígitos (ej: 2613820372 o 1123456789)
  if (clean.length === 10) {
    return `549${clean}`;
  }

  // Obtener solo dígitos del código de país recibido
  const ccDigits = countryCode.replace(/[^0-9]/g, '') || '549';
  if (!clean.startsWith(ccDigits)) {
    return `${ccDigits}${clean}`;
  }

  return clean;
}
