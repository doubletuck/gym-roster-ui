import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
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
        <AppRouterCacheProvider>
          <ThemeRegistry>
            <Header />
            <main>{children}</main>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
