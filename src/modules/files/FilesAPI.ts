import { Buffer } from 'node:buffer';
import { API_ENDPOINTS } from '../../config/constants';
import { validate_file_upload_constraints, build_file_upload_form, parse_uploaded_file_response } from './types';
import { validate_mime_type, extract_mime_from_data_url } from './MimeTypes';
import type { BotXClient } from '../../core/BotXClient';
import type { UUID } from '../../types/common';
import type { FileDownloadQuery, FileUploadRequest, UploadedFile } from './types';

/**
 * Files API module for upload and download operations
 */
export class FilesAPI {
  private readonly client: BotXClient;

  /**
   * Create FilesAPI module instance
   * @param client - Parent BotXClient instance
   */
  constructor(client: BotXClient) {
    this.client = client;
  }

  /**
   * Download file content by ID
   * @param query - File identifiers and preview option
   * @returns Binary file content as ArrayBuffer
   */
  async download(query: FileDownloadQuery): Promise<ArrayBuffer> {
    const response = await this.client.request<ArrayBuffer>(
      'GET',
      API_ENDPOINTS.FILES.DOWNLOAD,
      { 
        query_params: query as any,
        content_type: 'application/octet-stream',
      }
    );
    return response;
  }

  /**
   * Download file and return as Blob for browser environments
   * @param query - File identifiers and preview option
   * @param mime_type - Expected MIME type for Blob constructor
   * @returns Blob object with file content
   */
  async download_as_blob(query: FileDownloadQuery, mime_type?: string): Promise<Blob> {
    const buffer = await this.download(query);
    return new Blob([buffer], { type: mime_type });
  }

  /**
   * Upload file to BotX file service
   * @param request - Upload payload with file content and metadata
   * @returns Uploaded file metadata with IDs and URLs
   */
  async upload(request: FileUploadRequest): Promise<UploadedFile> {
    const json_payload = {
      group_chat_id: request.group_chat_id,
      file_name: request.file_name,
      mime_type: validate_mime_type(request.mime_type),
      meta: request.meta,
    };
    
    const json_size = new TextEncoder().encode(JSON.stringify(json_payload)).length;
    const file_size = Buffer.isBuffer(request.content) 
      ? request.content.length 
      : request.content.size;
      
    validate_file_upload_constraints(file_size, json_size);

    const form_fields = {
      group_chat_id: request.group_chat_id,
      file_name: request.file_name,
      mime_type: validate_mime_type(request.mime_type),
      meta: request.meta ? JSON.stringify(request.meta) : undefined,
    };

    const form_data = build_file_upload_form(
      form_fields as any,
      request.content,
      'content',
      request.mime_type
    );

    const response = await this.client.request<{ result: UploadedFile }>(
      'POST',
      API_ENDPOINTS.FILES.UPLOAD,
      {
        body: form_data,
        content_type: 'multipart/form-data',
      }
    );
    
    return parse_uploaded_file_response(response);
  }

  /**
   * Upload file from base64 data URL
   * @param group_chat_id - Target chat for file association
   * @param data_url - RFC 2397 data URL with base64 content
   * @param file_name - Desired filename for stored file
   * @param meta - Optional file metadata
   * @returns Uploaded file metadata
   */
  async upload_from_data_url(
    group_chat_id: UUID,
    data_url: string,
    file_name: string,
    meta?: { duration?: number | null; caption?: string | null }
  ): Promise<UploadedFile> {
    const mime_type = extract_mime_from_data_url(data_url) || 'application/octet-stream';
    const base64_content = data_url.split(',')[1];
    if (!base64_content) {
      throw new Error('Invalid data URL format: missing base64 content');
    }
    
    const binary_content = Buffer.from(base64_content, 'base64');
    
    return await this.upload({
      group_chat_id,
      file_name,
      mime_type: validate_mime_type(mime_type),
      content: binary_content,
      meta,
    });
  }
}