export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function calculateMargin(cost: number, price: number): number {
  if (price === 0) return 0
  return Math.round(((price - cost) / price) * 100 * 10) / 10
}

export function getMarginColor(margin: number): string {
  if (margin >= 70) return 'text-green-600'
  if (margin >= 50) return 'text-yellow-600'
  return 'text-red-600'
}

export function getMarginBg(margin: number): string {
  if (margin >= 70) return 'bg-green-100 text-green-800'
  if (margin >= 50) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

export function getPriorityColor(priority: string): string {
  if (priority === 'high') return 'bg-red-100 text-red-700'
  if (priority === 'medium') return 'bg-yellow-100 text-yellow-700'
  return 'bg-blue-100 text-blue-700'
}
