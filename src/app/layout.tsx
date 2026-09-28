import type { Metadata } from "next";
import { Figtree, Baloo_2, Baloo_Thambi_2, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/ui/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GlobalNavbar } from "@/components/ui/GlobalNavbar";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });
const baloo = Baloo_2({ subsets: ["latin"], variable: "--font-baloo" });
const balooThambi = Baloo_Thambi_2({ subsets: ["tamil"], weight: ["400", "500", "600", "700"], variable: "--font-baloo-thambi" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "SparkLearn — AI Education for Tamil Nadu Schools",
  description: "SparkLearn brings AI and technology education to students across Tamil Nadu from Standard 1 to 12, with age-appropriate content powered by hands-on activities and expert guidance.",
  keywords: ["AI education", "Tamil Nadu", "school learning", "Teachable Machine", "Quick Draw", "machine learning"],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className={`${figtree.variable} ${baloo.variable} ${balooThambi.variable} ${jetbrains.variable}`}>
      <body className="bg-spark-bg text-spark-ink font-figtree antialiased">
        <SessionProvider session={session}>
          <GlobalNavbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}