"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Restaurant, Analysis } from "@/lib/supabase";
import { formatCurrency, getPriorityColor } from "@/lib/utils";
import {
  ArrowLeft, TrendingUp, ChefHat, Zap, BarChart3,
  DollarSign, AlertTriangle, CheckCircle2, Clock, RefreshCw
} from "lucide-react";

export default function RestaurantAnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`/api/restaurants/${id}`).then((r) => r.json()),
      fetch(`/api/analyze?restaurant_id=${id}`).then((r) => r.json()),
    ]).then(([rest, prevAnalyses]) => {
      setRestaurant(rest);
      if (Array.isArray(prevAnalyses) && prevAnalyses.length > 0) {
        setAnalyses(prevAnalyses);
        setAnalysis(prevAnalyses[0]);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  async function runAnalysis() {
    setAnalyzing(true);
    setError("");
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurant_id: id }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Analysis failed");
      setAnalyzing(false);
      return;
    }
    setAnalysis(data);
    setAnalyses((prev) => [data, ...prev]);
    setAnalyzing(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const recs = analysis?.recommendations || [];
  const highPriority = recs.filter((r) => r.priority === "high");
  const potentialGain = recs.reduce((sum, r) => sum + Math.max(0, r.suggested_price - r.current_price), 0);

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
            <span className="text-gray-600">Analysis</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/restaurants/${id}/menu`}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Edit Menu
          </Link>
          <button
            onClick={runAnalysis}
            disabled={analyzing}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
          >
            {analyzing ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing...</>
            ) : (
              <><Zap className="w-4 h-4" /> {analysis ? "Re-analyze" : "Analyze with AI"}</>
            )}
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        {!analysis && !analyzing && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to Analyze</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Claude AI will analyze all your menu items, identify pricing opportunities, and generate
              specific recommendations to maximize profitability.
            </p>
            <button
              onClick={runAnalysis}
              className="flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors mx-auto text-lg"
            >
              <Zap className="w-5 h-5" />
              Run AI Analysis
            </button>
          </div>
        )}

        {analyzing && (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="w-10 h-10 text-orange-500 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Analyzing Your Menu</h2>
            <p className="text-gray-500">Claude AI is reviewing all your menu items for profitability...</p>
          </div>
        )}

        {analysis && !analyzing && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">AI Analysis Summary</h2>
                  <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {new Date(analysis.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  <Zap className="w-4 h-4" />
                  Powered by Claude
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Items", value: analysis.total_items, icon: <BarChart3 className="w-5 h-5 text-blue-500" />, color: "blue" },
                { label: "Avg Margin", value: `${analysis.avg_margin}%`, icon: <TrendingUp className="w-5 h-5 text-green-500" />, color: "green" },
                { label: "High Margin (≥70%)", value: analysis.high_margin_count, icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, color: "green" },
                { label: "Low Margin (<50%)", value: analysis.low_margin_count, icon: <AlertTriangle className="w-5 h-5 text-red-500" />, color: "red" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Potential Gain Banner */}
            {potentialGain > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-bold text-green-900 text-lg">
                    +{formatCurrency(potentialGain)} potential revenue increase per order cycle
                  </div>
                  <div className="text-green-700 text-sm">
                    Based on implementing all {recs.length} price recommendations
                    {highPriority.length > 0 && ` · ${highPriority.length} high-priority`}
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {recs.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Price Recommendations</h3>
                <div className="space-y-3">
                  {recs.map((rec, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{rec.item_name}</h4>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${getPriorityColor(rec.priority)}`}>
                            {rec.priority} priority
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-3">
                            <div className="text-center">
                              <div className="text-xs text-gray-400">Current</div>
                              <div className="text-lg font-bold text-gray-500 line-through">{formatCurrency(rec.current_price)}</div>
                            </div>
                            <div className="text-orange-400">→</div>
                            <div className="text-center">
                              <div className="text-xs text-gray-400">Suggested</div>
                              <div className="text-lg font-bold text-green-600">{formatCurrency(rec.suggested_price)}</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1 text-right">
                            Margin: {rec.current_margin?.toFixed(0)}% → {rec.suggested_margin?.toFixed(0)}%
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{rec.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Previous Analyses */}
            {analyses.length > 1 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Analysis History</h3>
                <div className="space-y-2">
                  {analyses.slice(1).map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setAnalysis(a)}
                      className={`w-full text-left bg-white rounded-xl border px-5 py-4 hover:border-orange-300 transition-colors ${analysis?.id === a.id ? "border-orange-400" : "border-gray-200"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">{new Date(a.created_at).toLocaleString()}</div>
                        <div className="text-sm font-medium text-gray-900">Avg margin: {a.avg_margin}% · {a.total_items} items</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
