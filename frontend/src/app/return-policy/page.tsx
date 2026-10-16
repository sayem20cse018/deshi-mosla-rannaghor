import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, XCircle, Phone, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'রিটার্ন পলিসি | দেশি মসলার রান্নাঘর',
  description: 'দেশি মসলার রান্নাঘরের রিটার্ন ও রিফান্ড নীতিমালা।',
};

export default function ReturnPolicyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-black text-gray-900 mb-2" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>রিটার্ন ও রিফান্ড পলিসি</h1>
          <p className="text-gray-400 text-sm mb-8" style={{fontFamily:'Manrope,sans-serif'}}>Return &amp; Refund Policy — সর্বশেষ আপডেট: জানুয়ারি ২০২৫</p>

          {/* Eligible */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
            <h2 className="font-black text-green-800 text-lg mb-3 flex items-center gap-2" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
              <CheckCircle className="w-5 h-5" /> রিটার্নযোগ্য পরিস্থিতি
            </h2>
            <ul className="space-y-2 text-green-700 text-[15px]" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
              {['ভুল পণ্য ডেলিভারি হলে', 'পণ্য নষ্ট বা ক্ষতিগ্রস্ত অবস্থায় পেলে', 'মেয়াদোত্তীর্ণ পণ্য পেলে', 'পণ্যের পরিমাণ কম হলে'].map(t => (
                <li key={t} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />{t}</li>
              ))}
            </ul>
          </div>

          {/* Not eligible */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <h2 className="font-black text-red-800 text-lg mb-3 flex items-center gap-2" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
              <XCircle className="w-5 h-5" /> রিটার্ন গ্রহণযোগ্য নয়
            </h2>
            <ul className="space-y-2 text-red-700 text-[15px]" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
              {['পণ্য ব্যবহার করা হলে বা প্যাকেজিং খোলা হলে', 'ডেলিভারির ৭ দিন পার হলে', 'গ্রাহকের ভুলে ভুল পণ্য অর্ডার করলে'].map(t => (
                <li key={t} className="flex items-start gap-2"><XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />{t}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-6" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
            {[
              { title: 'রিটার্ন প্রক্রিয়া', body: 'পণ্য পাওয়ার ৭ দিনের মধ্যে WhatsApp বা ইমেইলে যোগাযোগ করুন। অর্ডার নম্বর ও সমস্যার ছবি পাঠান। আমাদের টিম ২৪ ঘণ্টার মধ্যে সাড়া দেবে।' },
              { title: 'রিফান্ড প্রক্রিয়া', body: 'অনুমোদিত রিফান্ড ৩-৭ কার্যদিবসের মধ্যে মূল পেমেন্ট পদ্ধতিতে ফেরত দেওয়া হবে। ক্যাশ অন ডেলিভারির ক্ষেত্রে bKash/Nagad/ব্যাংক ট্রান্সফারে রিফান্ড করা হয়।' },
              { title: 'পরিবহন খরচ', body: 'আমাদের ভুলের কারণে রিটার্নের ক্ষেত্রে পরিবহন খরচ আমরা বহন করব। গ্রাহকের কারণে রিটার্নের ক্ষেত্রে পরিবহন খরচ গ্রাহককে বহন করতে হবে।' },
            ].map(({ title, body }) => (
              <div key={title} className="border-b border-gray-50 pb-6 last:border-0">
                <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-gray-600 leading-relaxed text-[15px]">{body}</p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-8 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-5">
            <h3 className="font-bold text-[#0f4c2a] mb-3" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>যোগাযোগ করুন</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="https://wa.me/8801700000000" className="flex items-center gap-2 text-[#0f4c2a] font-semibold text-sm hover:underline">
                <Phone className="w-4 h-4" /> WhatsApp: +880 1700-000000
              </a>
              <a href="mailto:return@deshimoslar.com" className="flex items-center gap-2 text-[#0f4c2a] font-semibold text-sm hover:underline">
                <Mail className="w-4 h-4" /> return@deshimoslar.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
