import { Star } from 'lucide-react';

const TESTIMONIALS = [
  { name: 'তানজিলা আক্তার', role: 'গৃহিণী', rating: 5, comment: 'অসাধারণ মানের মসলা! রান্নায় সত্যিকারের দেশীয় স্বাদ পাচ্ছি। প্যাকেজিংও অনেক ভালো।' },
  { name: 'মোঃ রফিকুল ইসলাম', role: 'ব্যবসায়ী', rating: 5, comment: 'দ্রুত ডেলিভারি এবং পণ্যের গুণমান চমৎকার। নিয়মিত অর্ডার করি।' },
  { name: 'নাফিসা আহমেদ', role: 'শিক্ষার্থী', rating: 4, comment: 'অনলাইনে মসলা কিনতে প্রথমে দ্বিধা ছিল, কিন্তু এখন নিয়মিত কিনি। দারুণ অভিজ্ঞতা।' },
];

export function TestimonialsSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="section-title">আমাদের গ্রাহকদের মতামত</h2>
          <p className="section-subtitle">হাজারো সন্তুষ্ট গ্রাহকের একটুকু কথা</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-spice-400 text-spice-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.comment}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-brand-100 rounded-full flex items-center justify-center">
                  <span className="text-brand-700 font-bold text-sm">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
