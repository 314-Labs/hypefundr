export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      campaign_likes: {
        Row: {
          campaign_id: number
          liked_at: string | null
          user: string
        }
        Insert: {
          campaign_id: number
          liked_at?: string | null
          user: string
        }
        Update: {
          campaign_id?: number
          liked_at?: string | null
          user?: string
        }
      }
      campaign_payouts: {
        Row: {
          amount: number
          campaign_id: number
          credited_at: string
          id: number
        }
        Insert: {
          amount: number
          campaign_id: number
          credited_at?: string
          id?: number
        }
        Update: {
          amount?: number
          campaign_id?: number
          credited_at?: string
          id?: number
        }
      }
      campaign_results: {
        Row: {
          campaign_id: number
          created_at: string
          id: number
          user_id: string
          won: boolean
        }
        Insert: {
          campaign_id: number
          created_at?: string
          id?: number
          user_id: string
          won: boolean
        }
        Update: {
          campaign_id?: number
          created_at?: string
          id?: number
          user_id?: string
          won?: boolean
        }
      }
      campaigns: {
        Row: {
          created_at: string
          creator: string
          description: string
          game_id: number | null
          game_mode: number | null
          id: number
          title: string
        }
        Insert: {
          created_at?: string
          creator: string
          description: string
          game_id?: number | null
          game_mode?: number | null
          id?: number
          title: string
        }
        Update: {
          created_at?: string
          creator?: string
          description?: string
          game_id?: number | null
          game_mode?: number | null
          id?: number
          title?: string
        }
      }
      game_modes: {
        Row: {
          game_id: number
          id: number
          mode: string
        }
        Insert: {
          game_id: number
          id?: number
          mode: string
        }
        Update: {
          game_id?: number
          id?: number
          mode?: string
        }
      }
      games: {
        Row: {
          id: number
          igdb_id: number
          title: string
        }
        Insert: {
          id?: number
          igdb_id: number
          title: string
        }
        Update: {
          id?: number
          igdb_id?: number
          title?: string
        }
      }
      pledges: {
        Row: {
          amount: number
          campaign_id: number
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          amount: number
          campaign_id: number
          created_at?: string
          id?: number
          user_id: string
        }
        Update: {
          amount?: number
          campaign_id?: number
          created_at?: string
          id?: number
          user_id?: string
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
