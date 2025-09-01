import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const createGroup = async (groupName: string) => {
    const { data, error } = await supabase
      .from('groups')
      .insert([{ name: groupName }])
      .single();
  
    if (error) {
      throw new Error(error.message);
    }
  
    return data;
  };
  