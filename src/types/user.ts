import { type IdentifiableType, type ActiveType, type TimestampType } from './';

export const UserRole = {
    ADMIN: 'admin',
    USER: 'user',
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User extends IdentifiableType, TimestampType, ActiveType {
    username: string;
    email: string;
    password?: string;
    role: UserRole;
    fiqh?: string;
    avatar?: string;
    isVerified?: boolean;
    token?: string;
    code?: {
        otp?: string;
        expiresAt?: Date;
    };
}
