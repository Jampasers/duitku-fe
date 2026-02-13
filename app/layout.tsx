import "./globals.css";

export const metadata = {
  title: "QRIS Payment Demo",
  description: "Duitku QRIS dynamic-only demo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
