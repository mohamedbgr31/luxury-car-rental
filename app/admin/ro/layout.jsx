
// Static export compatible layout - auth handled by parent AdminUserProvider
export default function AdminRolesLayout({ children }) {
  // Auth is handled by the parent /admin layout via AdminUserProvider
  // which performs client-side authentication checks
  return <>{children}</>;
}
