// SECURITY: Content Security Policy and additional security measures

// Rate limiting utility for quote submissions
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = {
  // Allow 3 quote submissions per minute per email
  checkQuoteSubmission: (email: string, maxAttempts = 3, windowMs = 60000): boolean => {
    const now = Date.now();
    const userLimit = rateLimitMap.get(email);

    if (!userLimit || now > userLimit.resetTime) {
      rateLimitMap.set(email, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (userLimit.count >= maxAttempts) {
      return false;
    }

    userLimit.count++;
    return true;
  },

  // Clean up expired entries
  cleanup: () => {
    const now = Date.now();
    for (const [email, limit] of rateLimitMap.entries()) {
      if (now > limit.resetTime) {
        rateLimitMap.delete(email);
      }
    }
  }
};

// Content Security Policy headers (for future implementation with meta tags)
export const cspConfig = {
  'default-src': "'self'",
  'script-src': "'self' 'unsafe-inline' 'unsafe-eval'", // Note: In production, remove unsafe-inline and unsafe-eval
  'style-src': "'self' 'unsafe-inline' fonts.googleapis.com",
  'font-src': "'self' fonts.gstatic.com",
  'img-src': "'self' data: blob: *.supabase.co *.googleapis.com",
  'connect-src': "'self' *.supabase.co wss://*.supabase.co",
  'frame-src': "'none'",
  'object-src': "'none'",
  'base-uri': "'self'",
  'form-action': "'self'"
};

// Security headers utility
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// File upload security validation
export const validateFile = {
  // Validate image files for upload
  image: (file: File): { valid: boolean; error?: string } => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Tipo de arquivo não permitido. Use JPG, PNG ou WebP.' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'Arquivo muito grande. Máximo de 5MB.' };
    }

    // Check file signature (magic numbers) for additional security
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = e.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(buffer);
        
        // Check for common image file signatures
        const jpegSignature = [0xFF, 0xD8, 0xFF];
        const pngSignature = [0x89, 0x50, 0x4E, 0x47];
        const webpSignature = [0x52, 0x49, 0x46, 0x46];

        const hasValidSignature = 
          jpegSignature.every((byte, i) => uint8Array[i] === byte) ||
          pngSignature.every((byte, i) => uint8Array[i] === byte) ||
          webpSignature.every((byte, i) => uint8Array[i] === byte);

        if (!hasValidSignature) {
          resolve({ valid: false, error: 'Arquivo inválido ou corrompido.' });
        } else {
          resolve({ valid: true });
        }
      };
      reader.readAsArrayBuffer(file.slice(0, 12));
    }) as any;

    return { valid: true };
  }
};

// Clean up rate limiting data every 5 minutes
setInterval(() => {
  rateLimit.cleanup();
}, 5 * 60 * 1000);