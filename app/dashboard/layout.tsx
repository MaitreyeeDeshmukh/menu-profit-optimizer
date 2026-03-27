"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { ChefHat, LayoutDashboard, Plus } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen" style={{ background: "#FFFDF5", fontFamily: "'Space Grotesk', sans-serif" }}>
      <nav
        className="px-6 py-3 flex items-center justify-between border-b-4 border-black"
        style={{ background: "#FFFDF5" }}
      >
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-9 h-9 border-4 border-black font-black text-sm"
              style={{ background: "#FFD93D", boxShadow: "3px 3px 0px 0px #000" }}
            >
              <ChefHat className="w-4 h-4 text-black" strokeWidth={3} />
            </div>
            <span className="font-black uppercase tracking-tight text-black">MPO</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-3 py-2 border-2 text-sm font-bold uppercase tracking-wide transition-all duration-100 ${
                pathname === "/dashboard"
                  ? "border-black bg-black text-white"
                  : "border-transparent text-black hover:border-black hover:bg-black hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" strokeWidth={3} />
              Dashboard
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/restaurants/new"
            className="btn-push flex items-center gap-2 px-4 py-2 border-4 border-black text-sm font-black uppercase tracking-wide text-black"
            style={{ background: "#FF6B6B", boxShadow: "4px 4px 0px 0px #000" }}
          >
            <Plus className="w-4 h-4" strokeWidth={3} />
            Add Restaurant
          </Link>
          <div className="border-4 border-black" style={{ boxShadow: "2px 2px 0px 0px #000" }}>
            <UserButton />
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
