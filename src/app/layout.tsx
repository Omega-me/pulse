import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";
import { shadesOfPurple } from "@clerk/themes";
import { Toaster } from "sonner";
import ReactQueryProvider from "@/providers/react-query-provider";
import ReduxProvider from "@/providers/redux-provider";
import LoadingIndicator from "@/components/global/loading-indicator";
import WebsiteNavbar from "@/components/global/navbar/website-navbar";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pulse",
  description: "Automate Dms and comments on instagram",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: shadesOfPurple,
      }}
    >
      <html suppressHydrationWarning lang="en" className="dark">
        <body
          suppressHydrationWarning
          className={cn(jakarta.className, "dark")}
        >
          <ReduxProvider>
            <ReactQueryProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem={false}
                disableTransitionOnChange
              >
                <LoadingIndicator />
                <WebsiteNavbar />
                {children}
                <Toaster theme="dark" />
              </ThemeProvider>
            </ReactQueryProvider>
          </ReduxProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
