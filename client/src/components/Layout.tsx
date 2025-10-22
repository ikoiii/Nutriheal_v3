import { ReactNode } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardFooter from "./DashboardFooter";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader />
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
        {children}
      </main>
      <DashboardFooter />
    </div>
  );
}