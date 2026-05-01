import Header from '@/components/Header';
import ThemeRegistry from '@/components/ThemeRegistry';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Gym Roster</title>
      </head>
      <body>
        <ThemeRegistry>
          <Header />
          <main>{children}</main>
        </ThemeRegistry>
      </body>
    </html>
  );
}
