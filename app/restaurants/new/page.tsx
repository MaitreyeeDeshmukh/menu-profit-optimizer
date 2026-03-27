"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChefHat, ArrowLeft } from "lucide-react";

const CUISINE_TYPES = [
  "American", "Italian", "Mexican", "Chinese", "Japanese", "Indian",
  "Mediterranean", "Thai", "French", "Greek", "BBQ", "Seafood",
  "Pizza", "Burgers", "Cafe/Coffee", "Bakery", "Other",
];

export default function NewRestaurantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    cuisine_type: "American",
    location: "",
    description: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/restaurants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to create restaurant");
      setLoading(false);
      return;
    }

    router.push(`/restaurants/${data.id}/menu`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <div className="flex items-center gap-2">
          <ChefHat className="w-6 h-6 text-orange-500" />
          <span className="font-bold text-gray-900">Menu Profit Optimizer</span>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
            <ChefHat className="w-7 h-7 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Add a Restaurant</h1>
          <p className="text-gray-500 mb-8">
            Enter your restaurant details to get started with menu analysis.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Restaurant Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. The Golden Spoon"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Cuisine Type
              </label>
              <select
                value={form.cuisine_type}
                onChange={(e) => setForm({ ...form, cuisine_type: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                {CUISINE_TYPES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Austin, TX"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description (optional)
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of your restaurant..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Restaurant & Add Menu"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
