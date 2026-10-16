import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ব্লগ | দেশি মসলার রান্নাঘর',
  description: 'রান্নার টিপস, রেসিপি ও মসলার গল্প — দেশি মসলার রান্নাঘর ব্লগ।',
};

const POSTS = [
  { slug: 'khari-sorishar-tel-upokrita', title: 'খাঁটি সরিষার তেলের উপকারিতা', category: 'স্বাস্থ্য', date: '১৫ জানুয়ারি, ২০২৫', emoji: '🫙', excerpt: 'সরিষার তেল শুধু রান্নার উপাদান নয়, এটি স্বাস্থ্যগুণেও অনন্য। জানুন কেন খাঁটি সরিষার তেল আপনার রান্নায় ব্যবহার করা উচিত।' },
  { slug: 'holud-spice-benefits', title: 'হলুদের অলৌকিক গুণাগুণ', category: 'মসলা', date: '১০ জানুয়ারি, ২০২৫', emoji: '💛', excerpt: 'হলুদে রয়েছে কারকিউমিন যা প্রদাহ বিরোধী ও অ্যান্টিঅক্সিডেন্ট সমৃদ্ধ। দেশি হলুদ আমদানি হলুদের চেয়ে কেন বেশি কার্যকর?' },
  { slug: 'sundarban-madhu-story', title: 'সুন্দরবনের মধু — প্রকৃতির সেরা উপহার', category: 'পণ্য', date: '৫ জানুয়ারি, ২০২৫', emoji: '🍯', excerpt: 'সুন্দরবনের মৌয়ালরা কীভাবে খাঁটি মধু সংগ্রহ করেন? জানুন এই বিশেষ মধুর পেছনের গল্প।' },
  { slug: 'biryani-moslar-secret', title: 'বিরিয়ানি মসলার আসল রহস্য', category: 'রেসিপি', date: '৩ জানুয়ারি, ২০২৫', emoji: '🍛', excerpt: 'একটি নিখুঁত বিরিয়ানির পেছনে থাকে সঠিক মসলার অনুপাত। শেফ রহিমের বিশেষ বিরিয়ানি মসলা রেসিপি।' },
  { slug: 'organic-grocery-tips', title: 'অর্গানিক গ্রোসারি কেনার ৫টি টিপস', category: 'টিপস', date: '১ জানুয়ারি, ২০২৫', emoji: '🌿', excerpt: 'বাজার থেকে জৈব পণ্য চেনার উপায় কী? কীভাবে নিশ্চিত করবেন যে আপনি সত্যিকার খাঁটি পণ্য কিনছেন?' },
  { slug: 'bangladeshi-spice-history', title: 'বাংলাদেশের মসলার ইতিহাস', category: 'সংস্কৃতি', date: '২৮ ডিসেম্বর, ২০২৪', emoji: '📜', excerpt: 'বাংলার মসলার ব্যবহার শত বছরের পুরোনো। আমাদের রন্ধনশৈলী কীভাবে বিশ্বমঞ্চে স্থান পেয়েছে তার গল্প।' },
];

const CAT_COLORS: Record<string, string> = {
  'স্বাস্থ্য': 'bg-green-50 text-green-700',
  'মসলা': 'bg-amber-50 text-amber-700',
  'পণ্য': 'bg-blue-50 text-blue-700',
  'রেসিপি': 'bg-orange-50 text-orange-700',
  'টিপস': 'bg-purple-50 text-purple-700',
  'সংস্কৃতি': 'bg-teal-50 text-teal-700',
};

export default function BlogPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>ব্লগ</h1>
          <p className="text-gray-500" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>রান্নার টিপস, রেসিপি ও মসলার গল্প</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {POSTS.map((post) => (
            <div key={post.slug} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
              <div className="h-40 bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] flex items-center justify-center text-6xl">
                {post.emoji}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CAT_COLORS[post.category] ?? 'bg-gray-50 text-gray-600'}`} style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
                    {post.category}
                  </span>
                  <span className="text-gray-400 text-[11px]" style={{fontFamily:'Manrope,sans-serif'}}>{post.date}</span>
                </div>
                <h2 className="font-bold text-gray-900 text-[15px] mb-2 leading-snug" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>{post.title}</h2>
                <p className="text-gray-500 text-[13px] leading-relaxed flex-1 mb-4" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>{post.excerpt}</p>
                <span className="text-[#0f4c2a] font-semibold text-sm self-start hover:underline cursor-pointer" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
                  পড়ুন →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
