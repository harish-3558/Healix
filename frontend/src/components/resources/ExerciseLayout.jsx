import Navbar from "@/components/Navbar"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"

export default function ExerciseLayout({ title, subtitle, children }) {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 max-w-4xl mx-auto w-full mt-32">
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

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-10"
                >
                    <h1 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-3">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-lg text-muted-foreground font-light">
                            {subtitle}
                        </p>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    )
}
