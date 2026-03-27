"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Restaurant } from "@/lib/supabase";
import { ChefHat, Plus, TrendingUp, Trash2, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  async function loadDemo() {
    setSeeding(true);
    const res = await fetch("/api/seed", { method: "POST" });
    const data = await res.json();
    if (data.success) {
      const updated = await fetch("/api/restaurants").then(r => r.json());
      setRestaurants(Array.isArray(updated) ? updated : []);
    }
    setSeeding(false);
  }

  useEffect(() => {
    fetch("/api/restaurants")
      .then((r) => r.json())
      .then((data) => {
        setRestaurants(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function deleteRestaurant(id: string) {
    if (!confirm("Delete this restaurant and all its data?")) return;
    await fetch(`/api/restaurants/${id}`, { method: "DELETE" });
    setRestaurants((prev) => prev.filter((r) => r.id !== id));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading your restaurants...</p>
        </div>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
          <ChefHat className="w-10 h-10 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">No restaurants yet</h2>
        <p className="text-gray-500 mb-8 max-w-sm">
          Add your first restaurant to start analyzing menu profitability with AI.
        </p>
        <Link
          href="/restaurants/new"
          className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Your First Restaurant
        </Link>
        <button
          onClick={loadDemo}
          disabled={seeding}
          className="flex items-center gap-2 border-2 border-orange-400 text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors disabled:opacity-50"
        >
          {seeding ? "Loading..." : "✨ Load Demo Restaurant"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Restaurants</h1>
          <p className="text-gray-500 mt-1">{restaurants.length} restaurant{restaurants.length !== 1 ? "s" : ""} total</p>
        </div>
        <button
          onClick={loadDemo}
          disabled={seeding}
          className="flex items-center gap-2 border border-orange-400 text-orange-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors disabled:opacity-50"
        >
          {seeding ? "Loading..." : "✨ Load Demo"}
        </button>
        <Link
          href="/restaurants/new"
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Restaurant
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-orange-500" />
              </div>
              <button
                onClick={() => deleteRestaurant(restaurant.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{restaurant.name}</h3>
            <p className="text-sm text-gray-500 mb-1">{restaurant.cuisine_type}</p>
            {restaurant.location && (
              <p className="text-sm text-gray-400 mb-4">{restaurant.location}</p>
            )}
            <div className="flex gap-2">
              <Link
                href={`/restaurants/${restaurant.id}/menu`}
                className="flex-1 text-center bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Manage Menu
              </Link>
              <Link
                href={`/restaurants/${restaurant.id}`}
                className="flex items-center gap-1 bg-orange-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                Analyze
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
