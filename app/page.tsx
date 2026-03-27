"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { TrendingUp, BarChart3, Zap, DollarSign, ChefHat, ArrowRight } from "lucide-react";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#FFFDF5", fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b-4 border-black" style={{ background: "#FFFDF5" }}>
        <Link href="/" className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 border-4 border-black"
            style={{ background: "#FFD93D", boxShadow: "4px 4px 0px 0px #000" }}
          >
            <ChefHat className="w-5 h-5 text-black" strokeWidth={3} />
          </div>
          <span className="text-lg font-black uppercase tracking-tight text-black">Menu Profit Optimizer</span>
        </Link>
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="btn-push flex items-center gap-2 px-5 py-2.5 border-4 border-black font-bold uppercase tracking-wide text-sm text-black"
              style={{ background: "#FF6B6B", boxShadow: "4px 4px 0px 0px #000" }}
            >
              Dashboard <ArrowRight className="w-4 h-4" strokeWidth={3} />
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-black font-bold uppercase tracking-wide text-sm px-4 py-2 border-4 border-black transition-all duration-100 hover:bg-black hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="btn-push flex items-center gap-2 px-5 py-2.5 border-4 border-black font-bold uppercase tracking-wide text-sm text-black"
                style={{ background: "#FFD93D", boxShadow: "4px 4px 0px 0px #000" }}
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section
        className="relative flex flex-col items-center text-center px-6 py-24 overflow-hidden"
        style={{ background: "#FFFDF5" }}
      >
        {/* Halftone dot pattern background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.15) 1.5px, transparent 1.5px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* AI badge */}
        <div
          className="relative inline-flex items-center gap-2 px-4 py-2 border-4 border-black font-bold uppercase tracking-wider text-sm mb-8"
          style={{ background: "#C4B5FD", boxShadow: "4px 4px 0px 0px #000" }}
        >
          <Zap className="w-4 h-4 text-black" strokeWidth={3} />
          Powered by AI
        </div>

        <h1
          className="relative text-6xl md:text-8xl font-black uppercase tracking-tight max-w-4xl leading-none mb-4 text-black"
          style={{ lineHeight: 1.0 }}
        >
          Turn Your Menu Into a{" "}
          <span
            className="inline-block px-2"
            style={{
              background: "#FF6B6B",
              border: "4px solid #000",
              boxShadow: "6px 6px 0px 0px #000",
              color: "#000",
            }}
          >
            Profit Machine
          </span>
        </h1>

        <p className="relative text-xl font-semibold text-black max-w-2xl mt-8 mb-10 leading-relaxed">
          AI analyzes every item on your menu, identifies pricing gaps, and delivers
          actionable recommendations to increase your margins by 20–40%.
        </p>

        <div className="relative flex flex-wrap gap-4 justify-center mb-16">
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="btn-push flex items-center gap-2 px-8 py-4 border-4 border-black font-black uppercase tracking-wider text-lg text-black"
              style={{ background: "#FF6B6B", boxShadow: "6px 6px 0px 0px #000" }}
            >
              Go to Dashboard <ArrowRight className="w-5 h-5" strokeWidth={3} />
            </Link>
          ) : (
            <>
              <Link
                href="/demo"
                className="btn-push flex items-center gap-2 px-8 py-4 border-4 border-black font-black uppercase tracking-wider text-lg text-black"
                style={{ background: "#FF6B6B", boxShadow: "6px 6px 0px 0px #000" }}
              >
                View Live Demo
              </Link>
              <Link
                href="/sign-up"
                className="btn-push flex items-center gap-2 px-8 py-4 border-4 border-black font-black uppercase tracking-wider text-lg text-black"
                style={{ background: "#FFD93D", boxShadow: "6px 6px 0px 0px #000" }}
              >
                Get Started <ArrowRight className="w-5 h-5" strokeWidth={3} />
              </Link>
            </>
          )}
        </div>

        {/* Stats row */}
        <div className="relative flex flex-wrap gap-6 justify-center">
          {[
            { value: "660K+", label: "US Restaurants" },
            { value: "$1,200", label: "Avg Monthly Gain" },
            { value: "< 2 min", label: "Analysis Time" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center px-8 py-5 border-4 border-black min-w-[160px]"
              style={{ background: "#FFD93D", boxShadow: "6px 6px 0px 0px #000" }}
            >
              <div className="text-3xl font-black text-black">{stat.value}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-black mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t-4 border-black" style={{ background: "#FFFDF5" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-center text-black uppercase tracking-tight mb-3">
            Everything you need to optimize profitability
          </h2>
          <p className="text-center font-semibold text-black mb-16 max-w-xl mx-auto">
            Stop leaving money on the table. Our AI understands restaurant economics.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="w-8 h-8 text-black" strokeWidth={3} />,
                title: "Menu Engineering",
                desc: "Classify every item as Star, Plow Horse, Puzzle, or Dog — then optimize each category.",
                bg: "#FF6B6B",
              },
              {
                icon: <DollarSign className="w-8 h-8 text-black" strokeWidth={3} />,
                title: "Price Optimization",
                desc: "Get specific price recommendations per item based on food cost benchmarks and demand signals.",
                bg: "#FFD93D",
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-black" strokeWidth={3} />,
                title: "Margin Analysis",
                desc: "Visual breakdown of your entire menu by margin — instantly spot what's hurting your bottom line.",
                bg: "#C4B5FD",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="card-lift border-4 border-black"
                style={{ background: "#fff", boxShadow: "8px 8px 0px 0px #000" }}
              >
                <div
                  className="p-4 border-b-4 border-black flex items-center gap-3"
                  style={{ background: f.bg }}
                >
                  {f.icon}
                  <h3 className="text-lg font-black uppercase tracking-wide text-black">{f.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-black font-semibold leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t-4 border-black" style={{ background: "#000" }}>
        <div className="text-center">
          <h2 className="text-4xl font-black uppercase tracking-tight mb-4" style={{ color: "#FFFDF5" }}>
            Ready to maximize your profits?
          </h2>
          <p className="font-semibold mb-10 text-lg" style={{ color: "#FFD93D" }}>
            Join restaurant owners using AI to grow their margins.
          </p>
          <Link
            href={isSignedIn ? "/dashboard" : "/sign-up"}
            className="btn-push inline-flex items-center gap-2 px-10 py-5 border-4 border-white font-black uppercase tracking-wider text-lg text-black"
            style={{ background: "#FFD93D", boxShadow: "6px 6px 0px 0px #fff" }}
          >
            {isSignedIn ? "Go to Dashboard" : "Start Free Today"} <ArrowRight className="w-5 h-5" strokeWidth={3} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t-4 border-black text-center" style={{ background: "#FFD93D" }}>
        <div className="flex items-center justify-center gap-2">
          <ChefHat className="w-5 h-5 text-black" strokeWidth={3} />
          <span className="font-black uppercase tracking-wide text-black text-sm">
            Menu Profit Optimizer &copy; {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
}
