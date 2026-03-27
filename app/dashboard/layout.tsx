"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { ChefHat, LayoutDashboard, Plus } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-orange-500" />
            <span className="font-bold text-gray-900">Menu Profit Optimizer</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/dashboard"
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/restaurants/new"
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Restaurant
          </Link>
          <UserButton />
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
