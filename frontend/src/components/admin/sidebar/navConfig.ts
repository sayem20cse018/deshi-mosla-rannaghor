import {
  LayoutDashboard,
  Package, Grid3X3, Layers, Award, Hash, Image,
  ShoppingCart, Clock, CheckCircle, Truck, XCircle,
  RotateCcw, RefreshCw, AlertCircle,
  Users, Star, Heart,
  Boxes, TrendingDown, ClipboardList, History,
  Percent, Gift, Megaphone, ImageIcon, Mail,
  Home, FileText, ChefHat, BookOpen, MessageSquare, HelpCircle,
  Globe, DollarSign, Settings,
  CreditCard, Banknote, Smartphone, Wallet,
  Bell, MessageCircle,
  BarChart3, PieChart, TrendingUp, UserCheck, Archive,
  Cog, Store, Search, ReceiptText, ShoppingBag,
  UserCog, Lock, Activity, Cpu,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label:     string;
  href?:     string;
  icon?:     LucideIcon;
  badge?:    string;
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const ADMIN_NAV: NavSection[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Catalog',
    items: [
      {
        label: 'Products', icon: Package,
        children: [
          { label: 'All Products', href: '/admin/catalog/products' },
          { label: 'Add Product',  href: '/admin/catalog/products/new' },
        ],
      },
      {
        label: 'Categories', icon: Grid3X3,
        children: [
          { label: 'All Categories', href: '/admin/catalog/categories' },
          { label: 'Subcategories',  href: '/admin/catalog/subcategories' },
        ],
      },
      { label: 'Brands',        href: '/admin/catalog/brands',      icon: Award },
      { label: 'Collections',   href: '/admin/catalog/collections', icon: Layers },
      { label: 'Tags',          href: '/admin/catalog/tags',        icon: Hash },
      { label: 'Media Library', href: '/admin/catalog/media',       icon: Image },
    ],
  },
  {
    title: 'Orders',
    items: [
      { label: 'All Orders',  href: '/admin/orders',             icon: ShoppingCart },
      { label: 'Pending',     href: '/admin/orders/pending',     icon: Clock,        badge: 'alert' },
      { label: 'Confirmed',   href: '/admin/orders/confirmed',   icon: CheckCircle },
      { label: 'Processing',  href: '/admin/orders/processing',  icon: RefreshCw },
      { label: 'Shipped',     href: '/admin/orders/shipped',     icon: Truck },
      { label: 'Delivered',   href: '/admin/orders/delivered',   icon: CheckCircle },
      { label: 'Cancelled',   href: '/admin/orders/cancelled',   icon: XCircle },
      { label: 'Returns',     href: '/admin/orders/returns',     icon: RotateCcw },
      { label: 'Refunds',     href: '/admin/orders/refunds',     icon: AlertCircle },
    ],
  },
  {
    title: 'Customers',
    items: [
      { label: 'Customers', href: '/admin/customers',          icon: Users },
      { label: 'Reviews',   href: '/admin/customers/reviews',  icon: Star },
      { label: 'Wishlist',  href: '/admin/customers/wishlist', icon: Heart },
    ],
  },
  {
    title: 'Inventory',
    items: [
      { label: 'Stock',       href: '/admin/inventory',              icon: Boxes },
      { label: 'Low Stock',   href: '/admin/inventory/low-stock',    icon: TrendingDown, badge: 'alert' },
      { label: 'Adjustments', href: '/admin/inventory/adjustments',  icon: ClipboardList },
      { label: 'History',     href: '/admin/inventory/history',      icon: History },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { label: 'Coupons',    href: '/admin/marketing/coupons',     icon: Percent },
      { label: 'Offers',     href: '/admin/marketing/offers',      icon: Gift },
      { label: 'Promotions', href: '/admin/marketing/promotions',  icon: Megaphone },
      { label: 'Banners',    href: '/admin/marketing/banners',     icon: ImageIcon },
      { label: 'Newsletter', href: '/admin/marketing/newsletter',  icon: Mail },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Homepage',     href: '/admin/content/homepage',     icon: Home },
      { label: 'Pages',        href: '/admin/content/pages',        icon: FileText },
      { label: 'Recipes',      href: '/admin/content/recipes',      icon: ChefHat },
      { label: 'Blog',         href: '/admin/content/blog',         icon: BookOpen },
      { label: 'Testimonials', href: '/admin/content/testimonials', icon: MessageSquare },
      { label: 'FAQs',         href: '/admin/content/faqs',         icon: HelpCircle },
    ],
  },
  {
    title: 'Delivery',
    items: [
      { label: 'Providers', href: '/admin/delivery/providers', icon: Truck },
      { label: 'Zones',     href: '/admin/delivery/zones',     icon: Globe },
      { label: 'Charges',   href: '/admin/delivery/charges',   icon: DollarSign },
      { label: 'Settings',  href: '/admin/delivery/settings',  icon: Settings },
    ],
  },
  {
    title: 'Payments',
    items: [
      { label: 'Transactions', href: '/admin/payments/transactions', icon: CreditCard },
      { label: 'COD',          href: '/admin/payments/cod',          icon: Banknote },
      { label: 'Online Pay',   href: '/admin/payments/online',       icon: Smartphone },
      { label: 'Settings',     href: '/admin/payments/settings',     icon: Wallet },
    ],
  },
  {
    title: 'Notifications',
    items: [
      { label: 'Notifications',   href: '/admin/notifications',                 icon: Bell },
      { label: 'Email Templates', href: '/admin/notifications/email-templates', icon: Mail },
      { label: 'SMS Templates',   href: '/admin/notifications/sms-templates',   icon: MessageCircle },
    ],
  },
  {
    title: 'Reports',
    items: [
      { label: 'Sales',     href: '/admin/reports/sales',     icon: TrendingUp },
      { label: 'Orders',    href: '/admin/reports/orders',    icon: BarChart3 },
      { label: 'Products',  href: '/admin/reports/products',  icon: PieChart },
      { label: 'Customers', href: '/admin/reports/customers', icon: UserCheck },
      { label: 'Inventory', href: '/admin/reports/inventory', icon: Archive },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'General',       href: '/admin/settings',                  icon: Cog },
      { label: 'Store',         href: '/admin/settings/store',            icon: Store },
      { label: 'SEO',           href: '/admin/settings/seo',              icon: Search },
      { label: 'Tax',           href: '/admin/settings/tax',              icon: ReceiptText },
      { label: 'Checkout',      href: '/admin/settings/checkout',         icon: ShoppingBag },
      { label: 'Payment',       href: '/admin/settings/payment',          icon: CreditCard },
      { label: 'Notifications', href: '/admin/settings/notifications',    icon: Bell },
    ],
  },
  {
    title: 'Administration',
    items: [
      { label: 'Admin Users',   href: '/admin/administration/users',    icon: UserCog },
      { label: 'Roles',         href: '/admin/administration/roles',    icon: Lock },
      { label: 'Activity Logs', href: '/admin/administration/activity', icon: Activity },
      { label: 'System Health', href: '/admin/administration/system',   icon: Cpu },
    ],
  },
];
