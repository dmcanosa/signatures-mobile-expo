import 'react-native-url-polyfill/auto';

import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { EXPO_PUBLIC_SUPABASE_APP_URL, EXPO_PUBLIC_SUPABASE_API_KEY } from '@env';
//import Config from 'react-native-config';

//const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_APP_URL as string;
//const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY as string;

const supabaseUrl = EXPO_PUBLIC_SUPABASE_APP_URL as string;
const supabaseKey = EXPO_PUBLIC_SUPABASE_API_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Supabase Anon Key');
}

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
