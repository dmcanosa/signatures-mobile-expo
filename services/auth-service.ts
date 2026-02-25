/**
 * Supabase Authentication Service Layer for React Native
 * Centralizes all auth-related Supabase operations
 */

import { supabase } from '@/config/supabase';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * Register a new user with Supabase Auth and create user profile
 * Passwords are never stored in the user table - only managed by Supabase Auth
 */
export async function signUpUser(data: SignUpData) {
  try {
    // Create auth user
    const authRes = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authRes.error) {
      throw new Error(`Auth signup failed: ${authRes.error.message}`);
    }

    if (!authRes.data.user?.id) {
      throw new Error('No user ID returned from signup');
    }

    // Create user profile (without password)
    const profileRes = await supabase.from('users').insert({
      id: authRes.data.user.id,
      name: data.name,
      email: data.email,
    });

    if (profileRes.error) {
      throw new Error(`User profile creation failed: ${profileRes.error.message}`);
    }

    return { success: true, userId: authRes.data.user.id };
  } catch (error) {
    throw error;
  }
}

/**
 * Sign in user with email and password
 */
export async function signInUser(data: SignInData) {
  try {
    const res = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (res.error) {
      throw new Error(`Sign in failed: ${res.error.message}`);
    }

    return { success: true, user: res.data.user };
  } catch (error) {
    throw error;
  }
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  try {
    const res = await supabase.auth.signOut();

    if (res.error) {
      throw new Error(`Sign out failed: ${res.error.message}`);
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  try {
    const res = await supabase.auth.getUser();

    if (res.error) {
      throw new Error(`Failed to get user: ${res.error.message}`);
    }

    return res.data.user;
  } catch (error) {
    throw error;
  }
}

/**
 * Get current user ID
 */
export async function getCurrentUserId(): Promise<string> {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      throw new Error('No authenticated user found');
    }
    return user.id;
  } catch (error) {
    throw error;
  }
}
