import { LIMITS, MIME_TO_EXTENSIONS, DEFAULT_MIME_TYPE } from '../config/constants';
import type { UUID, Base64FileData, AttachedFile, DirectNotificationRequest } from '../types/common';
import { ValidationError } from '../errors/BotXError';

/**
 * Validate UUID string format (basic pattern check)
 * @param value - String to validate as UUID
 * @returns True if format matches UUID pattern
 */
export function is_valid_uuid(value: string): value is UUID {
  const uuid_pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuid_pattern.test(value);
}

/**
 * Validate ISO 8601 date-time string format
 * @param value - String to validate as ISO date
 * @returns True if format matches ISO 8601 pattern
 */
export function is_valid_iso_date(value: string): boolean {
  const iso_pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;
  return iso_pattern.test(value) && !isNaN(Date.parse(value));
}

/**
 * Validate notification body length constraint
 * @param body - Text message content
 * @throws ValidationError if length exceeds limit
 */
export function validate_notification_body(body: string): void {
  if (body.length > LIMITS.NOTIFICATION_BODY_MAX_LENGTH) {
    throw new ValidationError(
      `Notification body exceeds maximum length of ${LIMITS.NOTIFICATION_BODY_MAX_LENGTH} characters`,
      { field: 'body', max_length: LIMITS.NOTIFICATION_BODY_MAX_LENGTH, actual_length: body.length }
    );
  }
}

/**
 * Validate attached file size and encoding
 * @param file - File attachment object with base64 data
 * @throws ValidationError if size or format constraints violated
 */
export function validate_attached_file(file: AttachedFile): void {
  if (!file.data.startsWith('data:')) {
    throw new ValidationError('File data must be RFC 2397 data URL format', { field: 'file.data' });
  }

  const base64_content = file.data.split(',')[1];
  if (!base64_content) {
    throw new ValidationError('File data URL missing base64 content', { field: 'file.data' });
  }

  const estimated_bytes = Math.ceil((base64_content.length * 3) / 4);
  if (estimated_bytes > LIMITS.MAX_FILE_SIZE_BYTES) {
    throw new ValidationError(
      `File size exceeds maximum of ${LIMITS.MAX_FILE_SIZE_BYTES} bytes`,
      { field: 'file', max_size: LIMITS.MAX_FILE_SIZE_BYTES, estimated_size: estimated_bytes }
    );
  }
}

/**
 * Validate MIME type against BotX supported types table
 * @param mime_type - MIME type string to validate
 * @returns Resolved MIME type (default if unknown)
 */
export function resolve_mime_type(mime_type: string): string {
  if (mime_type in MIME_TO_EXTENSIONS) {
    return mime_type;
  }
  return DEFAULT_MIME_TYPE;
}

/**
 * Get file extension for given MIME type
 * @param mime_type - MIME type string
 * @returns First matching extension or undefined
 */
export function get_extension_for_mime(mime_type: string): string | undefined {
  const extensions = MIME_TO_EXTENSIONS[mime_type as keyof typeof MIME_TO_EXTENSIONS];
  return extensions?.[0];
}

/**
 * Validate complete direct notification request payload
 * @param payload - Request object to validate
 * @throws ValidationError if any constraint violated
 */
export function validate_direct_notification_request(payload: DirectNotificationRequest): void {
  if (!is_valid_uuid(payload.group_chat_id)) {
    throw new ValidationError('Invalid group_chat_id UUID format', { field: 'group_chat_id' });
  }

  validate_notification_body(payload.notification.body);

  if (payload.file) {
    validate_attached_file(payload.file);
  }

  if (payload.recipients && !Array.isArray(payload.recipients)) {
    throw new ValidationError('Recipients must be array of UUIDs', { field: 'recipients' });
  }

  if (payload.recipients) {
    for (const recipient of payload.recipients) {
      if (!is_valid_uuid(recipient)) {
        throw new ValidationError(`Invalid recipient UUID: ${recipient}`, { field: 'recipients' });
      }
    }
  }
}

/**
 * Validate total request size constraints
 * @param json_payload_size - Size of JSON fields in bytes (excluding file)
 * @param file_size - Size of attached file in bytes (0 if none)
 * @throws ValidationError if limits exceeded
 */
export function validate_request_size(json_payload_size: number, file_size: number): void {
  if (json_payload_size > LIMITS.MAX_JSON_PAYLOAD_BYTES) {
    throw new ValidationError(
      `JSON payload exceeds maximum of ${LIMITS.MAX_JSON_PAYLOAD_BYTES} bytes`,
      { field: 'request', max_json_size: LIMITS.MAX_JSON_PAYLOAD_BYTES, actual_size: json_payload_size }
    );
  }

  const total_size = json_payload_size + file_size;
  if (total_size > LIMITS.MAX_REQUEST_SIZE_BYTES) {
    throw new ValidationError(
      `Total request size exceeds maximum of ${LIMITS.MAX_REQUEST_SIZE_BYTES} bytes`,
      { field: 'request', max_total_size: LIMITS.MAX_REQUEST_SIZE_BYTES, actual_size: total_size }
    );
  }
}