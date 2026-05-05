"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Lock, CheckCircle } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
  const { items, grandTotal, subtotal, totalPrintCost, clearCart } = useCartStore();
  const [step, setStep] = useState<"info" | "payment" | "confirmation">("info");
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    country: "Trinidad and Tobago",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePayment = () => {
    // Simulate WiPay payment flow
    setTimeout(() => {
      clearCart();
      setStep("confirmation");
    }, 1500);
  };

  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="pt-20 md:pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-display text-2xl mb-3">Nothing to checkout</h1>
          <p className="text-tbc-grey-500 text-sm mb-6">Your bag is empty.</p>
          <Link href="/shop" className="btn-primary">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  if (step === "confirmation") {
    return (
      <div className="pt-20 md:pt-24 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-6 max-w-md"
        >
          <CheckCircle size={56} className="mx-auto mb-6 text-green-600" />
          <h1 className="font-display text-3xl md:text-4xl mb-3">Order Confirmed</h1>
          <p className="text-tbc-grey-500 text-sm mb-2">
            Thank you for your order! A confirmation email has been sent to{" "}
            <span className="font-medium text-tbc-black">{formData.email}</span>.
          </p>
          <p className="text-xs text-tbc-grey-400 mb-8">
            Order #{Math.random().toString(36).slice(2, 10).toUpperCase()}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="btn-primary">
              Continue Shopping
            </Link>
            <Link href="/studio" className="btn-secondary">
              Design Another
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-24 min-h-screen bg-tbc-grey-50">
      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12 py-8 md:py-12">
        {/* Back Link */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-xs text-tbc-grey-500 hover:text-tbc-black transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Left — Form */}
          <div className="lg:col-span-3">
            {/* Step Indicator */}
            <div className="flex items-center gap-4 mb-8">
              <div
                className={`flex items-center gap-2 text-xs uppercase tracking-[0.1em] ${
                  step === "info"
                    ? "text-tbc-black font-medium"
                    : "text-tbc-grey-400"
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-tbc-black text-white text-[10px] flex items-center justify-center">
                  1
                </span>
                Information
              </div>
              <div className="w-8 h-px bg-tbc-grey-200" />
              <div
                className={`flex items-center gap-2 text-xs uppercase tracking-[0.1em] ${
                  step === "payment"
                    ? "text-tbc-black font-medium"
                    : "text-tbc-grey-400"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full text-[10px] flex items-center justify-center ${
                    step === "payment"
                      ? "bg-tbc-black text-white"
                      : "bg-tbc-grey-200 text-tbc-grey-500"
                  }`}
                >
                  2
                </span>
                Payment
              </div>
            </div>

            {step === "info" && (
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmitInfo}
                className="space-y-6"
              >
                {/* Contact */}
                <div>
                  <h2 className="text-sm font-medium uppercase tracking-[0.08em] mb-4">
                    Contact
                  </h2>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email address"
                    required
                    className="w-full px-4 py-3 bg-white border border-tbc-grey-200 text-sm outline-none focus:border-tbc-black transition-colors"
                  />
                  <p className="text-[10px] text-tbc-grey-400 mt-2">
                    Your email will be used to create an account and send order confirmation.
                  </p>
                </div>

                {/* Shipping */}
                <div>
                  <h2 className="text-sm font-medium uppercase tracking-[0.08em] mb-4">
                    Shipping Address
                  </h2>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First name"
                      required
                      className="w-full px-4 py-3 bg-white border border-tbc-grey-200 text-sm outline-none focus:border-tbc-black transition-colors"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last name"
                      required
                      className="w-full px-4 py-3 bg-white border border-tbc-grey-200 text-sm outline-none focus:border-tbc-black transition-colors"
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                    required
                    className="w-full px-4 py-3 bg-white border border-tbc-grey-200 text-sm outline-none focus:border-tbc-black transition-colors mb-3"
                  />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    required
                    className="w-full px-4 py-3 bg-white border border-tbc-grey-200 text-sm outline-none focus:border-tbc-black transition-colors mb-3"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      required
                      className="w-full px-4 py-3 bg-white border border-tbc-grey-200 text-sm outline-none focus:border-tbc-black transition-colors"
                    />
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-tbc-grey-200 text-sm outline-none focus:border-tbc-black transition-colors"
                    >
                      <option>Trinidad and Tobago</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full">
                  Continue to Payment
                </button>
              </motion.form>
            )}

            {step === "payment" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-white p-6 border border-tbc-grey-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock size={16} className="text-tbc-grey-400" />
                    <h2 className="text-sm font-medium uppercase tracking-[0.08em]">
                      Secure Payment
                    </h2>
                  </div>

                  <div className="bg-tbc-grey-50 p-6 text-center rounded mb-6">
                    <p className="text-sm text-tbc-grey-500 mb-2">
                      Payment powered by WiPay
                    </p>
                    <p className="text-xs text-tbc-grey-400">
                      Trinidad & Tobago&apos;s leading payment processor
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-4">
                      <span className="px-3 py-1 bg-white text-[10px] font-medium border border-tbc-grey-200 rounded">
                        VISA
                      </span>
                      <span className="px-3 py-1 bg-white text-[10px] font-medium border border-tbc-grey-200 rounded">
                        MASTERCARD
                      </span>
                      <span className="px-3 py-1 bg-white text-[10px] font-medium border border-tbc-grey-200 rounded">
                        LINX
                      </span>
                    </div>
                  </div>

                  {/* Simulated Card Form */}
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Card number"
                      className="w-full px-4 py-3 bg-tbc-grey-50 border border-tbc-grey-200 text-sm outline-none focus:border-tbc-black transition-colors"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-full px-4 py-3 bg-tbc-grey-50 border border-tbc-grey-200 text-sm outline-none focus:border-tbc-black transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="w-full px-4 py-3 bg-tbc-grey-50 border border-tbc-grey-200 text-sm outline-none focus:border-tbc-black transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("info")}
                    className="btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button onClick={handlePayment} className="btn-primary flex-1">
                    <Lock size={14} />
                    Pay TTD ${grandTotal().toFixed(2)}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right — Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 bg-white p-6 border border-tbc-grey-100">
              <h2 className="text-xs uppercase tracking-[0.12em] text-tbc-grey-500 mb-5">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-20 bg-tbc-grey-50 flex-shrink-0">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-tbc-grey-500 text-white text-[10px] flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{item.productName}</p>
                      <p className="text-[10px] text-tbc-grey-400 mt-0.5">
                        {item.size} · {item.graphics.length > 0 && `${item.graphics.length} print(s)`}
                      </p>
                      <p className="text-xs font-medium mt-1">
                        TTD ${item.lineTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-tbc-grey-100 pt-4">
                <div className="flex justify-between text-xs text-tbc-grey-500">
                  <span>Subtotal</span>
                  <span>TTD ${subtotal().toFixed(2)}</span>
                </div>
                {totalPrintCost() > 0 && (
                  <div className="flex justify-between text-xs text-tbc-grey-500">
                    <span>Print costs</span>
                    <span>TTD ${totalPrintCost().toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-tbc-grey-500">
                  <span>Shipping</span>
                  <span>TBD</span>
                </div>
              </div>

              <div className="border-t-2 border-tbc-black pt-3 mt-3 flex justify-between">
                <span className="text-sm font-medium">Total</span>
                <span className="text-lg font-display font-semibold">
                  TTD ${grandTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
