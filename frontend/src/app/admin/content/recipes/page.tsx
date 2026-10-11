'use client';

import { useQuery } from '@tanstack/react-query';
import { ChefHat, ExternalLink } from 'lucide-react';
import { PageHeader, EmptyState, LoadingState } from '@/components/admin/ui';
import Link from 'next/link';

export default function RecipesPage() {
  const { isLoading } = useQuery({
    queryKey: ['admin', 'recipes-stub'],
    queryFn: async () => null,
    enabled: false,
  });

  return (
    <div className="space-y-5">
      <PageHeader title="Recipes" description="Cooking recipe content management." />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <ChefHat className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="font-bold text-gray-800 text-lg mb-2">Recipe Management</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
          Recipe content management will be available in a future update. Recipes allow you to create
          engaging cooking content that links to your spice products.
        </p>
        <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 text-sm font-semibold px-4 py-2.5 rounded-xl">
          <ChefHat className="w-4 h-4" />
          Coming in next update
        </div>
        <div className="mt-4">
          <Link href="/admin/content/blog" className="text-sm text-orange-500 hover:underline inline-flex items-center gap-1">
            <ExternalLink className="w-3.5 h-3.5" /> Use Blog for recipe content →
          </Link>
        </div>
      </div>
    </div>
  );
}