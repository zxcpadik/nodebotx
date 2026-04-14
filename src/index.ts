export { BotXClient } from './core/BotXClient';
export { AuthManager } from './core/AuthManager';
export { RequestHandler } from './core/RequestHandler';
export { ResponseHandler } from './core/ResponseHandler';
export { ErrorHandler } from './core/ErrorHandler';

export { BotXConfig, resolve_config, extract_botx_host } from './config/BotXConfig';

export * from './types/common';
export * from './types/api';

export {
  BotXError,
  AuthenticationError,
  ValidationError,
  ChatNotFoundError,
  EventNotFoundError,
  UserNotFoundError,
  BotNotMemberError,
  StealthModeDisabledError,
  FileError,
  create_api_error,
} from './errors/BotXError';

export {
  API_ENDPOINTS,
  LIMITS,
  AUTH,
  HEADERS,
  DEFAULTS,
  MIME_TO_EXTENSIONS,
  DEFAULT_MIME_TYPE,
} from './config/constants';

export {
  create_jwt_payload,
  sign_jwt,
  generate_auth_token,
  decode_jwt_payload,
  is_token_expired,
} from './utils/jwt';

export {
  is_valid_uuid,
  is_valid_iso_date,
  validate_notification_body,
  validate_attached_file,
  resolve_mime_type,
  get_extension_for_mime,
  validate_direct_notification_request,
  validate_request_size,
} from './utils/validators';

export { SystemAPI } from './modules/system/SystemAPI';
export { BotsAPI } from './modules/bots/BotsAPI';
export { NotificationsAPI } from './modules/notifications/NotificationsAPI';
export { EventsAPI } from './modules/events/EventsAPI';
export { ChatsAPI } from './modules/chats/ChatsAPI';
export { UsersAPI } from './modules/users/UsersAPI';
export { FilesAPI } from './modules/files/FilesAPI';

export {
  generate_legacy_signature,
  type BotCatalogQuery,
  type BotCatalogResponse,
  type LegacyTokenResponse,
} from './modules/bots/types';

export {
  get_mention_template,
  calculate_notification_payload_size,
  type DirectNotificationPayload,
  type InternalNotificationRequest,
} from './modules/notifications/types';

export {
  format_mention_placeholder,
  validate_edit_payload_rules,
  type EditEventPayload,
  type ReplyEventPayload,
  type ReplyEventResponse,
  type TypingEventResponse,
  type DeleteEventResponse,
} from './modules/events/types';

export {
  is_admin_member,
  get_member_huid,
  type PersonalChatQuery,
  type ChatInfoQuery,
  type AddUsersRequest,
  type RemoveUsersRequest,
  type AddAdminRequest,
  type StealthSetRequest,
  type StealthDisableRequest,
  type CreateChatRequest,
  type CreateChatResponse,
  type PinMessageRequest,
  type UnpinMessageRequest,
  type CreateLinkRequest,
  type CreateThreadRequest,
  type CreateThreadResponse,
  type ChatListResponse,
} from './modules/chats/types';

export {
  parse_users_csv,
  validate_update_profile_payload,
  type UsersByEmailRequest,
  type UsersByEmailResponse,
  type UserByHuidQuery,
  type UserByLoginQuery,
  type UserByOtherIdQuery,
  type UsersCsvQuery,
  type UpdateProfileRequest,
  type UserCsvRow,
} from './modules/users/types';

export {
  get_extension_by_mime,
  get_extensions_by_mime,
  get_mime_by_extension,
  validate_mime_type,
  extract_mime_from_data_url,
  extract_extension,
} from './modules/files/MimeTypes';

export {
  validate_file_upload_constraints,
  build_file_upload_form,
  parse_uploaded_file_response,
  type FileDownloadQuery,
  type FileUploadRequest,
  type FileUploadFormFields,
} from './modules/files/types';