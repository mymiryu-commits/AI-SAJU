import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';

function SidebarFallback() {
  return (
    <aside className="sidebar sidebar-desktop w-64 min-h-screen p-4 sticky top-0">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-secondary rounded w-24"></div>
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-10 bg-secondary rounded"></div>
        ))}
      </div>
    </aside>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar - Desktop only */}
        <Suspense fallback={<SidebarFallback />}>
          <Sidebar />
        </Suspense>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
