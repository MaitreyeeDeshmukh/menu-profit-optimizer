"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Restaurant, MenuItem } from "@/lib/supabase";
import { formatCurrency, calculateMargin } from "@/lib/utils";
import { ArrowLeft, Plus, Trash2, TrendingUp, ChefHat, Upload } from "lucide-react";

const CATEGORIES = ["Appetizer", "Main", "Dessert", "Beverage", "Side", "Special", "Other"];

function MarginBadge({ margin }: { margin: number }) {
  const bg = margin >= 70 ? "#22c55e" : margin >= 50 ? "#FFD93D" : "#FF6B6B";
  return (
    <span
      className="text-xs font-black uppercase tracking-wide px-2 py-1 border-2 border-black"
      style={{ background: bg }}
    >
      {margin}%
    </span>
  );
}

export default function MenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [showCsv, setShowCsv] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", category: "Main", cost_price: "", selling_price: "", description: "", is_popular: false,
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/restaurants/${id}`).then((r) => r.json()),
      fetch(`/api/restaurants/${id}/menu-items`).then((r) => r.json()),
    ]).then(([rest, menuItems]) => {
      setRestaurant(rest);
      setItems(Array.isArray(menuItems) ? menuItems : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/restaurants/${id}/menu-items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        cost_price: parseFloat(form.cost_price) || 0,
        selling_price: parseFloat(form.selling_price) || 0,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setItems((prev) => [...prev, data]);
      setForm({ name: "", category: "Main", cost_price: "", selling_price: "", description: "", is_popular: false });
      setShowForm(false);
    }
    setSaving(false);
  }

  async function deleteItem(itemId: string) {
    await fetch(`/api/restaurants/${id}/menu-items?itemId=${itemId}`, { method: "DELETE" });
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }

  async function importCsv() {
    setSaving(true);
    const lines = csvText.trim().split("\n").slice(1);
    const parsed = lines.map((line) => {
      const [name, category, cost_price, selling_price, description] = line.split(",").map((s) => s.trim().replace(/^"|"$/g, ""));
      return { name, category: category || "Main", cost_price: parseFloat(cost_price) || 0, selling_price: parseFloat(selling_price) || 0, description: description || "" };
    }).filter((item) => item.name);

    await fetch(`/api/restaurants/${id}/menu-items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    });
    const updated = await fetch(`/api/restaurants/${id}/menu-items`).then((r) => r.json());
    setItems(Array.isArray(updated) ? updated : []);
    setCsvText("");
    setShowCsv(false);
    setSaving(false);
  }

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const catItems = items.filter((item) => item.category === cat);
    if (catItems.length > 0) acc[cat] = catItems;
    return acc;
  }, {} as Record<string, MenuItem[]>);
  const uncategorized = items.filter((item) => !CATEGORIES.includes(item.category));
  if (uncategorized.length > 0) grouped["Other"] = [...(grouped["Other"] || []), ...uncategorized];

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FFFDF5" }}
      >
        <div
          className="w-10 h-10 border-4 border-black animate-spin"
          style={{ borderTopColor: "#FF6B6B" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#FFFDF5", fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Nav */}
      <nav
        className="px-6 py-3 flex items-center justify-between border-b-4 border-black"
        style={{ background: "#FFFDF5" }}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-black uppercase tracking-wide text-sm text-black border-4 border-black px-3 py-2 transition-all duration-100 hover:bg-black hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={3} />
            Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-black" strokeWidth={3} />
            <span className="font-black text-black">{restaurant?.name}</span>
            <span className="font-black text-black">/</span>
            <span className="font-bold text-black uppercase tracking-wide text-sm">Menu</span>
          </div>
        </div>
        {items.length > 0 && (
          <Link
            href={`/restaurants/${id}`}
            className="btn-push flex items-center gap-2 px-4 py-2 border-4 border-black text-sm font-black uppercase tracking-wide text-black"
            style={{ background: "#FF6B6B", boxShadow: "4px 4px 0px 0px #000" }}
          >
            <TrendingUp className="w-4 h-4" strokeWidth={3} />
            Analyze with AI
          </Link>
        )}
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-black">Menu Items</h1>
            <p className="font-bold text-black mt-1 uppercase tracking-wide text-sm">
              {items.length} items &middot; {restaurant?.cuisine_type}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setShowCsv(!showCsv); setShowForm(false); }}
              className="btn-push flex items-center gap-2 px-4 py-2 border-4 border-black text-sm font-black uppercase tracking-wide text-black"
              style={{ background: "#C4B5FD", boxShadow: "4px 4px 0px 0px #000" }}
            >
              <Upload className="w-4 h-4" strokeWidth={3} />
              Import CSV
            </button>
            <button
              onClick={() => { setShowForm(!showForm); setShowCsv(false); }}
              className="btn-push flex items-center gap-2 px-4 py-2 border-4 border-black text-sm font-black uppercase tracking-wide text-black"
              style={{ background: "#FFD93D", boxShadow: "4px 4px 0px 0px #000" }}
            >
              <Plus className="w-4 h-4" strokeWidth={3} />
              Add Item
            </button>
          </div>
        </div>

        {/* CSV Import */}
        {showCsv && (
          <div
            className="border-4 border-black mb-6"
            style={{ boxShadow: "6px 6px 0px 0px #000" }}
          >
            <div
              className="px-5 py-3 border-b-4 border-black"
              style={{ background: "#C4B5FD" }}
            >
              <h3 className="font-black uppercase tracking-wide text-black">Import from CSV</h3>
            </div>
            <div className="p-6 bg-white">
              <p className="text-sm font-semibold text-black mb-4">
                Format:{" "}
                <code
                  className="px-2 py-0.5 border-2 border-black font-mono text-xs"
                  style={{ background: "#FFD93D" }}
                >
                  name, category, cost_price, selling_price, description
                </code>
              </p>
              <textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder={"name,category,cost_price,selling_price,description\nBurger,Main,4.50,14.99,Classic beef burger\nFries,Side,1.00,4.99,Crispy golden fries"}
                rows={6}
                className="w-full px-4 py-3 border-4 border-black text-sm font-mono text-black placeholder-gray-400 transition-all duration-100 resize-none mb-4"
                style={{ background: "#FFFDF5" }}
              />
              <div className="flex gap-3">
                <button
                  onClick={importCsv}
                  disabled={saving || !csvText.trim()}
                  className="btn-push px-4 py-2 border-4 border-black text-sm font-black uppercase tracking-wide text-black disabled:opacity-50"
                  style={{ background: "#FF6B6B", boxShadow: "4px 4px 0px 0px #000" }}
                >
                  {saving ? "Importing..." : "Import"}
                </button>
                <button
                  onClick={() => setShowCsv(false)}
                  className="btn-push px-4 py-2 border-4 border-black text-sm font-black uppercase tracking-wide text-black"
                  style={{ background: "#FFFDF5", boxShadow: "4px 4px 0px 0px #000" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Item Form */}
        {showForm && (
          <form
            onSubmit={addItem}
            className="border-4 border-black mb-6"
            style={{ boxShadow: "6px 6px 0px 0px #000" }}
          >
            <div
              className="px-5 py-3 border-b-4 border-black"
              style={{ background: "#FFD93D" }}
            >
              <h3 className="font-black uppercase tracking-wide text-black">Add Menu Item</h3>
            </div>
            <div className="p-6 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-black uppercase tracking-wide text-black mb-1">Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Classic Burger"
                    className="w-full px-3 py-2 border-4 border-black text-sm font-semibold text-black transition-all duration-100"
                    style={{ background: "#FFFDF5" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wide text-black mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border-4 border-black text-sm font-semibold text-black transition-all duration-100 appearance-none"
                    style={{ background: "#FFFDF5" }}
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="popular"
                    checked={form.is_popular}
                    onChange={(e) => setForm({ ...form, is_popular: e.target.checked })}
                    className="w-5 h-5 border-2 border-black accent-black"
                  />
                  <label htmlFor="popular" className="text-sm font-bold text-black uppercase tracking-wide">Popular item</label>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wide text-black mb-1">Cost Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={form.cost_price}
                    onChange={(e) => setForm({ ...form, cost_price: e.target.value })}
                    placeholder="4.50"
                    className="w-full px-3 py-2 border-4 border-black text-sm font-semibold text-black transition-all duration-100"
                    style={{ background: "#FFFDF5" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wide text-black mb-1">Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={form.selling_price}
                    onChange={(e) => setForm({ ...form, selling_price: e.target.value })}
                    placeholder="14.99"
                    className="w-full px-3 py-2 border-4 border-black text-sm font-semibold text-black transition-all duration-100"
                    style={{ background: "#FFFDF5" }}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-black uppercase tracking-wide text-black mb-1">Description</label>
                  <input
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief description..."
                    className="w-full px-3 py-2 border-4 border-black text-sm font-semibold text-black transition-all duration-100"
                    style={{ background: "#FFFDF5" }}
                  />
                </div>
                {form.cost_price && form.selling_price && (
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="text-sm font-bold text-black uppercase tracking-wide">Margin:</span>
                    <MarginBadge margin={calculateMargin(parseFloat(form.cost_price), parseFloat(form.selling_price))} />
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-push px-5 py-2 border-4 border-black text-sm font-black uppercase tracking-wide text-black disabled:opacity-50"
                  style={{ background: "#FF6B6B", boxShadow: "4px 4px 0px 0px #000" }}
                >
                  {saving ? "Saving..." : "Add Item"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-push px-5 py-2 border-4 border-black text-sm font-black uppercase tracking-wide text-black"
                  style={{ background: "#FFFDF5", boxShadow: "4px 4px 0px 0px #000" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Menu Items */}
        {items.length === 0 ? (
          <div
            className="border-4 border-black border-dashed p-12 text-center"
            style={{ background: "#fff" }}
          >
            <p className="font-bold uppercase tracking-wide text-black mb-4">No menu items yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-push px-5 py-2 border-4 border-black text-sm font-black uppercase tracking-wide text-black"
              style={{ background: "#FFD93D", boxShadow: "4px 4px 0px 0px #000" }}
            >
              Add your first item
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([category, catItems]) => (
              <div key={category}>
                <h3
                  className="text-xs font-black uppercase tracking-widest text-black mb-3 px-3 py-1 border-2 border-black inline-block"
                  style={{ background: "#FFD93D" }}
                >
                  {category}
                </h3>
                <div
                  className="border-4 border-black overflow-hidden"
                  style={{ boxShadow: "6px 6px 0px 0px #000" }}
                >
                  <table className="w-full">
                    <thead
                      className="border-b-4 border-black"
                      style={{ background: "#000" }}
                    >
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-wider text-white">Item</th>
                        <th className="text-right px-4 py-3 text-xs font-black uppercase tracking-wider text-white">Cost</th>
                        <th className="text-right px-4 py-3 text-xs font-black uppercase tracking-wider text-white">Price</th>
                        <th className="text-right px-4 py-3 text-xs font-black uppercase tracking-wider text-white">Margin</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {catItems.map((item, idx) => {
                        const margin = calculateMargin(item.cost_price, item.selling_price);
                        return (
                          <tr
                            key={item.id}
                            className="border-b-2 border-black last:border-b-0"
                            style={{ background: idx % 2 === 0 ? "#FFFDF5" : "#fff" }}
                          >
                            <td className="px-4 py-3">
                              <div className="font-bold text-black text-sm">{item.name}</div>
                              {item.is_popular && (
                                <span
                                  className="text-xs font-black uppercase tracking-wide px-2 py-0.5 border-2 border-black"
                                  style={{ background: "#FFD93D" }}
                                >
                                  Popular
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-semibold text-black">{formatCurrency(item.cost_price)}</td>
                            <td className="px-4 py-3 text-right text-sm font-black text-black">{formatCurrency(item.selling_price)}</td>
                            <td className="px-4 py-3 text-right">
                              <MarginBadge margin={margin} />
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => deleteItem(item.id)}
                                className="p-1 border-2 border-black bg-white transition-all duration-100 hover:bg-red-500"
                              >
                                <Trash2 className="w-4 h-4 text-black" strokeWidth={3} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => router.push(`/restaurants/${id}`)}
                className="btn-push flex items-center gap-2 px-6 py-3 border-4 border-black font-black uppercase tracking-wider text-black"
                style={{ background: "#FF6B6B", boxShadow: "6px 6px 0px 0px #000" }}
              >
                <TrendingUp className="w-5 h-5" strokeWidth={3} />
                Analyze This Menu with AI
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
