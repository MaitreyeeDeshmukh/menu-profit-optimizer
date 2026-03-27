"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { TrendingUp, BarChart3, Zap, DollarSign, ChefHat, ArrowRight } from "lucide-react";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <ChefHat className="w-7 h-7 text-orange-500" />
          <span className="text-xl font-bold text-gray-900">Menu Profit Optimizer</span>
        </div>
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/sign-in" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 py-24 bg-gradient-to-b from-orange-50 to-white">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
          <Zap className="w-4 h-4" />
          Powered by Claude AI
        </div>
        <h1 className="text-5xl font-bold text-gray-900 max-w-3xl leading-tight mb-6">
          Turn Your Menu Into a{" "}
          <span className="text-orange-500">Profit Machine</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-10">
          AI analyzes every item on your menu, identifies pricing gaps, and delivers
          actionable recommendations to increase your margins by 20–40%.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          {isSignedIn ? (
            <Link href="/dashboard" className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-lg">
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link href="/sign-up" className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-lg">
                Analyze My Menu Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/demo" className="flex items-center gap-2 border-2 border-orange-400 text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors text-lg">
                View Live Demo
              </Link>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-12 mt-16">
          {[
            { value: "660K+", label: "US Restaurants" },
            { value: "$1,200", label: "Avg Monthly Gain" },
            { value: "< 2 min", label: "Analysis Time" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-orange-500">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Everything you need to optimize profitability
          </h2>
          <p className="text-center text-gray-500 mb-16 max-w-xl mx-auto">
            Stop leaving money on the table. Our AI understands restaurant economics.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="w-7 h-7 text-orange-500" />,
                title: "Menu Engineering",
                desc: "Classify every item as Star, Plow Horse, Puzzle, or Dog — then optimize each category.",
              },
              {
                icon: <DollarSign className="w-7 h-7 text-orange-500" />,
                title: "Price Optimization",
                desc: "Get specific price recommendations per item based on food cost benchmarks and demand signals.",
              },
              {
                icon: <TrendingUp className="w-7 h-7 text-orange-500" />,
                title: "Margin Analysis",
                desc: "Visual breakdown of your entire menu by margin — instantly spot what's hurting your bottom line.",
              },
            ].map((f) => (
              <div key={f.title} className="bg-gray-50 rounded-2xl p-6">
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-orange-500">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to maximize your profits?</h2>
          <p className="text-orange-100 mb-8 text-lg">
            Join restaurant owners using AI to grow their margins.
          </p>
          <Link
            href={isSignedIn ? "/dashboard" : "/sign-up"}
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 transition-colors text-lg"
          >
            {isSignedIn ? "Go to Dashboard" : "Start Free Today"} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 text-center text-sm text-gray-400">
        <div className="flex items-center justify-center gap-2">
          <ChefHat className="w-4 h-4 text-orange-400" />
          Menu Profit Optimizer &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
