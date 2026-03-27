"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Restaurant, Analysis } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
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
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurant_id: id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Analysis failed — check your API keys in Vercel");
        return;
      }
      setAnalysis(data);
      setAnalyses((prev) => [data, ...prev]);
    } catch (e) {
      setError("Request timed out or failed. Error: " + String(e));
    } finally {
      setAnalyzing(false);
    }
  }

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

  const recs = analysis?.recommendations || [];
  const highPriority = recs.filter((r) => r.priority === "high");
  const potentialGain = recs.reduce((sum, r) => sum + Math.max(0, r.suggested_price - r.current_price), 0);

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
            <span className="font-bold text-black uppercase tracking-wide text-sm">Analysis</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/restaurants/${id}/menu`}
            className="btn-push px-4 py-2 border-4 border-black text-sm font-black uppercase tracking-wide text-black"
            style={{ background: "#FFFDF5", boxShadow: "4px 4px 0px 0px #000" }}
          >
            Edit Menu
          </Link>
          <button
            onClick={runAnalysis}
            disabled={analyzing}
            className="btn-push flex items-center gap-2 px-4 py-2 border-4 border-black text-sm font-black uppercase tracking-wide text-black disabled:opacity-50"
            style={{ background: "#FF6B6B", boxShadow: "4px 4px 0px 0px #000" }}
          >
            {analyzing ? (
              <><RefreshCw className="w-4 h-4 animate-spin" strokeWidth={3} /> Analyzing...</>
            ) : (
              <><Zap className="w-4 h-4" strokeWidth={3} /> {analysis ? "Re-analyze" : "Analyze with AI"}</>
            )}
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {error && (
          <div
            className="border-4 border-black px-4 py-3 mb-6 flex items-center gap-2 font-bold text-black"
            style={{ background: "#FF6B6B", boxShadow: "4px 4px 0px 0px #000" }}
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0" strokeWidth={3} />
            {error}
          </div>
        )}

        {!analysis && !analyzing && (
          <div
            className="border-4 border-black border-dashed p-16 text-center"
            style={{ background: "#fff" }}
          >
            <div
              className="w-20 h-20 border-4 border-black flex items-center justify-center mx-auto mb-6"
              style={{ background: "#FFD93D", boxShadow: "6px 6px 0px 0px #000" }}
            >
              <Zap className="w-10 h-10 text-black" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-black mb-3">Ready to Analyze</h2>
            <p className="font-semibold text-black mb-8 max-w-md mx-auto">
              Claude AI will analyze all your menu items, identify pricing opportunities, and generate
              specific recommendations to maximize profitability.
            </p>
            <button
              onClick={runAnalysis}
              className="btn-push flex items-center gap-2 px-8 py-4 border-4 border-black font-black uppercase tracking-wider text-black text-lg mx-auto"
              style={{ background: "#FF6B6B", boxShadow: "6px 6px 0px 0px #000" }}
            >
              <Zap className="w-5 h-5" strokeWidth={3} />
              Run AI Analysis
            </button>
          </div>
        )}

        {analyzing && (
          <div
            className="border-4 border-black p-16 text-center"
            style={{ background: "#fff", boxShadow: "8px 8px 0px 0px #000" }}
          >
            <div
              className="w-20 h-20 border-4 border-black flex items-center justify-center mx-auto mb-6"
              style={{ background: "#C4B5FD", boxShadow: "6px 6px 0px 0px #000" }}
            >
              <RefreshCw className="w-10 h-10 text-black animate-spin" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-black mb-3">Analyzing Your Menu</h2>
            <p className="font-semibold text-black">Claude AI is reviewing all your menu items for profitability...</p>
          </div>
        )}

        {analysis && !analyzing && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Items", value: analysis.total_items, icon: <BarChart3 className="w-6 h-6 text-black" strokeWidth={3} />, bg: "#FFD93D" },
                { label: "Avg Margin", value: `${analysis.avg_margin}%`, icon: <TrendingUp className="w-6 h-6 text-black" strokeWidth={3} />, bg: "#FF6B6B" },
                { label: "High Margin", value: analysis.high_margin_count, icon: <CheckCircle2 className="w-6 h-6 text-black" strokeWidth={3} />, bg: "#C4B5FD" },
                { label: "Low Margin", value: analysis.low_margin_count, icon: <AlertTriangle className="w-6 h-6 text-black" strokeWidth={3} />, bg: "#FFFDF5" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="border-4 border-black p-4"
                  style={{ background: stat.bg, boxShadow: "6px 6px 0px 0px #000" }}
                >
                  <div className="mb-2">{stat.icon}</div>
                  <div className="text-3xl font-black text-black">{stat.value}</div>
                  <div className="text-xs font-black uppercase tracking-wide text-black mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* AI Summary */}
            <div
              className="border-4 border-black p-6 border-l-8"
              style={{ background: "#FFFDF5", borderLeftColor: "#C4B5FD", boxShadow: "8px 8px 0px 0px #000" }}
            >
              <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-black">AI Analysis Summary</h2>
                  <p className="text-sm font-semibold text-black flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" strokeWidth={3} />
                    {new Date(analysis.created_at).toLocaleString()}
                  </p>
                </div>
                <div
                  className="flex items-center gap-1 px-3 py-1.5 border-4 border-black font-black uppercase tracking-wide text-sm text-black"
                  style={{ background: "#C4B5FD", boxShadow: "4px 4px 0px 0px #000" }}
                >
                  <Zap className="w-4 h-4" strokeWidth={3} />
                  Powered by Claude
                </div>
              </div>
              <p className="font-semibold text-black leading-relaxed">{analysis.summary}</p>
            </div>

            {/* Potential Gain Banner */}
            {potentialGain > 0 && (
              <div
                className="border-4 border-black p-5 flex items-center gap-4"
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
                    +{formatCurrency(potentialGain)} potential revenue increase per order cycle
                  </div>
                  <div className="font-bold text-black text-sm uppercase tracking-wide mt-1">
                    Based on implementing all {recs.length} price recommendations
                    {highPriority.length > 0 && ` · ${highPriority.length} HIGH-PRIORITY`}
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {recs.length > 0 && (
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-black mb-4">Price Recommendations</h3>
                <div className="space-y-4">
                  {recs.map((rec, i) => {
                    const priorityBg = rec.priority === "high" ? "#FF6B6B" : rec.priority === "medium" ? "#FFD93D" : "#C4B5FD";
                    return (
                      <div
                        key={i}
                        className="bg-white border-4 border-black p-5 relative"
                        style={{ boxShadow: "8px 8px 0px 0px #000" }}
                      >
                        {/* Priority badge rotated */}
                        <div
                          className="absolute -top-3 -right-3 px-3 py-1 border-4 border-black font-black uppercase tracking-wider text-xs text-black"
                          style={{ background: priorityBg, transform: "rotate(2deg)", boxShadow: "3px 3px 0px 0px #000" }}
                        >
                          {rec.priority} priority
                        </div>

                        <div className="flex items-start justify-between mb-3 flex-wrap gap-4 pr-16">
                          <h4 className="font-black text-black text-lg uppercase tracking-tight">{rec.item_name}</h4>
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-xs font-black uppercase tracking-wide text-black">Current</div>
                              <div
                                className="text-xl font-black text-black line-through px-2 py-1 border-2 border-black"
                                style={{ background: "#f0f0f0" }}
                              >
                                {formatCurrency(rec.current_price)}
                              </div>
                            </div>
                            <div className="text-2xl font-black text-black">→</div>
                            <div className="text-center">
                              <div className="text-xs font-black uppercase tracking-wide text-black">Suggested</div>
                              <div
                                className="text-xl font-black text-black px-2 py-1 border-2 border-black"
                                style={{ background: "#22c55e", color: "#fff" }}
                              >
                                {formatCurrency(rec.suggested_price)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs font-black uppercase tracking-wide text-black mb-2">
                          Margin: {rec.current_margin?.toFixed(0)}% → {rec.suggested_margin?.toFixed(0)}%
                        </div>
                        <p className="font-semibold text-black leading-relaxed text-sm">{rec.reasoning}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Previous Analyses */}
            {analyses.length > 1 && (
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-black mb-4">Analysis History</h3>
                <div className="space-y-2">
                  {analyses.slice(1).map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setAnalysis(a)}
                      className={`w-full text-left border-4 px-5 py-4 font-semibold text-black transition-all duration-100 ${analysis?.id === a.id ? "border-black" : "border-black hover:bg-black hover:text-white"}`}
                      style={{ background: analysis?.id === a.id ? "#FFD93D" : "#fff", boxShadow: analysis?.id === a.id ? "4px 4px 0px 0px #000" : "none" }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">{new Date(a.created_at).toLocaleString()}</div>
                        <div className="text-sm font-black uppercase tracking-wide">Avg margin: {a.avg_margin}% · {a.total_items} items</div>
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
