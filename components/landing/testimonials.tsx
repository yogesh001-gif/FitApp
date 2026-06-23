'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Helped me gain 6kg of lean mass in 3 months. The dynamic workouts adjusted perfectly when I only had dumbbells available.",
    author: "Rahul S.",
    role: "User",
  },
  {
    quote: "The best fitness tracking app I've used. Logging food in plain English instead of searching a huge database saves me 15 minutes a day.",
    author: "Aman K.",
    role: "User",
  },
  {
    quote: "It feels like having a real coach. When I missed my calorie target, it didn't guilt me, it just adjusted my macros for the rest of the week.",
    author: "Priya M.",
    role: "User",
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Don't just take our word for it.</h2>
          <p className="text-lg text-slate-400">Join thousands of users transforming their approach to fitness.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl border border-white/5 bg-slate-900 p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-lg text-slate-300 leading-relaxed mb-8">"{t.quote}"</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium">{t.author}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
