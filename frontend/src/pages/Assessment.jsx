import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AssessmentComponent from '@/components/assessment/Assessment'

export default function Assessment() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 max-w-4xl mx-auto w-full mt-32">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
                        Mental Wellness <span className="text-primary font-serif italic">Assessment</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Take 5 minutes to understand your current mental health status with our guided questionnaire.
                    </p>
                </div>
                <AssessmentComponent />
            </main>
        </div>
    )
}
