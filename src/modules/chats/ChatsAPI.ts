import { API_ENDPOINTS } from '../../config/constants';
import { is_valid_uuid } from '../../utils/validators';
import type { BotXClient } from '../../core/BotXClient';
import type { UUID } from '../../types/common';
import type {
  PersonalChatQuery,
  ChatInfoQuery,
  AddUsersRequest,
  RemoveUsersRequest,
  AddAdminRequest,
  StealthSetRequest,
  StealthDisableRequest,
  CreateChatRequest,
  CreateChatResponse,
  PinMessageRequest,
  UnpinMessageRequest,
  CreateLinkRequest,
  CreatedLink,
  CreateThreadRequest,
  CreateThreadResponse,
  ChatListResponse,
  ChatInfo,
} from './types';

/**
 * Chats API module for chat management operations
 */
export class ChatsAPI {
  private readonly client: BotXClient;

  /**
   * Create ChatsAPI module instance
   * @param client - Parent BotXClient instance
   */
  constructor(client: BotXClient) {
    this.client = client;
  }

  /**
   * Get personal chat between bot and specific user
   * @param user_huid - Target user identifier
   * @returns Chat info for personal conversation
   */
  async get_personal_chat(user_huid: UUID): Promise<ChatInfo> {
    if (!is_valid_uuid(user_huid)) {
      throw new Error('Invalid user_huid format');
    }
    
    return await this.client.request<ChatInfo>(
      'GET',
      API_ENDPOINTS.CHATS.PERSONAL,
      { query_params: { user_huid } }
    );
  }

  /**
   * Get list of all chats bot participates in
   * @returns Array of chat information objects
   */
  async list_chats(): Promise<ChatInfo[]> {
    const response = await this.client.request<ChatListResponse>(
      'GET',
      API_ENDPOINTS.CHATS.LIST
    );
    return response.chats || [];
  }

  /**
   * Get detailed information about specific chat
   * @param group_chat_id - Chat identifier
   * @returns Full chat info with members and metadata
   */
  async get_chat_info(group_chat_id: UUID): Promise<ChatInfo> {
    if (!is_valid_uuid(group_chat_id)) {
      throw new Error('Invalid group_chat_id format');
    }
    
    return await this.client.request<ChatInfo>(
      'GET',
      API_ENDPOINTS.CHATS.INFO,
      { query_params: { group_chat_id } }
    );
  }

  /**
   * Add users to existing chat
   * @param request - Chat ID and list of user HUIDs to add
   * @returns True on success
   */
  async add_users(request: AddUsersRequest): Promise<boolean> {
    return await this.client.request<boolean, AddUsersRequest>(
      'POST',
      API_ENDPOINTS.CHATS.ADD_USER,
      { body: request }
    );
  }

  /**
   * Remove users from existing chat
   * @param request - Chat ID and list of user HUIDs to remove
   * @returns True on success
   */
  async remove_users(request: RemoveUsersRequest): Promise<boolean> {
    return await this.client.request<boolean, RemoveUsersRequest>(
      'POST',
      API_ENDPOINTS.CHATS.REMOVE_USER,
      { body: request }
    );
  }

  /**
   * Promote users to admin role in chat
   * @param request - Chat ID and list of user HUIDs to promote
   * @returns True on success
   */
  async add_admin(request: AddAdminRequest): Promise<boolean> {
    return await this.client.request<boolean, AddAdminRequest>(
      'POST',
      API_ENDPOINTS.CHATS.ADD_ADMIN,
      { body: request }
    );
  }

  /**
   * Enable stealth mode for chat with optional settings
   * @param request - Chat ID and stealth configuration
   * @returns True on success
   */
  async stealth_set(request: StealthSetRequest): Promise<boolean> {
    return await this.client.request<boolean, StealthSetRequest>(
      'POST',
      API_ENDPOINTS.CHATS.STEALTH_SET,
      { body: request }
    );
  }

  /**
   * Disable stealth mode for chat
   * @param group_chat_id - Chat identifier
   * @returns True on success
   */
  async stealth_disable(group_chat_id: UUID): Promise<boolean> {
    return await this.client.request<boolean, StealthDisableRequest>(
      'POST',
      API_ENDPOINTS.CHATS.STEALTH_DISABLE,
      { body: { group_chat_id } }
    );
  }

  /**
   * Create new chat with specified participants
   * @param request - Chat configuration including name, type, members
   * @returns Created chat identifier
   */
  async create_chat(request: CreateChatRequest): Promise<CreateChatResponse> {
    return await this.client.request<CreateChatResponse, CreateChatRequest>(
      'POST',
      API_ENDPOINTS.CHATS.CREATE,
      { body: request }
    );
  }

  /**
   * Pin message in chat
   * @param request - Chat ID and message sync_id to pin
   * @returns Confirmation of pin operation
   */
  async pin_message(request: PinMessageRequest): Promise<{ result: 'message_pinned' }> {
    return await this.client.request<{ result: 'message_pinned' }, PinMessageRequest>(
      'POST',
      API_ENDPOINTS.CHATS.PIN_MESSAGE,
      { body: request }
    );
  }

  /**
   * Unpin message in chat
   * @param chat_id - Chat identifier (unpins current pinned message)
   * @returns Confirmation of unpin operation
   */
  async unpin_message(chat_id: UUID): Promise<{ result: 'message_unpinned' }> {
    return await this.client.request<{ result: 'message_unpinned' }, UnpinMessageRequest>(
      'POST',
      API_ENDPOINTS.CHATS.UNPIN_MESSAGE,
      { body: { chat_id } }
    );
  }

  /**
   * Create invitation link for chat
   * @param request - Chat ID and link configuration
   * @returns Created link object with URL and settings
   */
  async create_link(request: CreateLinkRequest): Promise<CreatedLink> {
    return await this.client.request<CreatedLink, CreateLinkRequest>(
      'POST',
      API_ENDPOINTS.CHATS.CREATE_LINK,
      { body: request }
    );
  }

  /**
   * Create thread from existing message
   * @param sync_id - Message identifier to create thread from
   * @returns Created thread identifier
   */
  async create_thread(sync_id: UUID): Promise<CreateThreadResponse> {
    return await this.client.request<CreateThreadResponse, CreateThreadRequest>(
      'POST',
      API_ENDPOINTS.CHATS.CREATE_THREAD,
      { body: { sync_id } }
    );
  }
}