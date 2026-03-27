import { createClient } from '@supabase/supabase-js'

export type Restaurant = {
  id: string
  user_id: string
  name: string
  cuisine_type: string
  location: string
  description: string
  created_at: string
}

export type MenuItem = {
  id: string
  restaurant_id: string
  name: string
  category: string
  cost_price: number
  selling_price: number
  description: string
  is_popular: boolean
  created_at: string
}

export type Analysis = {
  id: string
  restaurant_id: string
  summary: string
  recommendations: Recommendation[]
  total_items: number
  avg_margin: number
  high_margin_count: number
  low_margin_count: number
  created_at: string
}

export type Recommendation = {
  item_name: string
  current_price: number
  suggested_price: number
  current_margin: number
  suggested_margin: number
  reasoning: string
  priority: 'high' | 'medium' | 'low'
}

export function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
