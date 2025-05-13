import Header from "@/components/Header";
import 'bootstrap/dist/css/bootstrap.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Gym Roster</title>
      </head>
      <body>
        <Header/>
        <main>{children}</main>
      </body>
    </html>
  );
}
