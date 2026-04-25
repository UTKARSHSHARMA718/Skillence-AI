import Navbar from "@/common/components/Navbar";
import { Sidebar } from "@/modules/admin/dashboard/components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      <Sidebar className="w-2xs shrink-0" />

      <div className="flex flex-col flex-1 min-h-0">
        <Navbar />

        <main className="flex-1 min-h-0 flex flex-col overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
