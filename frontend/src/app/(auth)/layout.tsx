// Auth pages don't use the shop layout (no header/footer/cart drawer)
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
