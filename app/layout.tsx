import "bootstrap/dist/css/bootstrap.min.css"; 
import "../src/assets/sass/style.scss"; 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="min-vh-100 d-flex flex-column antialiased" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}