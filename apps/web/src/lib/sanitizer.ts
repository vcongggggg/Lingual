/**
 * OWASP A03: Anti-XSS Sanitizer Utility for Frontend Rendered User-Generated Content
 * Neutralizes malicious script injection tags, iframe hijacks, and event handlers.
 */

export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function sanitizeHtmlContent(htmlInput: string): string {
  if (!htmlInput || typeof htmlInput !== 'string') return '';

  // Remove dangerous script, iframe, and inline JS event attributes (onload, onerror, onclick)
  return htmlInput
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*(["']).*?\1/gi, '')
    .replace(/javascript:/gi, '');
}
