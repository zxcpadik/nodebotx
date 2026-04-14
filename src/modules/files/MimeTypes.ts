import { MIME_TO_EXTENSIONS, DEFAULT_MIME_TYPE } from '../../config/constants';

/**
 * Get file extension for given MIME type
 * @param mime_type - MIME type string
 * @returns First matching extension or undefined if not found
 */
export function get_extension_by_mime(mime_type: string): string | undefined {
  const extensions = MIME_TO_EXTENSIONS[mime_type as keyof typeof MIME_TO_EXTENSIONS];
  return extensions?.[0];
}

/**
 * Get all extensions for given MIME type
 * @param mime_type - MIME type string
 * @returns Array of matching extensions or empty array
 */
export function get_extensions_by_mime(mime_type: string): string[] {
  return MIME_TO_EXTENSIONS[mime_type as keyof typeof MIME_TO_EXTENSIONS] || [];
}

/**
 * Resolve MIME type for given file extension
 * @param extension - File extension without dot
 * @returns First matching MIME type or default
 */
export function get_mime_by_extension(extension: string): string {
  for (const [mime, exts] of Object.entries(MIME_TO_EXTENSIONS)) {
    if (exts.includes(extension.toLowerCase())) {
      return mime;
    }
  }
  return DEFAULT_MIME_TYPE;
}

/**
 * Validate MIME type against BotX supported types
 * @param mime_type - MIME type to validate
 * @returns Resolved MIME type (default if unknown)
 */
export function validate_mime_type(mime_type: string): string {
  if (mime_type in MIME_TO_EXTENSIONS) {
    return mime_type;
  }
  return DEFAULT_MIME_TYPE;
}

/**
 * Extract MIME type from RFC 2397 data URL
 * @param data_url - Data URL string with MIME prefix
 * @returns MIME type string or null if invalid format
 */
export function extract_mime_from_data_url(data_url: string): string | null {
  const match = data_url.match(/^data:([^;,]+);/);
  return match ? match[1] : null;
}

/**
 * Extract filename extension from data URL or filename
 * @param data_url - RFC 2397 data URL
 * @param filename - Optional filename hint
 * @returns File extension without dot or null
 */
export function extract_extension(data_url: string, filename?: string): string | null {
  const mime = extract_mime_from_data_url(data_url);
  if (mime) {
    const ext = get_extension_by_mime(mime);
    if (ext) return ext;
  }
  if (filename) {
    const parts = filename.split('.');
    if (parts.length > 1) {
      return parts[parts.length - 1].toLowerCase();
    }
  }
  return null;
}