"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Restaurant } from "@/lib/supabase";
import { ChefHat, Plus, TrendingUp, Trash2, ArrowRight, ArrowDown } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  American: "#FF6B6B",
  Italian: "#FFD93D",
  Mexican: "#C4B5FD",
  Chinese: "#FF6B6B",
  Japanese: "#FFD93D",
  Indian: "#C4B5FD",
  Mediterranean: "#FF6B6B",
  Thai: "#FFD93D",
  French: "#C4B5FD",
  Greek: "#FF6B6B",
  BBQ: "#FFD93D",
  Seafood: "#C4B5FD",
  Pizza: "#FF6B6B",
  Burgers: "#FFD93D",
  "Cafe/Coffee": "#C4B5FD",
  Bakery: "#FF6B6B",
  Other: "#FFD93D",
};

function getCategoryColor(cuisine: string): string {
  return CATEGORY_COLORS[cuisine] || "#FFD93D";
}

export default function DashboardPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  async function loadDemo() {
    setSeeding(true);
    const res = await fetch("/api/seed", { method: "POST" });
    const data = await res.json();
    if (data.success) {
      const updated = await fetch("/api/restaurants").then((r) => r.json());
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
          <div
            className="w-12 h-12 border-4 border-black mx-auto mb-4 animate-spin"
            style={{ borderTopColor: "#FF6B6B" }}
          />
          <p className="font-bold uppercase tracking-wide text-black">Loading your restaurants...</p>
        </div>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div
          className="w-full max-w-md p-10 border-4 border-black mb-8"
          style={{ background: "#FFD93D", boxShadow: "8px 8px 0px 0px #000" }}
        >
          <div
            className="w-20 h-20 border-4 border-black flex items-center justify-center mx-auto mb-6"
            style={{ background: "#FF6B6B", boxShadow: "4px 4px 0px 0px #000" }}
          >
            <ChefHat className="w-10 h-10 text-black" strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-black mb-3">No Restaurants Yet</h2>
          <p className="font-semibold text-black mb-8">
            Add your first restaurant to start analyzing menu profitability with AI.
          </p>
          <div className="animate-bounce-down flex justify-center mb-6">
            <ArrowDown className="w-8 h-8 text-black" strokeWidth={3} />
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/restaurants/new"
              className="btn-push flex items-center justify-center gap-2 py-3 border-4 border-black font-black uppercase tracking-wide text-black"
              style={{ background: "#FF6B6B", boxShadow: "4px 4px 0px 0px #000" }}
            >
              <Plus className="w-5 h-5" strokeWidth={3} />
              Add Your First Restaurant
            </Link>
            <button
              onClick={loadDemo}
              disabled={seeding}
              className="btn-push flex items-center justify-center gap-2 py-3 border-4 border-black font-black uppercase tracking-wide text-black disabled:opacity-50"
              style={{ background: "#C4B5FD", boxShadow: "4px 4px 0px 0px #000" }}
            >
              {seeding ? "Loading Demo..." : "Load Demo Restaurant"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-black">Your Restaurants</h1>
          <p className="font-bold text-black mt-1 uppercase tracking-wide text-sm">
            {restaurants.length} restaurant{restaurants.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={loadDemo}
            disabled={seeding}
            className="btn-push flex items-center gap-2 px-4 py-2 border-4 border-black text-sm font-black uppercase tracking-wide text-black disabled:opacity-50"
            style={{ background: "#C4B5FD", boxShadow: "4px 4px 0px 0px #000" }}
          >
            {seeding ? "Loading..." : "Load Demo"}
          </button>
          <Link
            href="/restaurants/new"
            className="btn-push flex items-center gap-2 px-4 py-2 border-4 border-black text-sm font-black uppercase tracking-wide text-black"
            style={{ background: "#FFD93D", boxShadow: "4px 4px 0px 0px #000" }}
          >
            <Plus className="w-4 h-4" strokeWidth={3} />
            Add Restaurant
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="card-lift bg-white border-4 border-black"
            style={{ boxShadow: "8px 8px 0px 0px #000" }}
          >
            {/* Card header with cuisine color */}
            <div
              className="px-5 py-3 border-b-4 border-black flex items-center justify-between"
              style={{ background: getCategoryColor(restaurant.cuisine_type) }}
            >
              <span
                className="text-xs font-black uppercase tracking-widest text-black px-2 py-1 border-2 border-black"
                style={{ background: "rgba(255,255,255,0.5)" }}
              >
                {restaurant.cuisine_type}
              </span>
              <button
                onClick={() => deleteRestaurant(restaurant.id)}
                className="p-1 border-2 border-black bg-white transition-all duration-100 hover:bg-red-500"
              >
                <Trash2 className="w-4 h-4 text-black" strokeWidth={3} />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-12 h-12 border-4 border-black flex items-center justify-center flex-shrink-0"
                  style={{ background: "#FFD93D", boxShadow: "3px 3px 0px 0px #000" }}
                >
                  <ChefHat className="w-6 h-6 text-black" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-black leading-tight">{restaurant.name}</h3>
                  {restaurant.location && (
                    <p className="text-sm font-semibold text-black mt-0.5">{restaurant.location}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Link
                  href={`/restaurants/${restaurant.id}/menu`}
                  className="btn-push flex-1 text-center py-2 border-4 border-black text-sm font-black uppercase tracking-wide text-black transition-all duration-100"
                  style={{ background: "#FFFDF5", boxShadow: "3px 3px 0px 0px #000" }}
                >
                  Manage Menu
                </Link>
                <Link
                  href={`/restaurants/${restaurant.id}`}
                  className="btn-push flex items-center gap-1 px-3 py-2 border-4 border-black text-sm font-black uppercase tracking-wide text-black"
                  style={{ background: "#FF6B6B", boxShadow: "3px 3px 0px 0px #000" }}
                >
                  <TrendingUp className="w-4 h-4" strokeWidth={3} />
                  Analyze
                  <ArrowRight className="w-3 h-3" strokeWidth={3} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
