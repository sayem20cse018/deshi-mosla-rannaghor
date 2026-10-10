import { redirect } from 'next/navigation';

// Root redirects to the (shop) group homepage
export default function RootPage() {
  redirect('/');
}
