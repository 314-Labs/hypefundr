// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// src/app.d.ts

import type { Database } from '$lib/database.types';
import { SupabaseClient, Session } from '@supabase/supabase-js'

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>
      getSession(): Promise<Session | null>
    }
    interface PageData {
      session: Session | null
    }
    // interface Error {}
    // interface Platform {}
  }
}

export {};
