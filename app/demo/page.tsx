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
  const bg = margin >= 70 ? "#22c55e" : margin >= 60 ? "#FFD93D" : "#FF6B6B";
  return (
    <span
      className="text-xs font-black uppercase tracking-wide px-2 py-0.5 border-2 border-black"
      style={{ background: bg }}
    >
      {margin.toFixed(1)}%
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const bg = priority === "high" ? "#FF6B6B" : priority === "medium" ? "#FFD93D" : "#C4B5FD";
  return (
    <span
      className="text-xs font-black uppercase tracking-widest px-2 py-0.5 border-2 border-black"
      style={{ background: bg }}
    >
      {priority} priority
    </span>
  );
}

export default function DemoPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FFFDF5", fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Nav */}
      <nav
        className="px-6 py-3 flex items-center justify-between border-b-4 border-black"
        style={{ background: "#FFFDF5" }}
      >
        <Link href="/" className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-9 h-9 border-4 border-black"
            style={{ background: "#FFD93D", boxShadow: "3px 3px 0px 0px #000" }}
          >
            <ChefHat className="w-4 h-4 text-black" strokeWidth={3} />
          </div>
          <span className="font-black uppercase tracking-tight text-black">Menu Profit Optimizer</span>
        </Link>
        <div className="flex items-center gap-3">
          <span
            className="text-sm font-black uppercase tracking-widest px-3 py-1 border-4 border-black text-black"
            style={{ background: "#C4B5FD", boxShadow: "3px 3px 0px 0px #000" }}
          >
            Live Demo
          </span>
          <Link
            href="/sign-up"
            className="btn-push flex items-center gap-2 px-4 py-2 border-4 border-black text-sm font-black uppercase tracking-wide text-black"
            style={{ background: "#FF6B6B", boxShadow: "4px 4px 0px 0px #000" }}
          >
            Try With Your Menu <ArrowRight className="w-4 h-4" strokeWidth={3} />
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Demo banner */}
        <div
          className="border-4 border-black px-5 py-3 mb-8 flex items-center justify-between flex-wrap gap-3"
          style={{ background: "#FFD93D", boxShadow: "6px 6px 0px 0px #000" }}
        >
          <div className="flex items-center gap-2 font-bold text-black text-sm">
            <Zap className="w-4 h-4" strokeWidth={3} />
            <strong className="uppercase tracking-wide">Demo Mode</strong> — This is a real analysis of a sample restaurant. Sign up to analyze your own menu.
          </div>
          <Link
            href="/sign-up"
            className="font-black uppercase tracking-wide text-sm text-black border-b-2 border-black"
          >
            Get Started Free →
          </Link>
        </div>

        {/* Restaurant header */}
        <div
          className="border-4 border-black p-6 mb-6 bg-white"
          style={{ boxShadow: "8px 8px 0px 0px #000" }}
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 border-4 border-black flex items-center justify-center"
                style={{ background: "#FFD93D", boxShadow: "4px 4px 0px 0px #000" }}
              >
                <ChefHat className="w-6 h-6 text-black" strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-black">{DEMO_RESTAURANT.name}</h1>
                <p className="font-bold text-black text-sm uppercase tracking-wide">{DEMO_RESTAURANT.cuisine} · {DEMO_RESTAURANT.location}</p>
              </div>
            </div>
            <div
              className="flex items-center gap-1 px-3 py-1.5 border-4 border-black font-black uppercase tracking-wide text-sm text-black"
              style={{ background: "#C4B5FD", boxShadow: "4px 4px 0px 0px #000" }}
            >
              <Zap className="w-4 h-4" strokeWidth={3} /> AI Analysis Complete
            </div>
          </div>
          <div
            className="mt-4 p-4 border-4 border-black"
            style={{ background: "#FFFDF5", borderLeftColor: "#C4B5FD", borderLeftWidth: "8px" }}
          >
            <p className="font-semibold text-black leading-relaxed">{DEMO_RESTAURANT.summary}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Items", value: DEMO_RESTAURANT.total_items, icon: <BarChart3 className="w-6 h-6 text-black" strokeWidth={3} />, bg: "#FFD93D" },
            { label: "Avg Margin", value: `${DEMO_RESTAURANT.avg_margin}%`, icon: <TrendingUp className="w-6 h-6 text-black" strokeWidth={3} />, bg: "#FF6B6B" },
            { label: "High Margin (≥70%)", value: DEMO_RESTAURANT.high_margin_count, icon: <CheckCircle2 className="w-6 h-6 text-black" strokeWidth={3} />, bg: "#C4B5FD" },
            { label: "Need Repricing", value: DEMO_RESTAURANT.low_margin_count, icon: <AlertTriangle className="w-6 h-6 text-black" strokeWidth={3} />, bg: "#FFFDF5" },
          ].map((s) => (
            <div
              key={s.label}
              className="border-4 border-black p-4"
              style={{ background: s.bg, boxShadow: "6px 6px 0px 0px #000" }}
            >
              <div className="mb-2">{s.icon}</div>
              <div className="text-3xl font-black text-black">{s.value}</div>
              <div className="text-xs font-black uppercase tracking-wide text-black mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Revenue opportunity */}
        <div
          className="border-4 border-black p-5 flex items-center gap-4 mb-6"
          style={{ background: "#FFD93D", boxShadow: "6px 6px 0px 0px #000" }}
        >
          <div
            className="w-14 h-14 border-4 border-black flex items-center justify-center flex-shrink-0"
            style={{ background: "#fff", boxShadow: "3px 3px 0px 0px #000" }}
          >
            <DollarSign className="w-7 h-7 text-black" strokeWidth={3} />
          </div>
          <div>
            <div className="font-black text-black text-xl uppercase tracking-tight">
              +$187.50 potential revenue increase per order cycle
            </div>
            <div className="font-bold text-black text-sm uppercase tracking-wide mt-1">
              Based on implementing all {RECOMMENDATIONS.length} price recommendations
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <h2 className="text-2xl font-black uppercase tracking-tight text-black mb-4">AI Price Recommendations</h2>
          <div className="space-y-4">
            {RECOMMENDATIONS.map((rec, i) => {
              const priorityBg = rec.priority === "high" ? "#FF6B6B" : rec.priority === "medium" ? "#FFD93D" : "#C4B5FD";
              return (
                <div
                  key={i}
                  className="bg-white border-4 border-black p-5 relative"
                  style={{ boxShadow: "8px 8px 0px 0px #000" }}
                >
                  <div
                    className="absolute -top-3 -right-3 px-3 py-1 border-4 border-black font-black uppercase tracking-wider text-xs text-black"
                    style={{ background: priorityBg, transform: "rotate(2deg)", boxShadow: "3px 3px 0px 0px #000" }}
                  >
                    {rec.priority} priority
                  </div>
                  <div className="flex items-start justify-between mb-3 flex-wrap gap-4 pr-16">
                    <div>
                      <h4 className="font-black text-black text-lg uppercase tracking-tight">{rec.name}</h4>
                      <PriorityBadge priority={rec.priority} />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-xs font-black uppercase tracking-wide text-black">Current</div>
                        <div
                          className="text-xl font-black text-black line-through px-2 py-1 border-2 border-black"
                          style={{ background: "#f0f0f0" }}
                        >
                          ${rec.current}
                        </div>
                      </div>
                      <div className="text-2xl font-black text-black">→</div>
                      <div className="text-center">
                        <div className="text-xs font-black uppercase tracking-wide text-black">Suggested</div>
                        <div
                          className="text-xl font-black px-2 py-1 border-2 border-black"
                          style={{ background: "#22c55e", color: "#fff" }}
                        >
                          ${rec.suggested}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="font-semibold text-black leading-relaxed text-sm">{rec.reasoning}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full menu table */}
        <div className="mb-8">
          <h2 className="text-2xl font-black uppercase tracking-tight text-black mb-4">Full Menu Analysis</h2>
          <div
            className="border-4 border-black overflow-hidden"
            style={{ boxShadow: "8px 8px 0px 0px #000" }}
          >
            <table className="w-full">
              <thead
                className="border-b-4 border-black"
                style={{ background: "#000" }}
              >
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-wider text-white">Item</th>
                  <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-wider text-white">Category</th>
                  <th className="text-right px-4 py-3 text-xs font-black uppercase tracking-wider text-white">Cost</th>
                  <th className="text-right px-4 py-3 text-xs font-black uppercase tracking-wider text-white">Price</th>
                  <th className="text-right px-4 py-3 text-xs font-black uppercase tracking-wider text-white">Margin</th>
                </tr>
              </thead>
              <tbody>
                {[...MENU_ITEMS].sort((a, b) => a.margin - b.margin).map((item, idx) => (
                  <tr
                    key={item.name}
                    className="border-b-2 border-black last:border-b-0"
                    style={{ background: idx % 2 === 0 ? "#FFFDF5" : "#fff" }}
                  >
                    <td className="px-4 py-3">
                      <div className="font-bold text-black text-sm">{item.name}</div>
                      {item.popular && (
                        <span
                          className="text-xs font-black uppercase tracking-wide px-2 py-0.5 border-2 border-black"
                          style={{ background: "#FFD93D" }}
                        >
                          Popular
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-black">{item.category}</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-black">${item.cost.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-sm font-black text-black">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right"><MarginBadge margin={item.margin} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div
          className="border-4 border-black p-10 text-center"
          style={{ background: "#000" }}
        >
          <h2 className="text-3xl font-black uppercase tracking-tight mb-2" style={{ color: "#FFFDF5" }}>
            Analyze Your Restaurant&apos;s Menu
          </h2>
          <p className="font-semibold mb-8" style={{ color: "#FFD93D" }}>
            Get AI-powered profit recommendations in under 2 minutes. Free to start.
          </p>
          <Link
            href="/sign-up"
            className="btn-push inline-flex items-center gap-2 px-8 py-4 border-4 border-white font-black uppercase tracking-wider text-black"
            style={{ background: "#FFD93D", boxShadow: "6px 6px 0px 0px #fff" }}
          >
            Start Free Today <ArrowRight className="w-5 h-5" strokeWidth={3} />
          </Link>
        </div>
      </div>
    </div>
  );
}
