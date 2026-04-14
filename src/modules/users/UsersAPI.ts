import { API_ENDPOINTS } from '../../config/constants';
import { is_valid_uuid } from '../../utils/validators';
import { validate_update_profile_payload, parse_users_csv } from './types';
import type { BotXClient } from '../../core/BotXClient';
import type { UUID } from '../../types/common';
import type {
  UsersByEmailRequest,
  UsersByEmailResponse,
  UserByHuidQuery,
  UserByLoginQuery,
  UserByOtherIdQuery,
  UsersCsvQuery,
  UpdateProfileRequest,
  UserProfile,
  UserCsvRow,
} from './types';

/**
 * Users API module for user lookup and profile management
 */
export class UsersAPI {
  private readonly client: BotXClient;

  /**
   * Create UsersAPI module instance
   * @param client - Parent BotXClient instance
   */
  constructor(client: BotXClient) {
    this.client = client;
  }

  /**
   * Lookup single user by email (deprecated endpoint)
   * @param email - User email address
   * @returns User profile data
   * @deprecated Use by_emails_bulk instead for multiple lookups
   */
  async by_email(email: string): Promise<UserProfile> {
    return await this.client.request<UserProfile>(
      'GET',
      API_ENDPOINTS.USERS.BY_EMAIL_DEPRECATED,
      { query_params: { email } }
    );
  }

  /**
   * Lookup multiple users by emails (bulk endpoint)
   * @param emails - Array of email addresses to lookup
   * @returns Array of matching user profiles
   */
  async by_emails_bulk(emails: string[]): Promise<UserProfile[]> {
    const response = await this.client.request<UsersByEmailResponse, UsersByEmailRequest>(
      'POST',
      API_ENDPOINTS.USERS.BY_EMAIL,
      { body: { emails } }
    );
    return response.users || [];
  }

  /**
   * Lookup user by HUID
   * @param user_huid - User unique identifier
   * @returns User profile data
   */
  async by_huid(user_huid: UUID): Promise<UserProfile> {
    if (!is_valid_uuid(user_huid)) {
      throw new Error('Invalid user_huid format');
    }
    
    return await this.client.request<UserProfile>(
      'GET',
      API_ENDPOINTS.USERS.BY_HUID,
      { query_params: { user_huid } }
    );
  }

  /**
   * Lookup user by AD login and domain
   * @param ad_login - Active Directory login name
   * @param ad_domain - Active Directory domain
   * @returns User profile data
   */
  async by_login(ad_login: string, ad_domain: string): Promise<UserProfile> {
    return await this.client.request<UserProfile>(
      'GET',
      API_ENDPOINTS.USERS.BY_LOGIN,
      { query_params: { ad_login, ad_domain } }
    );
  }

  /**
   * Lookup user by external identifier
   * @param other_id - External system user identifier
   * @returns User profile data
   */
  async by_other_id(other_id: string): Promise<UserProfile> {
    return await this.client.request<UserProfile>(
      'GET',
      API_ENDPOINTS.USERS.BY_OTHER_ID,
      { query_params: { other_id } }
    );
  }

  /**
   * Export user list as CSV from CTS
   * @param query - Filter options for user kinds to include
   * @returns Raw CSV string response
   */
  async list_as_csv(query?: UsersCsvQuery): Promise<string> {
    return await this.client.request<string>(
      'GET',
      API_ENDPOINTS.USERS.LIST_CSV,
      { query_params: query as any }
    );
  }

  /**
   * Export and parse user list as structured objects
   * @param query - Filter options for user kinds to include
   * @returns Array of parsed user row objects
   */
  async list_as_objects(query?: UsersCsvQuery): Promise<UserCsvRow[]> {
    const csv_text = await this.list_as_csv(query);
    return parse_users_csv(csv_text);
  }

  /**
   * Update user profile fields
   * @param payload - User HUID and fields to update
   * @returns True on success
   */
  async update_profile(payload: UpdateProfileRequest): Promise<boolean> {
    validate_update_profile_payload(payload);
    
    return await this.client.request<boolean, UpdateProfileRequest>(
      'PUT',
      API_ENDPOINTS.USERS.UPDATE_PROFILE,
      { body: payload }
    );
  }
}