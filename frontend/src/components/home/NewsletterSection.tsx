'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');

  return (
    <section className="py-10 bg-brand-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-700 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">সাবস্ক্রাইব করুন</h3>
              <p className="text-brand-300 text-sm">নতুন পণ্য, অফার ও রেসিপি সম্পর্কে আপনার ইমেইলে জানান দিই</p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Input
              type="email"
              placeholder="আপনার ইমেইল দিন..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-brand-700 border-brand-600 text-white placeholder:text-brand-400 w-full md:w-64"
            />
            <Button variant="spice" className="whitespace-nowrap">
              সাবস্ক্রাইব
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
