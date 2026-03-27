export const maxDuration = 60

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { analyzeMenuProfitability } from '@/lib/claude'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { restaurant_id } = await req.json()
  if (!restaurant_id) return NextResponse.json({ error: 'restaurant_id required' }, { status: 400 })

  const db = getSupabaseAdmin()

  const { data: restaurant, error: restError } = await db
    .from('restaurants')
    .select('*')
    .eq('id', restaurant_id)
    .eq('user_id', userId)
    .single()

  if (restError || !restaurant)
    return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })

  const { data: menuItems, error: menuError } = await db
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurant_id)

  if (menuError) return NextResponse.json({ error: menuError.message }, { status: 500 })
  if (!menuItems || menuItems.length === 0)
    return NextResponse.json({ error: 'No menu items found. Add items first.' }, { status: 400 })

  const analysis = await analyzeMenuProfitability(
    restaurant.name,
    restaurant.cuisine_type,
    menuItems
  )

  const { data: saved, error: saveError } = await db
    .from('analyses')
    .insert({
      restaurant_id,
      summary: analysis.summary,
      recommendations: analysis.recommendations,
      total_items: menuItems.length,
      avg_margin: analysis.avg_margin,
      high_margin_count: analysis.high_margin_count,
      low_margin_count: analysis.low_margin_count,
    })
    .select()
    .single()

  if (saveError) return NextResponse.json({ error: saveError.message }, { status: 500 })

  return NextResponse.json({ ...saved, recommendations: analysis.recommendations })
}

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const restaurantId = searchParams.get('restaurant_id')
  if (!restaurantId) return NextResponse.json({ error: 'restaurant_id required' }, { status: 400 })

  const db = getSupabaseAdmin()
  const { data, error } = await db
    .from('analyses')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
