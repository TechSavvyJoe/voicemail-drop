import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase, isDemoMode, Database } from './supabase';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  phone?: string;
}

// Use a default JWT secret for demo mode
const JWT_SECRET = process.env.JWT_SECRET || 'demo-jwt-secret-key-for-development-only';

export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): object {
  try {
    return jwt.verify(token, JWT_SECRET) as object;
  } catch {
    throw new Error('Invalid token');
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generatePasswordResetToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Demo users for testing
const demoUsers = [
  {
    id: 'demo-user-1',
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User',
    organizationName: 'Demo Dealership',
    phone: '555-0123',
    password: 'demo123'
  },
  {
    id: 'demo-user-2',
    email: 'admin@demo.com',
    firstName: 'Admin',
    lastName: 'User',
    organizationName: 'Premium Motors',
    phone: '555-0456',
    password: 'admin123'
  }
];

export class AuthService {
  static async signUp(data: SignUpData) {
    try {
      // In demo mode, return mock success
      if (isDemoMode) {
        const userId = `demo-user-${Date.now()}`;
        return {
          user: {
            id: userId,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            organizationName: data.organizationName,
            phone: data.phone
          },
          token: generateToken({ id: userId, email: data.email })
        };
      }

      // For production, would implement full Supabase auth here
      const userId = `user-${Date.now()}`;
      
      return {
        user: {
          id: userId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          organizationName: data.organizationName,
          phone: data.phone
        },
        token: generateToken({ id: userId, email: data.email })
      };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  static async signIn(email: string, password: string) {
    try {
      // In demo mode, check against demo users
      if (isDemoMode) {
        const user = demoUsers.find(u => u.email === email && u.password === password);
        if (!user) {
          throw new Error('Invalid credentials');
        }
        
        return {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            organizationName: user.organizationName,
            phone: user.phone
          },
          token: generateToken({ id: user.id, email: user.email })
        };
      }

      // For production, would use Supabase auth here
      throw new Error('Sign in not implemented in demo mode');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  static async signOut() {
    try {
      if (isDemoMode) {
        return { success: true };
      }

      if (!supabase) {
        throw new Error('Database not available');
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      if (isDemoMode) {
        return demoUsers[0]; // Return first demo user
      }

      // For production, would get current user from Supabase
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async updateProfile(_userId: string, _updates: Partial<UserProfile>) {
    try {
      if (isDemoMode) {
        return { success: true };
      }

      // For production, would update profile in Supabase
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  static async resetPassword(email: string) {
    try {
      if (isDemoMode) {
        return { success: true, message: 'Demo mode: Password reset email would be sent' };
      }

      if (!supabase) {
        throw new Error('Database not available');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  static async updatePassword(newPassword: string) {
    try {
      if (isDemoMode) {
        return { success: true };
      }

      if (!supabase) {
        throw new Error('Database not available');
      }

      const { data, error } = await supabase
        .auth.updateUser({ password: newPassword });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  }
}
