import { SignUp } from "@clerk/nextjs";
import { ChefHat } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ background: "#FFFDF5", fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* Decorative grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Logo */}
      <Link href="/" className="relative flex items-center gap-3 mb-10">
        <div
          className="flex items-center justify-center w-10 h-10 border-4 border-black"
          style={{ background: "#FFD93D", boxShadow: "4px 4px 0px 0px #000" }}
        >
          <ChefHat className="w-5 h-5 text-black" strokeWidth={3} />
        </div>
        <span className="font-black uppercase tracking-tight text-black text-lg">Menu Profit Optimizer</span>
      </Link>

      {/* Decorative offset container behind the Clerk component */}
      <div className="relative w-full max-w-md">
        {/* Offset shadow box */}
        <div
          className="absolute inset-0 border-4 border-black"
          style={{ background: "#FFD93D", transform: "translate(10px, 10px)" }}
        />
        <div
          className="relative border-4 border-black p-2"
          style={{ background: "#fff", boxShadow: "8px 8px 0px 0px #000" }}
        >
          <SignUp />
        </div>
      </div>

      <p className="relative mt-8 font-bold text-black text-sm uppercase tracking-wide">
        Already have an account?{" "}
        <Link href="/sign-in" className="border-b-2 border-black hover:text-gray-600 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
