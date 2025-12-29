
import { AdminUserProvider } from './AdminUserProvider';

export default function AdminLayout({ children }) {
  // Static export cannot use cookies() or perform server-side auth checks at runtime.
  // We pass null as the initial user and let the Client Component (AdminUserProvider)
  // restore the session from localStorage or client-side cookies.

  return (
    <AdminUserProvider user={null}>
      {children}
    </AdminUserProvider>
  );
} 