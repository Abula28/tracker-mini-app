import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import Header from "@/components/common/Header";
export const metadata: Metadata = {
  title: "Tracker Mini App",
  description: "Tracker Mini App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Header />
          <div className="max-w-7xl mx-auto lg:px-0 px-4">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
