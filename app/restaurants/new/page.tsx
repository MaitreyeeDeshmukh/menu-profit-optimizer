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
    <div className="min-h-screen" style={{ background: "#FFFDF5", fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Nav */}
      <nav
        className="px-6 py-3 flex items-center gap-4 border-b-4 border-black"
        style={{ background: "#FFFDF5" }}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-black uppercase tracking-wide text-sm text-black border-4 border-black px-3 py-2 transition-all duration-100 hover:bg-black hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={3} />
          Back
        </Link>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-8 h-8 border-4 border-black"
            style={{ background: "#FFD93D", boxShadow: "3px 3px 0px 0px #000" }}
          >
            <ChefHat className="w-4 h-4 text-black" strokeWidth={3} />
          </div>
          <span className="font-black uppercase tracking-tight text-black">Menu Profit Optimizer</span>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-12">
        {/* Decorative offset box */}
        <div className="relative">
          <div
            className="absolute inset-0 border-4 border-black"
            style={{ background: "#FFD93D", transform: "translate(8px, 8px)" }}
          />
          <div
            className="relative border-4 border-black p-8"
            style={{ background: "#fff", boxShadow: "8px 8px 0px 0px #000" }}
          >
            <div
              className="w-14 h-14 border-4 border-black flex items-center justify-center mb-6"
              style={{ background: "#FF6B6B", boxShadow: "4px 4px 0px 0px #000" }}
            >
              <ChefHat className="w-7 h-7 text-black" strokeWidth={3} />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-black mb-2">Add a Restaurant</h1>
            <p className="font-semibold text-black mb-8">
              Enter your restaurant details to get started with menu analysis.
            </p>

            {error && (
              <div
                className="border-4 border-black px-4 py-3 mb-6 font-bold text-black"
                style={{ background: "#FF6B6B", boxShadow: "4px 4px 0px 0px #000" }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-black uppercase tracking-wide text-black mb-2">
                  Restaurant Name <span style={{ color: "#FF6B6B" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. The Golden Spoon"
                  className="w-full px-4 h-14 border-4 border-black text-black font-semibold placeholder-gray-400 transition-all duration-100"
                  style={{ background: "#FFFDF5" }}
                />
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-wide text-black mb-2">
                  Cuisine Type
                </label>
                <select
                  value={form.cuisine_type}
                  onChange={(e) => setForm({ ...form, cuisine_type: e.target.value })}
                  className="w-full px-4 h-14 border-4 border-black text-black font-semibold transition-all duration-100 appearance-none"
                  style={{ background: "#FFFDF5" }}
                >
                  {CUISINE_TYPES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-wide text-black mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Austin, TX"
                  className="w-full px-4 h-14 border-4 border-black text-black font-semibold placeholder-gray-400 transition-all duration-100"
                  style={{ background: "#FFFDF5" }}
                />
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-wide text-black mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of your restaurant..."
                  rows={3}
                  className="w-full px-4 py-3 border-4 border-black text-black font-semibold placeholder-gray-400 transition-all duration-100 resize-none"
                  style={{ background: "#FFFDF5" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-push w-full py-4 border-4 border-black font-black uppercase tracking-wider text-black text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "#FF6B6B", boxShadow: "6px 6px 0px 0px #000" }}
              >
                {loading ? "Creating..." : "Create Restaurant & Add Menu"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
