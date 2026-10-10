'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

function useFaqs() {
  return useQuery({
    queryKey: ['faqs-public'],
    queryFn: async () => {
      const { data } = await api.get('/admin/faqs', { params: { limit: 100 } });
      return (data?.data ?? []) as any[];
    },
    staleTime: 300_000,
  });
}

export default function FaqPage() {
  const { data: faqs = [], isLoading, isError } = useFaqs();
  const published = faqs.filter((f: any) => f.isPublished);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">FAQ</p>
          <h1 className="text-3xl font-black text-gray-900">সাধারণ জিজ্ঞাসা</h1>
          <p className="text-gray-500 mt-2 text-sm">আমাদের সম্পর্কে সাধারণ প্রশ্নের উত্তর</p>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-12 text-gray-400">
            <p>তথ্য লোড করা যায়নি। পুনরায় চেষ্টা করুন।</p>
          </div>
        )}

        {!isLoading && !isError && published.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>কোনো FAQ পাওয়া যায়নি।</p>
          </div>
        )}

        {!isLoading && !isError && published.length > 0 && (
          <div className="space-y-3">
            {published.map((faq: any) => (
              <div key={faq.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-semibold text-gray-900 text-sm leading-relaxed">
                    {faq.question}
                  </span>
                  <ChevronDown className={cn('w-4 h-4 text-gray-400 flex-shrink-0 ml-3 transition-transform', openId === faq.id && 'rotate-180')} />
                </button>
                {openId === faq.id && (
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}