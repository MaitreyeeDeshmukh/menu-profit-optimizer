export const maxDuration = 60

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

function ruleBasedAnalysis(restaurantName: string, cuisineType: string, menuItems: any[]) {
  const withMargins = menuItems.map(i => ({
    ...i,
    margin: i.selling_price > 0 ? ((i.selling_price - i.cost_price) / i.selling_price) * 100 : 0
  }))

  const recommendations = withMargins
    .filter(i => i.margin < 65)
    .sort((a, b) => a.margin - b.margin)
    .slice(0, 6)
    .map(i => {
      const suggested = Math.ceil((i.cost_price / 0.30) * 100) / 100
      return {
        item_name: i.name,
        current_price: i.selling_price,
        suggested_price: suggested,
        current_margin: Math.round(i.margin * 10) / 10,
        suggested_margin: 70,
        reasoning: i.margin < 40
          ? `Very low margin of ${i.margin.toFixed(0)}%. Raising to $${suggested} targets a healthy 70% margin for ${cuisineType} cuisine.`
          : `Margin of ${i.margin.toFixed(0)}% is below the 65% target. A price of $${suggested} would improve profitability.`,
        priority: i.margin < 40 ? 'high' : i.margin < 55 ? 'medium' : 'low'
      }
    })

  const avg = withMargins.reduce((s, i) => s + i.margin, 0) / withMargins.length
  const low = withMargins.filter(i => i.margin < 50)
  const high = withMargins.filter(i => i.margin >= 70)

  const summary = low.length > 0
    ? `${restaurantName} has an average margin of ${avg.toFixed(1)}%. ${low.length} item(s) including ${low.slice(0,2).map(i=>i.name).join(', ')} need immediate repricing to stay profitable.`
    : `${restaurantName} has solid margins averaging ${avg.toFixed(1)}%. ${high.length} item(s) are performing above 70% — focus on promoting these.`

  return { summary, recommendations, avg_margin: Math.round(avg * 10) / 10, high_margin_count: high.length, low_margin_count: low.length }
}

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

  let result = ruleBasedAnalysis(restaurant.name, restaurant.cuisine_type, menuItems)

  // Try Gemini AI — fall back to rule-based if anything fails
  const apiKey = process.env.GEMINI_API_KEY
  if (apiKey) {
    try {
      const menuStr = menuItems.map(i => `${i.name}:cost=$${i.cost_price},price=$${i.selling_price}`).join(';')
      const prompt = `Restaurant: ${restaurant.name} (${restaurant.cuisine_type}). Menu: ${menuStr}. For items with margin under 65%, suggest better prices. Return JSON only: {"summary":"...","recommendations":[{"item_name":"...","current_price":0,"suggested_price":0,"current_margin":0,"suggested_margin":70,"reasoning":"...","priority":"high|medium|low"}]}`

      // Try models in order
      const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro', 'gemini-2.0-flash-lite']
      for (const model of models) {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 800, temperature: 0.3 } }),
          }
        )
        if (!res.ok) continue
        const data = await res.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
        if (!text) continue
        const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        const parsed = JSON.parse(clean)
        if (parsed.summary && parsed.recommendations) {
          result = { ...result, summary: parsed.summary, recommendations: parsed.recommendations }
        }
        break
      }
    } catch {
      // use rule-based result
    }
  }

  const { data: saved } = await db.from('analyses').insert({
    restaurant_id,
    summary: result.summary,
    recommendations: result.recommendations,
    total_items: menuItems.length,
    avg_margin: result.avg_margin,
    high_margin_count: result.high_margin_count,
    low_margin_count: result.low_margin_count,
  }).select().single()

  return NextResponse.json({ ...saved, recommendations: result.recommendations })
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
