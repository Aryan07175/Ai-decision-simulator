import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { DecisionProvider } from "@/context/DecisionContext";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "DecisionAI — What-If Engine for Life Decisions",
  description: "Simulate your life decisions and predict possible outcomes with AI-powered analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DecisionProvider>
          <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </div>
        </DecisionProvider>
      </body>
    </html>
  );
}
