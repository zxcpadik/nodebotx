import type {
  UUID,
  ISODate,
  ChatType,
  UserKind,
  ChatMember,
  ChatInfo,
  LinkType,
  LinkParams,
  CreatedLink,
} from '../../types/common';
export * from '../../types/common';

/**
 * Query parameters for personal chat lookup
 */
export interface PersonalChatQuery {
  user_huid: UUID;
}

/**
 * Query parameters for chat info lookup
 */
export interface ChatInfoQuery {
  group_chat_id: UUID;
}

/**
 * Request payload for adding users to chat
 */
export interface AddUsersRequest {
  group_chat_id: UUID;
  user_huids: UUID[];
}

/**
 * Request payload for removing users from chat
 */
export interface RemoveUsersRequest {
  group_chat_id: UUID;
  user_huids: UUID[];
}

/**
 * Request payload for adding admin to chat
 */
export interface AddAdminRequest {
  group_chat_id: UUID;
  user_huids: UUID[];
}

/**
 * Request payload for stealth mode configuration
 */
export interface StealthSetRequest {
  group_chat_id: UUID;
  disable_web?: boolean;
  burn_in?: number | null;
  expire_in?: number | null;
}

/**
 * Request payload for stealth mode disable
 */
export interface StealthDisableRequest {
  group_chat_id: UUID;
}

/**
 * Request payload for chat creation
 */
export interface CreateChatRequest {
  name: string;
  description?: string | null;
  chat_type: ChatType;
  members: UUID[];
  avatar?: string | null;
  shared_history?: boolean;
}

/**
 * Response from chat creation endpoint
 */
export interface CreateChatResponse {
  chat_id: UUID;
}

/**
 * Request payload for pin/unpin message
 */
export interface PinMessageRequest {
  chat_id: UUID;
  sync_id: UUID;
}

/**
 * Request payload for unpin message (chat_id only)
 */
export interface UnpinMessageRequest {
  chat_id: UUID;
}

/**
 * Request payload for creating chat link
 */
export interface CreateLinkRequest {
  chat_id: UUID;
  link: LinkParams;
}

/**
 * Request payload for creating thread from message
 */
export interface CreateThreadRequest {
  sync_id: UUID;
}

/**
 * Response from thread creation endpoint
 */
export interface CreateThreadResponse {
  thread_id: UUID;
}

/**
 * Response from chat list endpoint
 */
export interface ChatListResponse {
  chats: ChatInfo[];
}

/**
 * Check if chat member has admin privileges
 * @param member - Chat member object
 * @returns True if member is admin
 */
export function is_admin_member(member: ChatMember | UUID): member is ChatMember {
  return typeof member === 'object' && 'admin' in member;
}

/**
 * Extract user_huid from chat member representation
 * @param member - Chat member as UUID or ChatMember object
 * @returns User HUID string
 */
export function get_member_huid(member: ChatMember | UUID): UUID {
  if (typeof member === 'string') {
    return member;
  }
  return member.user_huid;
}