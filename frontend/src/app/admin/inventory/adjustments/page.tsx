'use client';

// Redirect to main inventory page where adjustments happen inline
import { redirect } from 'next/navigation';
export default function AdjustmentsPage() {
  redirect('/admin/inventory');
}
