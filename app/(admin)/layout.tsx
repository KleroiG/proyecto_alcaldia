// app/(admin)/vista_admin/layout.tsx
import { AdminLayoutShell } from "../(admin)/admin-layout-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}