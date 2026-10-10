'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const TRENDING = ['সরিষার তেল', 'হলুদ গুঁড়া', 'মিনিকেট চাল', 'সুন্দরবনের মধু', 'বিরিয়ানি মসলা'];

interface SearchBarProps {
  className?: string;
  mobile?: boolean;
}

export function SearchBar({ className, mobile = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('dmr-recent-search');
    if (saved) setRecent(JSON.parse(saved).slice(0, 5));
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function saveRecent(q: string) {
    const updated = [q, ...recent.filter((r) => r !== q)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem('dmr-recent-search', JSON.stringify(updated));
  }

  function handleSearch(q: string) {
    if (!q.trim()) return;
    saveRecent(q.trim());
    setOpen(false);
    setQuery('');
    router.push(`/shop?search=${encodeURIComponent(q.trim())}`);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch(query);
    if (e.key === 'Escape') setOpen(false);
  }

  const showDropdown = open;

  return (
    <div ref={ref} className={cn('relative', className)}>
      <div className={cn(
        'flex items-center gap-2 bg-gray-50 border rounded-xl transition-all duration-200',
        open ? 'border-brand-500 ring-2 ring-brand-100 bg-white' : 'border-gray-200 hover:border-gray-300',
        mobile ? 'px-3 py-2' : 'px-3 py-2.5',
      )}>
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="পণ্য খুঁজুন... (মসলা, চাল, তেল)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none min-w-0"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={() => handleSearch(query)}
          className="bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
        >
          খুঁজুন
        </button>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {recent.length > 0 && (
            <div className="p-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> সম্প্রতি খোঁজা
              </p>
              <div className="flex flex-wrap gap-1.5">
                {recent.map((r) => (
                  <button
                    key={r}
                    onClick={() => handleSearch(r)}
                    className="chip hover:bg-brand-100 transition-colors cursor-pointer"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="p-3 border-t border-gray-50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" /> ট্রেন্ডিং
            </p>
            <div className="flex flex-wrap gap-1.5">
              {TRENDING.map((t) => (
                <button
                  key={t}
                  onClick={() => handleSearch(t)}
                  className="chip bg-spice-50 text-spice-600 border-spice-100 hover:bg-spice-100 transition-colors cursor-pointer"
                >
                  🔥 {t}
                </button>
              ))}
            </div>
          </div>
          {query && (
            <button
              onClick={() => handleSearch(query)}
              className="w-full text-left px-4 py-3 border-t border-gray-50 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-brand-600" />
              <span><strong>"{query}"</strong> খুঁজুন</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
