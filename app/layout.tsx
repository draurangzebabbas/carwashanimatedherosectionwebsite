import './globals.css';
export const metadata = { title: 'Sparkle — Premium Car Wash', description: 'Book your premium car wash service online' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
