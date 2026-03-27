"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Restaurant, MenuItem } from "@/lib/supabase";
import { formatCurrency, calculateMargin, getMarginBg } from "@/lib/utils";
import { ArrowLeft, Plus, Trash2, TrendingUp, ChefHat, Upload } from "lucide-react";

const CATEGORIES = ["Appetizer", "Main", "Dessert", "Beverage", "Side", "Special", "Other"];

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
    const lines = csvText.trim().split("\n").slice(1); // skip header
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-orange-500" />
            <span className="font-semibold text-gray-900">{restaurant?.name}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Menu</span>
          </div>
        </div>
        {items.length > 0 && (
          <Link
            href={`/restaurants/${id}`}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            Analyze with AI
          </Link>
        )}
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
            <p className="text-gray-500 mt-1">{items.length} items · {restaurant?.cuisine_type}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setShowCsv(!showCsv); setShowForm(false); }}
              className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Import CSV
            </button>
            <button
              onClick={() => { setShowForm(!showForm); setShowCsv(false); }}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
        </div>

        {/* CSV Import */}
        {showCsv && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Import from CSV</h3>
            <p className="text-sm text-gray-500 mb-4">
              Format: <code className="bg-gray-100 px-1 rounded">name, category, cost_price, selling_price, description</code>
            </p>
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="name,category,cost_price,selling_price,description&#10;Burger,Main,4.50,14.99,Classic beef burger&#10;Fries,Side,1.00,4.99,Crispy golden fries"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-mono text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={importCsv} disabled={saving || !csvText.trim()} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50">
                {saving ? "Importing..." : "Import"}
              </button>
              <button onClick={() => setShowCsv(false)} className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Add Item Form */}
        {showForm && (
          <form onSubmit={addItem} className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Add Menu Item</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Classic Burger" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input type="checkbox" id="popular" checked={form.is_popular} onChange={(e) => setForm({ ...form, is_popular: e.target.checked })} className="accent-orange-500" />
                <label htmlFor="popular" className="text-sm text-gray-700">Popular item</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price ($)</label>
                <input type="number" step="0.01" min="0" required value={form.cost_price} onChange={(e) => setForm({ ...form, cost_price: e.target.value })} placeholder="4.50" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price ($)</label>
                <input type="number" step="0.01" min="0" required value={form.selling_price} onChange={(e) => setForm({ ...form, selling_price: e.target.value })} placeholder="14.99" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              {form.cost_price && form.selling_price && (
                <div className="col-span-2">
                  <span className="text-sm text-gray-500">Margin: </span>
                  <span className={`text-sm font-semibold ${calculateMargin(parseFloat(form.cost_price), parseFloat(form.selling_price)) >= 70 ? "text-green-600" : calculateMargin(parseFloat(form.cost_price), parseFloat(form.selling_price)) >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                    {calculateMargin(parseFloat(form.cost_price), parseFloat(form.selling_price))}%
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-4">
              <button type="submit" disabled={saving} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50">
                {saving ? "Saving..." : "Add Item"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Menu Items */}
        {items.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-400 mb-4">No menu items yet</p>
            <button onClick={() => setShowForm(true)} className="text-orange-500 font-medium text-sm hover:underline">
              Add your first item
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([category, catItems]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{category}</h3>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Item</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Cost</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Margin</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {catItems.map((item) => {
                        const margin = calculateMargin(item.cost_price, item.selling_price);
                        return (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                              {item.is_popular && <span className="text-xs text-orange-500">Popular</span>}
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-600">{formatCurrency(item.cost_price)}</td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">{formatCurrency(item.selling_price)}</td>
                            <td className="px-4 py-3 text-right">
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getMarginBg(margin)}`}>{margin}%</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={() => deleteItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
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

            <div className="flex justify-end">
              <button
                onClick={() => router.push(`/restaurants/${id}`)}
                className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                <TrendingUp className="w-5 h-5" />
                Analyze This Menu with AI
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
