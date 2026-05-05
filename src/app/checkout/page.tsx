"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Lock, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
  const { items, grandTotal, subtotal, totalPrintCost, clearCart } = useCartStore();
  const [step, setStep] = useState<"info" | "payment" | "confirmation">("info");
  const [showMobileSummary, setShowMobileSummary] = useState(false);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePayment = () => {
    // Simulate payment flow
    setTimeout(() => {
      clearCart();
      setStep("confirmation");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1500);
  };

  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="pt-20 md:pt-24 min-h-screen flex items-center justify-center bg-tbc-white">
        <div className="text-center px-6">
          <h1 className="font-display text-3xl mb-4 text-tbc-black">Your bag is empty.</h1>
          <p className="text-tbc-grey-500 text-sm mb-8">Let&apos;s find something special for you.</p>
          <Link href="/shop" className="btn-primary w-full max-w-[240px]">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  if (step === "confirmation") {
    return (
      <div className="pt-20 md:pt-24 min-h-[90vh] flex items-center justify-center bg-tbc-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center px-6 max-w-md w-full"
        >
          <CheckCircle size={48} strokeWidth={1} className="mx-auto mb-6 text-tbc-black" />
          <h1 className="font-display text-4xl mb-4 text-tbc-black">Order Confirmed</h1>
          <p className="text-tbc-grey-500 text-sm leading-relaxed mb-4">
            Thank you for your purchase. Your order details and tracking information will be sent to{" "}
            <span className="font-medium text-tbc-black">{formData.email}</span>.
          </p>
          <div className="border-t border-b border-tbc-grey-100 py-4 mb-8">
            <p className="text-xs uppercase tracking-widest text-tbc-grey-400 mb-1">Order Number</p>
            <p className="font-mono text-lg text-tbc-black">
              #{Math.random().toString(36).slice(2, 10).toUpperCase()}
            </p>
          </div>
          <Link href="/shop" className="btn-primary w-full">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tbc-white flex flex-col pt-[76px]">
      {/* Mobile Order Summary Toggle */}
      <div className="lg:hidden border-b border-tbc-grey-200 bg-tbc-grey-50 sticky top-[76px] z-30">
        <button 
          onClick={() => setShowMobileSummary(!showMobileSummary)}
          className="w-full flex items-center justify-between px-5 py-4"
        >
          <span className="flex items-center gap-2 text-sm text-tbc-grey-600 font-medium">
            {showMobileSummary ? "Hide order summary" : "Show order summary"}
            {showMobileSummary ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
          <span className="font-medium text-lg">TTD ${grandTotal().toFixed(2)}</span>
        </button>

        <AnimatePresence>
          {showMobileSummary && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-tbc-grey-50 px-5 border-t border-tbc-grey-200"
            >
              <div className="py-6 space-y-5">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 aspect-[3/4] bg-white border border-black/5 flex-shrink-0">
                      <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="64px" />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-tbc-black text-white text-[10px] flex items-center justify-center rounded-full z-10">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-tbc-black leading-tight">{item.productName}</p>
                      <p className="text-[11px] text-tbc-grey-500 mt-1">
                        Size: {item.size} <br/> 
                        {item.graphics.length > 0 && `${item.graphics.length} graphic prints`}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-tbc-black">TTD ${item.lineTotal.toFixed(2)}</p>
                  </div>
                ))}

                <div className="border-t border-tbc-grey-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-tbc-grey-500">
                    <span>Subtotal</span>
                    <span>TTD ${subtotal().toFixed(2)}</span>
                  </div>
                  {totalPrintCost() > 0 && (
                    <div className="flex justify-between text-sm text-tbc-grey-500">
                      <span>Print Costs</span>
                      <span>TTD ${totalPrintCost().toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-tbc-grey-500">
                    <span>Shipping</span>
                    <span className="text-[10px] uppercase tracking-wider">Calculated next</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1400px] mx-auto">
        {/* Left Side: Forms */}
        <div className="flex-1 lg:w-3/5 px-5 md:px-12 lg:px-20 py-10 lg:py-16 bg-white border-r border-tbc-grey-100 min-h-full">
          <Link
            href="/cart"
            onClick={(e) => {
              e.preventDefault();
              useCartStore.getState().openCart();
            }}
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-tbc-grey-400 hover:text-tbc-black transition-colors mb-10"
          >
            <ArrowLeft size={14} /> Back to Bag
          </Link>

          {/* Breadcrumb Steps */}
          <div className="flex items-center gap-3 mb-10">
            <span className={`text-xs uppercase tracking-widest ${step === "info" ? "text-tbc-black font-semibold" : "text-tbc-grey-400"}`}>Information</span>
            <span className="text-tbc-grey-300">/</span>
            <span className={`text-xs uppercase tracking-widest ${step === "payment" ? "text-tbc-black font-semibold" : "text-tbc-grey-400"}`}>Payment</span>
          </div>

          <h2 className="font-display text-3xl mb-8">
            {step === "info" ? "Shipping Details" : "Payment"}
          </h2>

          <AnimatePresence mode="wait">
            {step === "info" && (
              <motion.form
                key="info"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmitInfo}
                className="space-y-8 max-w-xl"
              >
                {/* Contact */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-tbc-black border-b border-tbc-grey-200 pb-2">Contact</h3>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email address"
                      required
                      className="peer w-full bg-transparent border border-tbc-grey-300 px-4 pt-5 pb-2 text-sm text-tbc-black focus:border-tbc-black focus:ring-1 focus:ring-tbc-black outline-none transition-all placeholder-transparent rounded-sm"
                    />
                    <label className="absolute left-4 top-1 text-[10px] uppercase tracking-wider text-tbc-grey-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:text-[10px] peer-focus:top-1 peer-focus:uppercase peer-focus:tracking-wider">
                      Email address
                    </label>
                  </div>
                </div>

                {/* Delivery */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-tbc-black border-b border-tbc-grey-200 pb-2">Delivery</h3>
                  
                  <div className="relative">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border border-tbc-grey-300 px-4 py-3.5 text-sm text-tbc-black focus:border-tbc-black focus:ring-1 focus:ring-tbc-black outline-none transition-all rounded-sm appearance-none"
                    >
                      <option>Trinidad and Tobago</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronDown size={16} className="text-tbc-grey-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First name"
                        required
                        className="peer w-full bg-transparent border border-tbc-grey-300 px-4 pt-5 pb-2 text-sm text-tbc-black focus:border-tbc-black focus:ring-1 focus:ring-tbc-black outline-none transition-all placeholder-transparent rounded-sm"
                      />
                      <label className="absolute left-4 top-1 text-[10px] uppercase tracking-wider text-tbc-grey-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:text-[10px] peer-focus:top-1 peer-focus:uppercase peer-focus:tracking-wider">
                        First name
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last name"
                        required
                        className="peer w-full bg-transparent border border-tbc-grey-300 px-4 pt-5 pb-2 text-sm text-tbc-black focus:border-tbc-black focus:ring-1 focus:ring-tbc-black outline-none transition-all placeholder-transparent rounded-sm"
                      />
                      <label className="absolute left-4 top-1 text-[10px] uppercase tracking-wider text-tbc-grey-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:text-[10px] peer-focus:top-1 peer-focus:uppercase peer-focus:tracking-wider">
                        Last name
                      </label>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Address"
                      required
                      className="peer w-full bg-transparent border border-tbc-grey-300 px-4 pt-5 pb-2 text-sm text-tbc-black focus:border-tbc-black focus:ring-1 focus:ring-tbc-black outline-none transition-all placeholder-transparent rounded-sm"
                    />
                    <label className="absolute left-4 top-1 text-[10px] uppercase tracking-wider text-tbc-grey-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:text-[10px] peer-focus:top-1 peer-focus:uppercase peer-focus:tracking-wider">
                      Address
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        required
                        className="peer w-full bg-transparent border border-tbc-grey-300 px-4 pt-5 pb-2 text-sm text-tbc-black focus:border-tbc-black focus:ring-1 focus:ring-tbc-black outline-none transition-all placeholder-transparent rounded-sm"
                      />
                      <label className="absolute left-4 top-1 text-[10px] uppercase tracking-wider text-tbc-grey-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:text-[10px] peer-focus:top-1 peer-focus:uppercase peer-focus:tracking-wider">
                        City
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone"
                        required
                        className="peer w-full bg-transparent border border-tbc-grey-300 px-4 pt-5 pb-2 text-sm text-tbc-black focus:border-tbc-black focus:ring-1 focus:ring-tbc-black outline-none transition-all placeholder-transparent rounded-sm"
                      />
                      <label className="absolute left-4 top-1 text-[10px] uppercase tracking-wider text-tbc-grey-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:text-[10px] peer-focus:top-1 peer-focus:uppercase peer-focus:tracking-wider">
                        Phone
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-tbc-black text-white py-4 text-sm font-medium tracking-widest uppercase hover:bg-tbc-black/90 transition-colors">
                    Continue to Payment
                  </button>
                </div>
              </motion.form>
            )}

            {step === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="max-w-xl space-y-8"
              >
                {/* Summary box of shipping info */}
                <div className="border border-tbc-grey-200 rounded-sm divide-y divide-tbc-grey-200 text-sm">
                  <div className="flex justify-between p-4">
                    <span className="text-tbc-grey-500 w-24">Contact</span>
                    <span className="flex-1 font-medium">{formData.email}</span>
                    <button onClick={() => setStep("info")} className="text-xs font-medium uppercase tracking-wider underline">Change</button>
                  </div>
                  <div className="flex justify-between p-4">
                    <span className="text-tbc-grey-500 w-24">Ship to</span>
                    <span className="flex-1 font-medium">{formData.address}, {formData.city}</span>
                    <button onClick={() => setStep("info")} className="text-xs font-medium uppercase tracking-wider underline">Change</button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-tbc-black border-b border-tbc-grey-200 pb-2 flex items-center gap-2">
                    <Lock size={14} /> Secure Payment
                  </h3>
                  
                  <div className="border border-tbc-black bg-[#fafafa] p-6 text-center rounded-sm">
                    <Image src="/logo/tbc-logo-transparent.png" alt="WiPay" width={40} height={20} className="mx-auto mb-3 opacity-50 grayscale" />
                    <p className="text-sm font-medium mb-1">WiPay Checkout</p>
                    <p className="text-xs text-tbc-grey-500 mb-6">You will be redirected securely to WiPay to complete your purchase.</p>
                    
                    <div className="flex items-center justify-center gap-2">
                      <div className="px-3 py-1.5 border border-tbc-grey-200 bg-white text-[10px] font-semibold tracking-wider rounded-sm shadow-sm">VISA</div>
                      <div className="px-3 py-1.5 border border-tbc-grey-200 bg-white text-[10px] font-semibold tracking-wider rounded-sm shadow-sm">MASTERCARD</div>
                      <div className="px-3 py-1.5 border border-tbc-grey-200 bg-white text-[10px] font-semibold tracking-wider rounded-sm shadow-sm">LINX</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <button onClick={handlePayment} className="w-full bg-tbc-black text-white py-4 text-sm font-medium tracking-widest uppercase hover:bg-tbc-black/90 transition-colors flex items-center justify-center gap-2">
                    <Lock size={14} /> Pay TTD ${grandTotal().toFixed(2)}
                  </button>
                  <button onClick={() => setStep("info")} className="w-full py-4 text-sm font-medium text-tbc-grey-500 hover:text-tbc-black transition-colors uppercase tracking-widest">
                    Return to shipping
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Desktop Order Summary */}
        <div className="hidden lg:block lg:w-2/5 bg-tbc-grey-50 border-l border-tbc-grey-200 px-12 py-16 sticky top-0 h-screen overflow-y-auto">
          <div className="max-w-md space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 items-start">
                <div className="relative w-20 aspect-[3/4] bg-white border border-black/5 flex-shrink-0">
                  <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="80px" />
                  <span className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-tbc-black/90 text-white text-xs flex items-center justify-center rounded-full z-10 shadow-md">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm font-medium text-tbc-black">{item.productName}</p>
                  <p className="text-xs text-tbc-grey-500 mt-1 space-y-0.5">
                    <span className="block">Size: {item.size}</span>
                    {item.graphics.length > 0 && <span className="block">{item.graphics.length} graphic prints</span>}
                  </p>
                </div>
                <p className="text-sm font-medium text-tbc-black pt-1">TTD ${item.lineTotal.toFixed(2)}</p>
              </div>
            ))}

            <div className="border-t border-tbc-grey-200 pt-6 space-y-3 mt-8">
              <div className="flex justify-between text-sm text-tbc-grey-600">
                <span>Subtotal</span>
                <span className="font-medium text-tbc-black">TTD ${subtotal().toFixed(2)}</span>
              </div>
              {totalPrintCost() > 0 && (
                <div className="flex justify-between text-sm text-tbc-grey-600">
                  <span>Print Costs</span>
                  <span className="font-medium text-tbc-black">TTD ${totalPrintCost().toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-tbc-grey-600">
                <span>Shipping</span>
                <span className="text-[10px] uppercase tracking-widest text-tbc-grey-400">Calculated at next step</span>
              </div>
            </div>

            <div className="border-t-2 border-tbc-black pt-4 mt-6 flex justify-between items-center">
              <span className="text-base font-semibold uppercase tracking-widest">Total</span>
              <span className="text-3xl font-display font-semibold">TTD ${grandTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
