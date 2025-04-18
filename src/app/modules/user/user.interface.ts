export const USER_ROLE = {
  admin: 'admin',
  user: 'user',
  provider: 'provider'
} as const;

export interface TUser {
  name: string;
  email: string;
  // phone: string;
  // address: string;
  // city: string;
  password: string;
  role: 'admin' | 'user' | 'provider';
  isBlocked: boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
