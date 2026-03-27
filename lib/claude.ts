import { MenuItem, Recommendation } from './supabase'

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
  const margins = menuItems.map((item) => ({
    item,
    margin: item.selling_price > 0
      ? ((item.selling_price - item.cost_price) / item.selling_price) * 100
      : 0,
  }))

  const avg_margin =
    margins.reduce((sum, m) => sum + m.margin, 0) / margins.length
  const high_margin_count = margins.filter((m) => m.margin >= 70).length
  const low_margin_count = margins.filter((m) => m.margin < 50).length

  const recommendations: Recommendation[] = margins
    .filter((m) => m.margin < 65)
    .sort((a, b) => a.margin - b.margin)
    .slice(0, 8)
    .map(({ item, margin }) => {
      const target_margin = 70
      const suggested_price =
        Math.ceil((item.cost_price / (1 - target_margin / 100)) * 100) / 100

      let reasoning = ''
      if (margin < 30) {
        reasoning = `Critically low margin of ${margin.toFixed(0)}%. At $${item.selling_price}, you're barely covering costs. Raise to $${suggested_price} to hit a healthy 70% margin.`
      } else if (margin < 50) {
        reasoning = `Below-average margin of ${margin.toFixed(0)}%. Industry standard for ${cuisineType} is 65–75%. A $${(suggested_price - item.selling_price).toFixed(2)} price increase would significantly boost profit.`
      } else {
        reasoning = `Margin of ${margin.toFixed(0)}% is slightly under the 70% target. A modest price increase to $${suggested_price} would improve profitability without impacting demand.`
      }

      return {
        item_name: item.name,
        current_price: item.selling_price,
        suggested_price,
        current_margin: Math.round(margin * 10) / 10,
        suggested_margin: target_margin,
        reasoning,
        priority: margin < 40 ? 'high' : margin < 55 ? 'medium' : 'low',
      }
    })

  const lowItems = margins.filter((m) => m.margin < 50).map((m) => m.item.name)
  const highItems = margins.filter((m) => m.margin >= 70).map((m) => m.item.name)

  let summary = `${restaurantName} has an average margin of ${avg_margin.toFixed(1)}% across ${menuItems.length} items. `
  if (low_margin_count > 0) {
    summary += `${low_margin_count} item${low_margin_count > 1 ? 's' : ''} (${lowItems.slice(0, 2).join(', ')}${lowItems.length > 2 ? '...' : ''}) are below the 50% threshold and need immediate repricing. `
  }
  if (high_margin_count > 0) {
    summary += `${high_margin_count} item${high_margin_count > 1 ? 's are' : ' is'} performing well above 70% margin.`
  }
  if (low_margin_count === 0 && high_margin_count === menuItems.length) {
    summary = `Excellent! ${restaurantName} has strong margins across all ${menuItems.length} items with an average of ${avg_margin.toFixed(1)}%. Focus on volume and marketing high-margin items.`
  }

  return {
    summary,
    recommendations,
    avg_margin: Math.round(avg_margin * 10) / 10,
    high_margin_count,
    low_margin_count,
  }
}
