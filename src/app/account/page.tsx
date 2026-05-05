"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { User, Package, Heart, LogIn } from "lucide-react";

export default function AccountPage() {
  return (
    <div className="pt-20 md:pt-24 min-h-screen">
      <div className="max-w-lg mx-auto px-5 md:px-8 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-tbc-grey-100 flex items-center justify-center mx-auto mb-6">
            <User size={32} className="text-tbc-grey-400" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl mb-3">Account</h1>
          <p className="text-tbc-grey-500 text-sm mb-8">
            Sign in to view your orders and saved designs, or continue browsing as a guest.
          </p>

          {/* Sign In Form */}
          <form className="space-y-3 mb-8">
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 bg-tbc-grey-50 border border-tbc-grey-200 text-sm outline-none focus:border-tbc-black transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 bg-tbc-grey-50 border border-tbc-grey-200 text-sm outline-none focus:border-tbc-black transition-colors"
            />
            <button type="submit" className="btn-primary w-full">
              <LogIn size={16} />
              Sign In
            </button>
          </form>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-tbc-grey-200" />
            <span className="text-xs text-tbc-grey-400">or</span>
            <div className="flex-1 h-px bg-tbc-grey-200" />
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/shop"
              className="flex flex-col items-center gap-2 p-6 bg-tbc-grey-50 hover:bg-tbc-grey-100 transition-colors"
            >
              <Package size={20} className="text-tbc-grey-500" />
              <span className="text-xs uppercase tracking-[0.08em]">Shop</span>
            </Link>
            <Link
              href="/studio"
              className="flex flex-col items-center gap-2 p-6 bg-tbc-grey-50 hover:bg-tbc-grey-100 transition-colors"
            >
              <Heart size={20} className="text-tbc-grey-500" />
              <span className="text-xs uppercase tracking-[0.08em]">Design</span>
            </Link>
          </div>

          <p className="text-[10px] text-tbc-grey-400 mt-8">
            No account needed to browse or use the Design Studio.
            <br />
            Accounts are created at checkout using your email.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
