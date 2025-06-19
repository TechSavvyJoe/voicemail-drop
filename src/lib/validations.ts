import { z } from 'zod';

export const CustomerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  vehicleInterest: z.string().optional(),
  lastContact: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const CampaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  voicemailScript: z.string().min(10, 'Script must be at least 10 characters').max(500, 'Script must be less than 500 characters'),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
  customerList: z.enum(['all', 'uploaded', 'custom']),
  customCustomers: z.string().optional(),
  voiceId: z.string().optional(),
  callerId: z.string().optional(),
});

export const UserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  phone: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password confirmation is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type Customer = z.infer<typeof CustomerSchema>;
export type Campaign = z.infer<typeof CampaignSchema>;
export type User = z.infer<typeof UserSchema>;
export type LoginCredentials = z.infer<typeof LoginSchema>;
export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>;
export type ResetPassword = z.infer<typeof ResetPasswordSchema>;

// Database types
export interface DatabaseCustomer extends Customer {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseCampaign {
  id: string;
  userId: string;
  name: string;
  voicemailScript: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'failed';
  scheduledAt?: string;
  customers: DatabaseCustomer[];
  results: {
    sent: number;
    delivered: number;
    listened: number;
    failed: number;
  };
  voiceId?: string;
  callerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  subscription: {
    plan: 'starter' | 'professional' | 'enterprise';
    status: 'active' | 'inactive' | 'past_due' | 'canceled';
    currentPeriodEnd: string;
    voicemailsUsed: number;
    voicemailsLimit: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface VoicemailResult {
  id: string;
  campaignId: string;
  customerId: string;
  phoneNumber: string;
  status: 'pending' | 'delivered' | 'failed' | 'listened';
  deliveredAt?: string;
  listenedAt?: string;
  duration?: number;
  errorMessage?: string;
  cost: number;
  createdAt: string;
}
