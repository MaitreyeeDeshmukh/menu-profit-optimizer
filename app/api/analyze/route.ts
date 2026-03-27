export const maxDuration = 60

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { restaurant_id } = await req.json()
  if (!restaurant_id) return NextResponse.json({ error: 'restaurant_id required' }, { status: 400 })

  const db = getSupabaseAdmin()

  const { data: restaurant } = await db.from('restaurants').select('*').eq('id', restaurant_id).eq('user_id', userId).single()
  if (!restaurant) return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })

  const { data: menuItems } = await db.from('menu_items').select('*').eq('restaurant_id', restaurant_id)
  if (!menuItems || menuItems.length === 0) return NextResponse.json({ error: 'No menu items found. Add items first.' }, { status: 400 })

  // Build minimal menu string
  const menuStr = menuItems.map(i =>
    `${i.name}:cost=${i.cost_price},price=${i.selling_price}`
  ).join(';')

  const prompt = `Restaurant: ${restaurant.name} (${restaurant.cuisine_type}). Menu: ${menuStr}. For items with margin under 65%, suggest better prices. Return JSON only: {"summary":"...","recommendations":[{"item_name":"...","current_price":0,"suggested_price":0,"current_margin":0,"suggested_margin":70,"reasoning":"...","priority":"high|medium|low"}]}`

  // Direct fetch to Anthropic (no SDK)
  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text()
    return NextResponse.json({ error: `Anthropic API error: ${err}` }, { status: 500 })
  }

  const anthropicData = await anthropicRes.json()
  const text = anthropicData.content?.[0]?.text || ''

  let parsed = { summary: 'Analysis complete.', recommendations: [] as object[] }
  try {
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    parsed = JSON.parse(clean)
  } catch {
    // keep defaults
  }

  const margins = menuItems.map(i => i.selling_price > 0 ? ((i.selling_price - i.cost_price) / i.selling_price) * 100 : 0)
  const avg_margin = Math.round(margins.reduce((a, b) => a + b, 0) / margins.length * 10) / 10

  const { data: saved } = await db.from('analyses').insert({
    restaurant_id,
    summary: parsed.summary || '',
    recommendations: parsed.recommendations || [],
    total_items: menuItems.length,
    avg_margin,
    high_margin_count: margins.filter(m => m >= 70).length,
    low_margin_count: margins.filter(m => m < 50).length,
  }).select().single()

  return NextResponse.json({ ...saved, recommendations: parsed.recommendations || [] })
}

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const restaurantId = searchParams.get('restaurant_id')
  if (!restaurantId) return NextResponse.json({ error: 'restaurant_id required' }, { status: 400 })

  const db = getSupabaseAdmin()
  const { data, error } = await db.from('analyses').select('*').eq('restaurant_id', restaurantId).order('created_at', { ascending: false }).limit(5)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
