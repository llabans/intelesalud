export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(8,145,178,0.14),transparent_28%),linear-gradient(180deg,#f7fbfd_0%,#eef4f7_100%)]">
      {children}
    </div>
  );
}
