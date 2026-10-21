'use client';
import { redirect } from 'next/navigation';

// Redirect to main orders page pre-filtered by status
export default function Page() {
  redirect('/admin/orders?status=RETURNED');
}
