export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#cfd9df] via-[#e2ebf0] to-[#d6d6f5] px-4">
      {children}
    </div>
  );
}
