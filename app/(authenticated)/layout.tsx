import Navbar from '../components/Navbar';
import TopBar from '../components/TopBar';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Navbar />
      <main className="flex-1">
        <TopBar />
        {children}
      </main>
    </div>
  );
} 