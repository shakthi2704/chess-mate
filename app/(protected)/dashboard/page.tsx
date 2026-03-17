import DashboardNav from '@/components/dashboard/DashboardNav'
import DashboardTopbar from '@/components/dashboard/DashboardTopbar'
import QuickPlay from '@/components/dashboard/QuickPlay'
import RecentGames from '@/components/dashboard/RecentGames'
import StatsPanel from '@/components/dashboard/StatsPanel'


export default function DDashboardpage() {
  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#e7e5e4]">

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-48 left-1/2 -translate-x-1/2 w-[600px] h-[500px]"
          style={{ background: 'radial-gradient(ellipse at center,rgba(245,158,11,0.08) 0%,transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px]"
          style={{ background: 'radial-gradient(ellipse at center,rgba(217,119,6,0.05) 0%,transparent 70%)' }}
        />
      </div>

      {/* Navbar */}
      <DashboardNav />

      {/* Main content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">

        {/* Welcome bar — full width */}
        <div className="mb-6">
          <DashboardTopbar />
        </div>

        {/* Middle row — Quick Play + Stats side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <QuickPlay />
          <StatsPanel />
        </div>

        {/* Recent games — full width */}
        <RecentGames />
      </main>
    </div>
  )
}
