import type { AllowedData, CommunicationAvailability, BotContour } from '../types/common';

/**
 * API endpoint path constants organized by version and module
 */
export const API_ENDPOINTS = {
  SYSTEM: {
    VERSION: '/system/botx/version',
  },
  BOTS: {
    CATALOG: '/api/v1/botx/bots/catalog',
    LEGACY_TOKEN: (bot_id: string) => `/api/v2/botx/bots/${bot_id}/token`,
  },
  NOTIFICATIONS: {
    DIRECT_V4: '/api/v4/botx/notifications/direct',
    DIRECT_SYNC_V4: '/api/v4/botx/notifications/direct/sync',
    INTERNAL_V4: '/api/v4/botx/notifications/internal',
    CALLBACK: '/notification/callback',
  },
  EVENTS: {
    EDIT: '/api/v3/botx/events/edit_event',
    REPLY: '/api/v3/botx/events/reply_event',
    STATUS: (sync_id: string) => `/api/v3/botx/events/${sync_id}/status`,
    TYPING: '/api/v3/botx/events/typing',
    STOP_TYPING: '/api/v3/botx/events/stop_typing',
    DELETE: '/api/v3/botx/events/delete_event',
  },
  CHATS: {
    PERSONAL: '/api/v1/botx/chats/personal',
    LIST: '/api/v3/botx/chats/list',
    INFO: '/api/v3/botx/chats/info',
    ADD_USER: '/api/v3/botx/chats/add_user',
    REMOVE_USER: '/api/v3/botx/chats/remove_user',
    ADD_ADMIN: '/api/v3/botx/chats/add_admin',
    STEALTH_SET: '/api/v3/botx/chats/stealth_set',
    STEALTH_DISABLE: '/api/v3/botx/chats/stealth_disable',
    CREATE: '/api/v3/botx/chats/create',
    PIN_MESSAGE: '/api/v3/botx/chats/pin_message',
    UNPIN_MESSAGE: '/api/v3/botx/chats/unpin_message',
    CREATE_LINK: '/api/v3/botx/chats/create_link',
    CREATE_THREAD: '/api/v3/botx/chats/create_thread',
  },
  USERS: {
    BY_EMAIL_DEPRECATED: '/api/v3/botx/users/by_email',
    BY_EMAIL: '/api/v3/botx/users/by_email',
    BY_HUID: '/api/v3/botx/users/by_huid',
    BY_LOGIN: '/api/v3/botx/users/by_login',
    BY_OTHER_ID: '/api/v3/botx/users/by_other_id',
    LIST_CSV: '/api/v3/botx/users/users_as_csv',
    UPDATE_PROFILE: '/api/v3/botx/users/update_profile',
  },
  FILES: {
    DOWNLOAD: '/api/v3/botx/files/download',
    UPLOAD: '/api/v3/botx/files/upload',
  },
} as const;

/**
 * Request and file size limits from BotX API specification
 */
export const LIMITS = {
  MAX_REQUEST_SIZE_BYTES: 512 * 1024 * 1024,
  MAX_JSON_PAYLOAD_BYTES: 1 * 1024 * 1024,
  MAX_FILE_SIZE_BYTES: 512 * 1024 * 1024,
  NOTIFICATION_BODY_MAX_LENGTH: 4096,
} as const;

/**
 * JWT authentication configuration constants
 */
export const AUTH = {
  JWT_ALGORITHM: 'HS256',
  JWT_TTL_SECONDS: 60,
  JWT_VERSION: 2,
  AUTH_HEADER_NAME: 'authorization',
  AUTH_HEADER_PREFIX: 'Bearer ',
  PDS_TOKEN_HEADER: 'pds_token',
  OPEN_ID_TOKEN_HEADER: 'open_id_access_token',
} as const;

/**
 * HTTP headers and content types for API requests
 */
export const HEADERS = {
  CONTENT_TYPE_JSON: 'application/json',
  CONTENT_TYPE_MULTIPART: 'multipart/form-data',
} as const;

/**
 * Default configuration values for BotX client
 */
