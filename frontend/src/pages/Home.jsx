import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Hero from '@/components/home/Hero'
import Features from '@/components/home/Features'
import HowItWorks from '@/components/home/HowItWorks'
import PersonalizedPaths from '@/components/home/PersonalizedPaths'
import Testimonials from '@/components/home/Testimonials'
import DailyValueCTA from '@/components/home/DailyValueCTA'

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            <main className="flex-1">
                <Hero />
                <Features />
                <HowItWorks />
                <PersonalizedPaths />
                <Testimonials />
                <DailyValueCTA />
            </main>
            <Footer />
        </div>
    )
}
