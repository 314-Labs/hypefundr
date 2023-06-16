export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      campaign_likes: {
        Row: {
          campaign_id: number
          liked_at: string | null
          user_id: string
        }
        Insert: {
          campaign_id: number
          liked_at?: string | null
          user_id: string
        }
        Update: {
          campaign_id?: number
          liked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_likes_campaign_id_fkey"
            columns: ["campaign_id"]
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_likes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      campaign_participants: {
        Row: {
          campaign_id: number
          user_id: string
        }
        Insert: {
          campaign_id: number
          user_id: string
        }
        Update: {
          campaign_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_participants_campaign_id_fkey"
            columns: ["campaign_id"]
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_participants_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "campaign_payouts_campaign_id_fkey"
            columns: ["campaign_id"]
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "campaign_results_campaign_id_fkey"
            columns: ["campaign_id"]
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_results_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      campaigns: {
        Row: {
          closed: boolean
          created_at: string
          creator: string
          description: string
          game_id: number | null
          game_mode: number | null
          goal: number | null
          id: number
          slug: string
          tagline: string | null
          title: string
        }
        Insert: {
          closed?: boolean
          created_at?: string
          creator: string
          description: string
          game_id?: number | null
          game_mode?: number | null
          goal?: number | null
          id?: number
          slug?: string
          tagline?: string | null
          title: string
        }
        Update: {
          closed?: boolean
          created_at?: string
          creator?: string
          description?: string
          game_id?: number | null
          game_mode?: number | null
          goal?: number | null
          id?: number
          slug?: string
          tagline?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_creator_fkey"
            columns: ["creator"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_game_mode_fkey"
            columns: ["game_mode"]
            referencedRelation: "game_modes"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "game_modes_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
      }
      payouts: {
        Row: {
          amount: number
          campaign_id: number | null
          created_at: string | null
          id: number
          user_id: string
        }
        Insert: {
          amount: number
          campaign_id?: number | null
          created_at?: string | null
          id?: number
          user_id: string
        }
        Update: {
          amount?: number
          campaign_id?: number | null
          created_at?: string | null
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_campaign_id_fkey"
            columns: ["campaign_id"]
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payouts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "pledges_campaign_id_fkey"
            columns: ["campaign_id"]
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pledges_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      distribute_campaign_funds: {
        Args: {
          campaign_id_input: number
        }
        Returns: undefined
      }
      get_pledge_total: {
        Args: {
          campaign_id: number
        }
        Returns: number
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
