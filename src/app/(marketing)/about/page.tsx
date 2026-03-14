'use client';

import { motion } from 'framer-motion';
import { Users, Target, Heart, Lightbulb, Award, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const values = [
  { icon: Target, title: 'Mission-Driven', desc: 'We exist to simplify retail operations for millions of Indian businesses, from neighborhood kirana stores to multi-chain retailers.' },
  { icon: Lightbulb, title: 'Innovation First', desc: 'We constantly evolve our product with the latest technology — from cloud computing to AI-powered analytics.' },
  { icon: Heart, title: 'Customer Obsessed', desc: 'Every feature we build starts with customer feedback. Our 4.8/5 rating speaks to our commitment to support.' },
  { icon: Globe, title: 'Built for India', desc: 'From GST compliance to multi-language support, every detail is crafted for the Indian retail ecosystem.' },
];

const team = [
  { name: 'Arjun Mehta', role: 'Co-Founder & CEO', desc: 'Former product lead at Zoho. 12+ years in SaaS.' },
  { name: 'Sneha Reddy', role: 'Co-Founder & CTO', desc: 'Ex-Google engineer. Built systems serving millions.' },
  { name: 'Vikram Singh', role: 'Head of Product', desc: 'Product expert with deep retail domain knowledge.' },
  { name: 'Ananya Gupta', role: 'Head of Design', desc: 'Design leader passionate about intuitive experiences.' },
];

export default function AboutPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary-light to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              <Users className="w-3.5 h-3.5" /> About Us
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary">
              Empowering Indian retail <br />
              <span className="text-primary">with technology</span>
            </h1>
            <p className="mt-4 text-lg text-text-muted max-w-2xl mx-auto">
              Craftory POS was born from a simple idea — every business, regardless of size, deserves powerful, affordable, and easy-to-use billing software.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-extrabold text-text-primary mb-6">Our Story</h2>
            <div className="prose prose-gray max-w-none text-text-muted space-y-4 text-sm leading-relaxed">
              <p>
                In 2022, our founders visited hundreds of retail shops across India — from bustling kirana stores in Mumbai to electronics shops in Hyderabad. They noticed something alarming: most businesses were still using paper registers or outdated software that cost a fortune.
              </p>
              <p>
                That&apos;s when Craftory POS was born. We set out to build a cloud-based POS system that is affordable, intuitive, and built specifically for Indian retail. Our platform handles everything from GST-compliant invoicing to real-time inventory tracking, WhatsApp invoicing, and Tally integration.
              </p>
              <p>
                Today, over 15,000 businesses across India trust Craftory POS to run their daily operations. We&apos;re backed by leading investors and growing rapidly, but our mission remains the same — make technology accessible to every retailer in India.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-page-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-text-primary text-center mb-12">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-xl p-6 border border-border/50 text-center"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-text-primary mb-2">{value.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{value.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-text-primary text-center mb-12">Leadership Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-page-bg rounded-xl p-6 text-center group hover:shadow-md border border-border/50 transition-all"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/15 transition-colors">
                  <span className="text-2xl font-bold text-primary">{member.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <h3 className="text-base font-bold text-text-primary">{member.name}</h3>
                <p className="text-xs text-primary font-medium mt-0.5">{member.role}</p>
                <p className="text-sm text-text-muted mt-2">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Join our journey</h2>
          <p className="text-white/80 mb-8">We&apos;re always looking for talented people to join our mission. Check out open positions or get in touch.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary font-semibold rounded-xl text-sm">
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
