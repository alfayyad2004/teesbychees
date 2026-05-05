"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How does custom printing work?",
    a: "Upload your own graphic (PNG, JPG, or SVG) in our 3D Design Studio. Place it on the garment, choose your placement zone, resize to your liking, and see the price update in real-time. When you're happy, add to cart and checkout.",
  },
  {
    q: "How is the print price calculated?",
    a: "Print pricing is TTD $7.50 per inch, based on the longest side of your graphic (width or height). For example, a 10-inch graphic would cost TTD $75.00. If you add prints to multiple placements (front + back + sleeve), each is calculated independently and summed.",
  },
  {
    q: "What file formats do you accept?",
    a: "We accept PNG, JPG, and SVG files. For the best results, use a transparent PNG at high resolution (300 DPI or higher). Vector SVG files produce the sharpest prints.",
  },
  {
    q: "How long are custom designs saved?",
    a: "Custom designs in your cart are saved for 5 days. After that, they are automatically cleared. We recommend completing your purchase within that window.",
  },
  {
    q: "Do I need to create an account?",
    a: "No! You can browse the entire site, use the 3D Design Studio, and build your cart without an account. We only require your email and payment info at checkout.",
  },
  {
    q: "What sizes do you offer?",
    a: "All garments are available in S, M, L, XL, and XXL. Fits vary by garment type — check the 'Fit & Details' section on each product page for specific measurements.",
  },
  {
    q: "How long does shipping take?",
    a: "Local delivery within Trinidad is 3–5 business days. Island-wide shipping across Trinidad and Tobago is available.",
  },
  {
    q: "What's your return policy?",
    a: "Custom printed items are made to order and are non-refundable. Standard catalog items can be exchanged within 7 days if unworn, with tags attached. Contact us for details.",
  },
  {
    q: "Can I use the Design Studio on mobile?",
    a: "Yes! The 3D Design Studio is fully responsive and works on mobile devices. For the best experience, we recommend a tablet or desktop for detailed graphic placement.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="border-b border-tbc-grey-100"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-sm md:text-base font-medium pr-4 group-hover:opacity-70 transition-opacity">
          {q}
        </span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-tbc-grey-400 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-400 ${
          open ? "max-h-96 opacity-100 pb-5" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-sm text-tbc-grey-500 leading-relaxed max-w-2xl">{a}</p>
      </div>
    </motion.div>
  );
}

export default function HelpPage() {
  return (
    <div className="pt-20 md:pt-24 min-h-screen">
      {/* Header */}
      <section className="px-5 md:px-8 lg:px-12 py-12 md:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="overline mb-4">Support</p>
          <h1 className="display-heading text-display-sm md:text-display-md mb-4">
            Help & FAQ
          </h1>
        </motion.div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-3xl mx-auto px-5 md:px-8 pb-16 md:pb-24">
        <div>
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-tbc-grey-50 p-8 md:p-12"
        >
          <h2 className="font-display text-xl md:text-2xl mb-3">Still have questions?</h2>
          <p className="text-sm text-tbc-grey-500 mb-6">
            We&apos;re here to help. Reach out to us directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:teeschees17@gmail.com" className="btn-primary">
              Email Us
            </a>
            <a href="tel:+18683694700" className="btn-secondary">
              Call Us
            </a>
          </div>
          <div className="mt-6 text-xs text-tbc-grey-400 space-y-1">
            <p>#220 Southern Main Road, Marabella, San Fernando</p>
            <p>1-868-369-4700 · 1-868-658-6544</p>
          </div>
        </motion.div>

        {/* Size Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <h2 className="font-display text-xl md:text-2xl mb-6 text-center">Size Guide</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-tbc-black">
                  <th className="py-3 text-left font-medium uppercase tracking-[0.08em] text-xs">
                    Size
                  </th>
                  <th className="py-3 text-center font-medium uppercase tracking-[0.08em] text-xs">
                    Chest (in)
                  </th>
                  <th className="py-3 text-center font-medium uppercase tracking-[0.08em] text-xs">
                    Length (in)
                  </th>
                  <th className="py-3 text-center font-medium uppercase tracking-[0.08em] text-xs">
                    Shoulder (in)
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { size: "S", chest: "36–38", length: "27", shoulder: "17" },
                  { size: "M", chest: "38–40", length: "28", shoulder: "18" },
                  { size: "L", chest: "40–42", length: "29", shoulder: "19" },
                  { size: "XL", chest: "42–44", length: "30", shoulder: "20" },
                  { size: "XXL", chest: "44–46", length: "31", shoulder: "21" },
                ].map((row) => (
                  <tr key={row.size} className="border-b border-tbc-grey-100">
                    <td className="py-3 font-medium">{row.size}</td>
                    <td className="py-3 text-center text-tbc-grey-500">{row.chest}</td>
                    <td className="py-3 text-center text-tbc-grey-500">{row.length}</td>
                    <td className="py-3 text-center text-tbc-grey-500">{row.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
