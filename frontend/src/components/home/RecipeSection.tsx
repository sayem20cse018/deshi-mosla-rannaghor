import Link from 'next/link';
import { ArrowRight, ChefHat } from 'lucide-react';

const RECIPES = [
  { slug: 'biryani', name: 'বিরিয়ানি', emoji: '🍛' },
  { slug: 'fish-curry', name: 'মাছের ঝোল', emoji: '🐟' },
  { slug: 'beef-curry', name: 'গরুর মাংস', emoji: '🥩' },
  { slug: 'khichuri', name: 'খিচুড়ি', emoji: '🍲' },
  { slug: 'bhorta', name: 'ভর্তা', emoji: '🌿' },
  { slug: 'ramadan', name: 'রমজান রান্না', emoji: '🌙' },
];

export function RecipeSection() {
  return (
    <section className="py-10 bg-brand-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-brand-700" />
              <h2 className="section-title">আজ কী রান্না করবেন?</h2>
            </div>
            <p className="section-subtitle">রেসিপি বেছে নিন, প্রয়োজনীয় সব উপকরণ এক ক্লিকে কার্টে যোগ করুন</p>
          </div>
          <Link href="/recipes" className="flex items-center gap-1 text-brand-700 hover:text-brand-800 text-sm font-medium">
            সব রেসিপি <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {RECIPES.map((recipe) => (
            <Link
              key={recipe.slug}
              href={`/recipes/${recipe.slug}`}
              className="group flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-brand-100 hover:border-brand-400 hover:shadow-md transition-all text-center"
            >
              <div className="text-4xl group-hover:scale-110 transition-transform">
                {recipe.emoji}
              </div>
              <p className="text-sm font-medium text-gray-700">{recipe.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
