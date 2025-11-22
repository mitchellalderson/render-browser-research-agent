import { URL } from 'url';

export interface ValidationResult {
  isValid: boolean;
  normalizedUrl?: string;
  error?: string;
}

export function validateAndNormalizeUrl(input: string): ValidationResult {
  if (!input || typeof input !== 'string') {
    return {
      isValid: false,
      error: 'URL is required and must be a string',
    };
  }

  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return {
      isValid: false,
      error: 'URL cannot be empty',
    };
  }

  try {
    // Add protocol if missing
    let urlToValidate = trimmedInput;
    if (!urlToValidate.startsWith('http://') && !urlToValidate.startsWith('https://')) {
      urlToValidate = 'https://' + urlToValidate;
    }

    // Parse URL
    const parsedUrl = new URL(urlToValidate);

    // Validate protocol
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return {
        isValid: false,
        error: 'Only HTTP and HTTPS protocols are supported',
      };
    }

    // Validate hostname
    if (!parsedUrl.hostname) {
      return {
        isValid: false,
        error: 'Invalid URL: missing hostname',
      };
    }

    // Block localhost and private IPs
    if (isPrivateUrl(parsedUrl.hostname)) {
      return {
        isValid: false,
        error: 'Cannot scrape localhost or private IP addresses',
      };
    }

    return {
      isValid: true,
      normalizedUrl: parsedUrl.href,
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid URL format',
    };
  }
}

function isPrivateUrl(hostname: string): boolean {
  // Check for localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
    return true;
  }

  // Check for private IP ranges
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^127\./,
  ];

  return privateRanges.some((range) => range.test(hostname));
}

export function isSameDomain(url1: string, url2: string): boolean {
  try {
    const parsed1 = new URL(url1);
    const parsed2 = new URL(url2);
    return parsed1.hostname === parsed2.hostname;
  } catch {
    return false;
  }
}

