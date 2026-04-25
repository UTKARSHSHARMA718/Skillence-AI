import Navbar from "@/common/components/Navbar";
import { Sidebar } from "@/modules/candidate/dashboard/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-[#eef2f7] to-[#e6ecf5]">
      <Sidebar className="w-2xs flex-shrink-0" />

      <div className="flex flex-col flex-1 min-h-0">
        <Navbar />

        <main className="flex-1 min-h-0 flex flex-col">{children}</main>
      </div>
    </div>
  );
}
