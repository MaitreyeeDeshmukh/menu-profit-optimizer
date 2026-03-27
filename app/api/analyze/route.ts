export const runtime = 'edge'
export const maxDuration = 30

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'

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

  // Build a concise prompt
  const menuData = menuItems.map((item) => {
    const margin = item.selling_price > 0
      ? (((item.selling_price - item.cost_price) / item.selling_price) * 100).toFixed(0)
      : '0'
    return `${item.name} (${item.category}): cost $${item.cost_price}, price $${item.selling_price}, margin ${margin}%${item.is_popular ? ', popular' : ''}`
  }).join('\n')

  const prompt = `You are a restaurant profit consultant. Analyze this menu and return ONLY a JSON object.

Restaurant: ${restaurant.name} (${restaurant.cuisine_type})

Menu:
${menuData}

Return this exact JSON (no markdown, no extra text):
{
  "summary": "2 sentence summary of profitability",
  "recommendations": [
    {
      "item_name": "name",
      "current_price": 0.00,
      "suggested_price": 0.00,
      "current_margin": 0,
      "suggested_margin": 70,
      "reasoning": "one sentence reason",
      "priority": "high"
    }
  ]
}

Only include items with margin under 65%. Max 6 recommendations. Priority: high=under 40%, medium=40-55%, low=55-65%.`

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

  let parsed = { summary: '', recommendations: [] as object[] }
  try {
    const clean = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    parsed = JSON.parse(clean)
  } catch {
    parsed.summary = 'Analysis complete. See recommendations below.'
  }

  // Compute stats
  const margins = menuItems.map((item) =>
    item.selling_price > 0 ? ((item.selling_price - item.cost_price) / item.selling_price) * 100 : 0
  )
  const avg_margin = Math.round((margins.reduce((a, b) => a + b, 0) / margins.length) * 10) / 10
  const high_margin_count = margins.filter((m) => m >= 70).length
  const low_margin_count = margins.filter((m) => m < 50).length

  const { data: saved, error: saveError } = await db
    .from('analyses')
    .insert({
      restaurant_id,
      summary: parsed.summary || '',
      recommendations: parsed.recommendations || [],
      total_items: menuItems.length,
      avg_margin,
      high_margin_count,
      low_margin_count,
    })
    .select()
    .single()

  if (saveError) return NextResponse.json({ error: saveError.message }, { status: 500 })

  return NextResponse.json({ ...saved, recommendations: parsed.recommendations || [] })
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
