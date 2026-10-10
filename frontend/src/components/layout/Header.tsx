'use client';

import Link from 'next/link';
import { ShoppingCart, Heart, User, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { AnnouncementBar } from '@/components/home/AnnouncementBar';
import { useState } from 'react';

export function Header() {
  const { getItemCount, openCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = getItemCount();

  const navLinks = [
    { href: '/', label: 'হোম' },
    { href: '/shop', label: 'শপ' },
    { href: '/categories', label: 'ক্যাটাগরি' },
    { href: '/offers', label: 'অফার' },
    { href: '/recipes', label: 'রেসিপি' },
    { href: '/about', label: 'আমাদের পরিচয়' },
  ];

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 bg-brand-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">দম</span>
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-brand-800 text-sm leading-tight">দেশি মসলার</p>
                <p className="text-brand-600 text-xs leading-tight">রান্নাঘর</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-brand-700 font-medium text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-sm">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="পণ্য খুঁজুন..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg
                             focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500
                             font-bengali"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link href="/account/wishlist" className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {itemCount > 0 && (
                  <span className="cart-badge">{itemCount > 99 ? '99+' : itemCount}</span>
                )}
              </button>

              {/* Auth */}
              {isAuthenticated ? (
                <Link href="/account" className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors">
                  <User className="w-5 h-5 text-gray-600" />
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="brand" size="sm" className="hidden sm:flex">
                    লগইন
                  </Button>
                </Link>
              )}

              {/* Mobile menu */}
              <button
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-white px-4 py-3 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 py-2 font-medium text-sm border-b border-gray-100 last:border-0"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
