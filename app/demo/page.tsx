import Link from "next/link";
import { ChefHat, TrendingUp, DollarSign, BarChart3, AlertTriangle, CheckCircle2, ArrowRight, Zap } from "lucide-react";

const DEMO_RESTAURANT = {
  name: "The Golden Fork",
  cuisine: "American",
  location: "Austin, TX",
  avg_margin: 61.4,
  total_items: 14,
  high_margin_count: 5,
  low_margin_count: 3,
  summary: "The Golden Fork has an average margin of 61.4% across 14 items. 3 items including Fish & Chips, Mushroom Swiss Burger, and BBQ Bacon Burger are below the 50% threshold and need immediate repricing. 5 items are performing well above 70% margin.",
  potential_gain: 187.50,
}

const MENU_ITEMS = [
  { name: "Classic Cheeseburger", category: "Main", cost: 4.50, price: 13.99, margin: 67.8, popular: true },
  { name: "BBQ Bacon Burger", category: "Main", cost: 5.80, price: 15.99, margin: 63.7, popular: true },
  { name: "Grilled Chicken Sandwich", category: "Main", cost: 4.20, price: 12.99, margin: 67.7, popular: false },
  { name: "Caesar Salad", category: "Appetizer", cost: 2.10, price: 9.99, margin: 79.0, popular: false },
  { name: "Loaded Nachos", category: "Appetizer", cost: 3.50, price: 11.99, margin: 70.8, popular: true },
  { name: "Crispy French Fries", category: "Side", cost: 0.80, price: 4.99, margin: 84.0, popular: true },
  { name: "Onion Rings", category: "Side", cost: 1.20, price: 5.49, margin: 78.1, popular: false },
  { name: "Chocolate Lava Cake", category: "Dessert", cost: 2.80, price: 7.99, margin: 65.0, popular: true },
  { name: "New York Cheesecake", category: "Dessert", cost: 2.20, price: 6.99, margin: 68.5, popular: false },
  { name: "Craft Lemonade", category: "Beverage", cost: 0.60, price: 3.99, margin: 85.0, popular: false },
  { name: "Iced Coffee", category: "Beverage", cost: 0.90, price: 4.49, margin: 80.0, popular: true },
  { name: "Mushroom Swiss Burger", category: "Main", cost: 5.20, price: 14.49, margin: 64.1, popular: false },
  { name: "Fish & Chips", category: "Main", cost: 6.50, price: 16.99, margin: 61.7, popular: false },
  { name: "Soup of the Day", category: "Appetizer", cost: 2.50, price: 6.99, margin: 64.2, popular: false },
]

const RECOMMENDATIONS = [
  { name: "Fish & Chips", current: 16.99, suggested: 21.67, current_margin: 61.7, suggested_margin: 70, priority: "high", reasoning: "Food cost of $6.50 is high relative to price. Raising to $21.67 achieves 70% margin, still competitive for a full fish & chips plate in Austin." },
  { name: "Mushroom Swiss Burger", current: 14.49, suggested: 17.33, current_margin: 64.1, suggested_margin: 70, priority: "medium", reasoning: "Premium mushroom topping justifies a higher price point. $17.33 aligns with comparable gourmet burgers and improves margin by 6 points." },
  { name: "BBQ Bacon Burger", current: 15.99, suggested: 19.33, current_margin: 63.7, suggested_margin: 70, priority: "medium", reasoning: "Bacon adds significant cost. At $19.33 you hit 70% margin — customers already paying premium for this popular item will accept a modest increase." },
  { name: "Chocolate Lava Cake", current: 7.99, suggested: 9.33, current_margin: 65.0, suggested_margin: 70, priority: "low", reasoning: "Desserts typically carry 75%+ margins. A $1.34 increase is easily justifiable for a signature dessert and adds directly to bottom line." },
]

function MarginBadge({ margin }: { margin: number }) {
  const color = margin >= 70 ? "bg-green-100 text-green-700" : margin >= 60 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>{margin.toFixed(1)}%</span>
}

function PriorityBadge({ priority }: { priority: string }) {
  const color = priority === "high" ? "bg-red-100 text-red-700" : priority === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>{priority} priority</span>
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ChefHat className="w-6 h-6 text-orange-500" />
          <span className="font-bold text-gray-900">Menu Profit Optimizer</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">Live Demo</span>
          <Link href="/sign-up" className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
            Try With Your Menu <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Demo banner */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-3 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-800 text-sm">
            <Zap className="w-4 h-4" />
            <strong>Demo Mode</strong> — This is a real analysis of a sample restaurant. Sign up to analyze your own menu.
          </div>
          <Link href="/sign-up" className="text-orange-600 font-medium text-sm hover:underline">
            Get Started Free →
          </Link>
        </div>

        {/* Restaurant header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{DEMO_RESTAURANT.name}</h1>
                  <p className="text-gray-500 text-sm">{DEMO_RESTAURANT.cuisine} · {DEMO_RESTAURANT.location}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium">
              <Zap className="w-4 h-4" /> AI Analysis Complete
            </div>
          </div>
          <p className="text-gray-700 mt-4 leading-relaxed">{DEMO_RESTAURANT.summary}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Items", value: DEMO_RESTAURANT.total_items, icon: <BarChart3 className="w-5 h-5 text-blue-500" /> },
            { label: "Avg Margin", value: `${DEMO_RESTAURANT.avg_margin}%`, icon: <TrendingUp className="w-5 h-5 text-green-500" /> },
            { label: "High Margin (≥70%)", value: DEMO_RESTAURANT.high_margin_count, icon: <CheckCircle2 className="w-5 h-5 text-green-500" /> },
            { label: "Need Repricing", value: DEMO_RESTAURANT.low_margin_count, icon: <AlertTriangle className="w-5 h-5 text-red-500" /> },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="mb-2">{s.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Revenue opportunity */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div className="font-bold text-green-900 text-lg">+$187.50 potential revenue increase per order cycle</div>
            <div className="text-green-700 text-sm">Based on implementing all {RECOMMENDATIONS.length} price recommendations</div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">AI Price Recommendations</h2>
          <div className="space-y-3">
            {RECOMMENDATIONS.map((rec, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{rec.name}</h4>
                    <PriorityBadge priority={rec.priority} />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Current</div>
                      <div className="text-lg font-bold text-gray-400 line-through">${rec.current}</div>
                    </div>
                    <div className="text-orange-400">→</div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Suggested</div>
                      <div className="text-lg font-bold text-green-600">${rec.suggested}</div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{rec.reasoning}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Full menu table */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Full Menu Analysis</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Cost</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MENU_ITEMS.sort((a, b) => a.margin - b.margin).map((item) => (
                  <tr key={item.name} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                      {item.popular && <span className="text-xs text-orange-500">Popular</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.category}</td>
                    <td className="px-4 py-3 text-right text-sm text-gray-600">${item.cost.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right"><MarginBadge margin={item.margin} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-orange-500 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Analyze Your Restaurant's Menu</h2>
          <p className="text-orange-100 mb-6">Get AI-powered profit recommendations in under 2 minutes. Free to start.</p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors">
            Start Free Today <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
