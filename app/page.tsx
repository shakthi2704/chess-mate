import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

import BackgroundGlows from '@/components/landing/BackgroundGlows'
import Ctasection from '@/components/landing/Ctasection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import FooterSection from '@/components/landing/FooterSection'
import { HeroSection } from '@/components/landing/HeroSection'
import LeaderboardSection from '@/components/landing/LeaderboardSection'
import Navbar from '@/components/landing/Navbar'
import StatbarSection from '@/components/landing/StatbarSection'


export default async function HomePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  return (
    <div className="min-h-screen bg-[#0c0c0e] flex flex-col">
      <BackgroundGlows />
      <Navbar />
      <HeroSection />
      <StatbarSection />
      <FeaturesSection />
      <LeaderboardSection />
      <Ctasection />
      <FooterSection />
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  )
}
