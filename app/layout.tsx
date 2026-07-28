import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { auth } from "@/src/auth";

export const metadata: Metadata = {
  title: "DevPulse - GitHub Profile Manager",
  description: "Manage and sync your GitHub profile data",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <Navigation isAuthenticated={isAuthenticated} />
        <main className={`flex-1 min-w-0 ${isAuthenticated ? 'md:pl-20 pb-20 md:pb-0' : 'pt-16'}`}>
          {children}
        </main>
      </body>
    </html>
  );
}
