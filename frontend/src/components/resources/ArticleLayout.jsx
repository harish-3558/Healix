import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { ArrowLeft, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"

export default function ArticleLayout({ title, subtitle, readingTime, children }) {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 max-w-3xl mx-auto w-full mt-32">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Button
                        onClick={() => navigate("/resources")}
                        variant="ghost"
                        className="rounded-full mb-6 text-muted-foreground hover:text-foreground -ml-2"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Resources
                    </Button>
                </motion.div>

                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <header className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-4 leading-tight">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-xl text-muted-foreground font-light leading-relaxed mb-4">
                                {subtitle}
                            </p>
                        )}
                        {readingTime && (
                            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full bg-primary/5 text-primary border border-primary/10">
                                <Clock className="w-3 h-3 stroke-[3]" />
                                {readingTime} min read
                            </div>
                        )}
                    </header>

                    <div className="prose prose-lg max-w-none">
                        {children}
                    </div>
                </motion.article>
            </main>
            <Footer />
        </div>
    )
}