export const DEFAULTS = {
  PROTO_VERSION: 4,
  REQUEST_TIMEOUT_MS: 30000,
  ALLOWED_DATA: 'commands' as AllowedData,
  COMMUNICATION_AVAILABILITY: 'corporate' as CommunicationAvailability,
  CONTOUR: 'any' as BotContour,
  ALLOW_CHAT_CREATING: false,
  SHOW_IN_CATALOG: true,
  USE_BOTX_CA_CERT: false,
  USE_PDS_TOKEN: false,
  USE_OPEN_ID_ACCESS_TOKEN: false,
} as const;

/**
 * MIME type to file extension mapping table from BotX specification
 */
export const MIME_TO_EXTENSIONS: Record<string, string[]> = {
  'application/epub+zip': ['epub'],
  'application/gzip': ['gz'],
  'application/java-archive': ['jar'],
  'application/javascript': ['js'],
  'application/json': ['json'],
  'application/json-patch+json': ['json-patch'],
  'application/ld+json': ['jsonld'],
  'application/manifest+json': ['webmanifest'],
  'application/msword': ['doc'],
  'application/octet-stream': ['bin'],
  'application/ogg': ['ogx'],
  'application/pdf': ['pdf'],
  'application/postscript': ['ps', 'eps', 'ai'],
  'application/rtf': ['rtf'],
  'application/vnd.amazon.ebook': ['azw'],
  'application/vnd.api+json': ['json-api'],
  'application/vnd.apple.installer+xml': ['mpkg'],
  'application/vnd.mozilla.xul+xml': ['xul'],
  'application/vnd.ms-excel': ['xls'],
  'application/vnd.ms-fontobject': ['eot'],
  'application/vnd.ms-powerpoint': ['ppt'],
  'application/vnd.oasis.opendocument.presentation': ['odp'],
  'application/vnd.oasis.opendocument.spreadsheet': ['ods'],
  'application/vnd.oasis.opendocument.text': ['odt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['pptx'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['xlsx'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
  'application/vnd.rar': ['rar'],
  'application/vnd.visio': ['vsd'],
  'application/x-7z-compressed': ['7z'],
  'application/x-abiword': ['abw'],
  'application/x-bzip': ['bz'],
  'application/x-bzip2': ['bz2'],
  'application/x-cdf': ['cda'],
  'application/x-csh': ['csh'],
  'application/x-freearc': ['arc'],
  'application/x-httpd-php': ['php'],
  'application/x-msaccess': ['mdb'],
  'application/x-sh': ['sh'],
  'application/x-shockwave-flash': ['swf'],
  'application/x-tar': ['tar'],
  'application/xhtml+xml': ['xhtml'],
  'application/xml': ['xml'],
  'application/wasm': ['wasm'],
  'application/zip': ['zip'],
  'audio/3gpp': ['3gp'],
  'audio/3gpp2': ['3g2'],
  'audio/aac': ['aac'],
  'audio/midi': ['mid', 'midi'],
  'audio/mpeg': ['mp3'],
  'audio/ogg': ['oga'],
  'audio/opus': ['opus'],
  'audio/wav': ['wav'],
  'audio/webm': ['weba'],
  'font/otf': ['otf'],
  'font/ttf': ['ttf'],
  'font/woff': ['woff'],
  'font/woff2': ['woff2'],
  'image/avif': ['avif'],
  'image/bmp': ['bmp'],
  'image/gif': ['gif'],
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/svg+xml': ['svg', 'svgz'],
  'image/tiff': ['tiff', 'tif'],
  'image/vnd.microsoft.icon': ['ico'],
  'image/webp': ['webp'],
  'text/calendar': ['ics'],
  'text/css': ['css'],
  'text/csv': ['csv'],
  'text/html': ['html', 'htm'],
  'text/javascript': ['js', 'mjs'],
  'text/plain': ['txt', 'text'],
  'text/xml': ['xml'],
  'video/3gpp': ['3gp'],
  'video/3gpp2': ['3g2'],
  'video/quicktime': ['mov'],
  'video/mp2t': ['ts'],
  'video/mp4': ['mp4'],
  'video/mpeg': ['mpeg', 'mpg'],
  'video/ogg': ['ogv'],
  'video/webm': ['webm'],
  'video/x-msvideo': ['avi'],
  'video/x-ms-wmv': ['wmv'],
} as const;

/**
 * Default MIME type for unrecognized file types
 */
export const DEFAULT_MIME_TYPE = 'application/octet-stream';