import Anthropic from '@anthropic-ai/sdk'
import { MenuItem, Recommendation } from './supabase'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function analyzeMenuProfitability(
  restaurantName: string,
  cuisineType: string,
  menuItems: MenuItem[]
): Promise<{
  summary: string
  recommendations: Recommendation[]
  avg_margin: number
  high_margin_count: number
  low_margin_count: number
}> {
  const menuData = menuItems.map((item) => ({
    name: item.name,
    category: item.category,
    cost: item.cost_price,
    price: item.selling_price,
    margin: (((item.selling_price - item.cost_price) / item.selling_price) * 100).toFixed(1),
    is_popular: item.is_popular,
  }))

  const prompt = `You are an expert restaurant consultant specializing in menu profitability optimization.

Restaurant: ${restaurantName}
Cuisine: ${cuisineType}

Menu Items:
${JSON.stringify(menuData, null, 2)}

Analyze this menu for profitability and provide actionable recommendations. Return a JSON object with exactly this structure:
{
  "summary": "2-3 sentence executive summary of the menu's profitability health",
  "recommendations": [
    {
      "item_name": "exact item name",
      "current_price": number,
      "suggested_price": number,
      "current_margin": number (percentage 0-100),
      "suggested_margin": number (percentage 0-100),
      "reasoning": "specific actionable reasoning for the price change",
      "priority": "high" | "medium" | "low"
    }
  ],
  "insights": {
    "stars": ["items with high margin and high popularity"],
    "plowhorses": ["items with low margin but high popularity"],
    "puzzles": ["items with high margin but low popularity"],
    "dogs": ["items with low margin and low popularity"]
  },
  "quick_wins": ["3-5 immediate actions to improve profitability"]
}

Focus on:
1. Items priced below market rate for ${cuisineType} cuisine
2. Low margin items (< 60% margin) that should be repriced
3. Popular items that can bear price increases
4. Bundle opportunities
5. Items to consider removing

Return ONLY valid JSON, no markdown.`

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

  let parsed
  try {
    parsed = JSON.parse(responseText)
  } catch {
    parsed = {
      summary: 'Analysis completed. Review recommendations below.',
      recommendations: [],
      insights: { stars: [], plowhorses: [], puzzles: [], dogs: [] },
      quick_wins: [],
    }
  }

  const margins = menuItems.map(
    (item) => ((item.selling_price - item.cost_price) / item.selling_price) * 100
  )
  const avg_margin = margins.length > 0 ? margins.reduce((a, b) => a + b, 0) / margins.length : 0
  const high_margin_count = margins.filter((m) => m >= 70).length
  const low_margin_count = margins.filter((m) => m < 50).length

  return {
    summary: parsed.summary || '',
    recommendations: parsed.recommendations || [],
    avg_margin: Math.round(avg_margin * 10) / 10,
    high_margin_count,
    low_margin_count,
  }
}
