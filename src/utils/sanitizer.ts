import DOMPurify from 'dompurify';

// SECURITY FIX: XSS Prevention - HTML Content Sanitization
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  // Configure DOMPurify with strict settings
  const config = {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'target', 'class'
    ],
    ALLOW_DATA_ATTR: false,
    FORBID_SCRIPTS: true,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style'],
    SANITIZE_DOM: true,
    KEEP_CONTENT: false
  };

  return DOMPurify.sanitize(html, config);
};

// Additional security: Text input validation
export const validateInput = {
  email: (email: string): boolean => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email) && email.length <= 254;
  },
  
  phone: (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,20}$/;
    return phoneRegex.test(phone);
  },
  
  name: (name: string): boolean => {
    return name.length >= 2 && name.length <= 100 && /^[a-zA-ZÀ-ÿ\s\-'\.]+$/.test(name);
  },
  
  text: (text: string, maxLength: number = 1000): boolean => {
    return text.length <= maxLength;
  },
  
  price: (price: number): boolean => {
    return price >= 0 && price <= 999999999 && Number.isFinite(price);
  }
};

// Security: Sanitize text content to prevent script injection
export const sanitizeText = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};