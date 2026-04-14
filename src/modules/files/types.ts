import { Buffer } from 'node:buffer';
import type { UUID, Base64FileData, UploadedFile, FileMeta } from '../../types/common';
export * from '../../types/common';

/**
 * Query parameters for file download
 */
export interface FileDownloadQuery {
  group_chat_id: UUID;
  file_id: UUID;
  is_preview?: boolean;
}

/**
 * Request payload for file upload via multipart
 */
export interface FileUploadRequest {
  group_chat_id: UUID;
  file_name: string;
  mime_type: string;
  content: Blob | Buffer;
  meta?: FileMeta;
}

/**
 * Multipart form fields for file upload
 */
export interface FileUploadFormFields {
  group_chat_id: string;
  file_name: string;
  mime_type: string;
  meta?: string;
}

/**
 * Validate file upload constraints
 * @param file_size - File size in bytes
 * @param json_payload_size - Size of JSON metadata in bytes
 * @throws Error if limits exceeded
 */
export function validate_file_upload_constraints(file_size: number, json_payload_size: number): void {
  const MAX_FILE_SIZE = 512 * 1024 * 1024;
  const MAX_JSON_PAYLOAD = 1 * 1024 * 1024;
  const MAX_TOTAL_REQUEST = 512 * 1024 * 1024;

  if (file_size > MAX_FILE_SIZE) {
    throw new Error(`File size ${file_size} exceeds maximum ${MAX_FILE_SIZE} bytes`);
  }
  if (json_payload_size > MAX_JSON_PAYLOAD) {
    throw new Error(`JSON payload ${json_payload_size} exceeds maximum ${MAX_JSON_PAYLOAD} bytes`);
  }
  if (file_size + json_payload_size > MAX_TOTAL_REQUEST) {
    throw new Error(`Total request size exceeds maximum ${MAX_TOTAL_REQUEST} bytes`);
  }
}

/**
 * Build multipart form data for file upload
 * @param fields - Form field values
 * @param file_content - Binary file content as Blob or Buffer
 * @param file_name - Name for the file field
 * @param mime_type - Content-Type for file field
 * @returns FormData object ready for request
 */
export function build_file_upload_form(
  fields: FileUploadFormFields,
  file_content: Blob | Buffer,
  file_name = 'content',
  mime_type?: string
): FormData {
  const form_data = new FormData();
  
  Object.entries(fields).forEach(([key, value]) => {
    form_data.append(key, value);
  });
  
  Buffer.from([] as any, 0, 0)
  const blob = Buffer.isBuffer(file_content) 
    ? new Blob([file_content as any], { type: mime_type })
    : file_content;
    
  form_data.append('content', blob, fields.file_name);
  
  return form_data;
}

/**
 * Parse uploaded file response with validation
 * @param response - Raw API response with file result
 * @returns Validated UploadedFile object
 */
export function parse_uploaded_file_response(response: { result: UploadedFile }): UploadedFile {
  const file = response.result;
  if (!file.file_id || !file.file_hash) {
    throw new Error('Invalid file upload response: missing required fields');
  }
  return file;
}