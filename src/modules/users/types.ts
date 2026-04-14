import type {
  UUID,
  ISODate,
  UserKind,
  UserProfile,
} from '../../types/common';
export * from '../../types/common';

/**
 * Query parameters for user lookup by email (deprecated single)
 */
export interface UserByEmailQuery {
  email: string;
}

/**
 * Request payload for bulk user lookup by emails
 */
export interface UsersByEmailRequest {
  emails: string[];
}

/**
 * Response from bulk email lookup
 */
export interface UsersByEmailResponse {
  users: UserProfile[];
}

/**
 * Query parameters for user lookup by HUID
 */
export interface UserByHuidQuery {
  user_huid: UUID;
}

/**
 * Query parameters for user lookup by AD login and domain
 */
export interface UserByLoginQuery {
  ad_login: string;
  ad_domain: string;
}

/**
 * Query parameters for user lookup by other_id
 */
export interface UserByOtherIdQuery {
  other_id: string;
}

/**
 * Query parameters for CSV user list export
 */
export interface UsersCsvQuery {
  cts_user?: boolean;
  unregistered?: boolean;
  botx?: boolean;
}

/**
 * Request payload for updating user profile
 */
export interface UpdateProfileRequest {
  user_huid: UUID;
  name?: string;
  public_name?: string;
  avatar?: string;
  company?: string;
  company_position?: string;
  description?: string;
  department?: string;
  office?: string;
  manager?: string;
}

/**
 * CSV row representation for user list
 */
export interface UserCsvRow {
  huid: UUID;
  ad_login: string;
  domain: string;
  ad_email: string | null;
  name: string;
  sync_source: 'ad' | 'admin' | 'email' | 'openid';
  active: boolean;
  kind: UserKind;
  company: string | null;
  department: string | null;
  position: string | null;
  manager: string | null;
  manager_huid: UUID | null;
}

/**
 * Parse CSV response from users_as_csv endpoint
 * @param csv_text - Raw CSV string response
 * @returns Array of parsed user rows
 */
export function parse_users_csv(csv_text: string): UserCsvRow[] {
  const lines = csv_text.trim().split('\n');
  if (lines.length <= 1) return [];
  
  const headers = lines[0].split(',');
  const rows: UserCsvRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row: Partial<UserCsvRow> = {};
    headers.forEach((header, idx) => {
      const key = header.toLowerCase().replace(/\s+/g, '_') as keyof UserCsvRow;
      const value = values[idx];
      if (value === 'null' || value === '') {
        row[key] = null as never;
      } else if (value === 'true' || value === 'false') {
        row[key] = (value === 'true') as never;
      } else {
        row[key] = value as never;
      }
    });
    rows.push(row as UserCsvRow);
  }
  return rows;
}

/**
 * Validate profile update payload fields
 * @param payload - Update request object
 * @throws Error if required field missing or invalid format
 */
export function validate_update_profile_payload(payload: UpdateProfileRequest): void {
  if (!payload.user_huid) {
    throw new Error('user_huid is required for profile update');
  }
  if (payload.avatar && !payload.avatar.startsWith('data:')) {
    throw new Error('avatar must be RFC 2397 data URL format');
  }
}