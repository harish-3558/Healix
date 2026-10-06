import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, AlertCircle, BookOpen, ExternalLink, ShieldAlert, HeartPulse } from "lucide-react"
import { motion } from "motion/react"

export default function EmergencyComponent() {
    const hotlines = [
        { name: "Jeevan Aastha Helpline (Suicide & Emotional Distress)", number: "1800-233-3330", available: "24/7" },
        { name: "Tele-MANAS — National Helpline", text: "Text HOME to 14416", available: "24/7" },
        {
            name: "International Association for Suicide Prevention",
            number: "Find a helpline in your country",
            available: "24/7",
            link: "https://findahelpline.com/countries/in/topics/suicidal-thoughts"
        },
    ]

    const techniques = [
        {
            title: "5-4-3-2-1 Grounding",
            steps: [
                "Name 5 things you see",
                "4 things you can touch",
                "3 things you hear",
                "2 things you smell",
                "1 thing you taste",
            ],
        },
        {
            title: "Box Breathing",
            steps: [
                "Inhale for 4 counts",
                "Hold for 4 counts",
                "Exhale for 4 counts",
                "Hold for 4 counts",
                "Repeat 4-5 times",
            ],
        },
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { 
            opacity: 1, 
            y: 0, 
            transition: { type: "spring", stiffness: 100, damping: 20 }
        }
    }

    return (
        <div className="space-y-12 relative z-10 w-full max-w-5xl mx-auto pb-12">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-destructive/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Header Area */}
            <div className="text-center space-y-2 shrink-0 relative z-10 pt-4">
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="p-8 sm:p-10 bg-destructive/5 backdrop-blur-xl border-destructive/20 rounded-[2.5rem] relative overflow-hidden group">

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <div className="p-5 rounded-4xl bg-white border border-destructive/10 text-destructive shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-500">
                            <AlertCircle className="w-10 h-10" />
                        </div>
                        <div className="flex-1 space-y-2">
                            <h2 className="text-3xl font-serif text-foreground leading-none">If you're in immediate danger</h2>
                            <p className="text-muted-foreground font-light text-lg leading-relaxed">
                                Please call emergency services <strong className="font-semibold text-foreground">(112 in India)</strong> or go to your nearest emergency room immediately.
                            </p>
                        </div>
                        <Button 
                            size="lg" 
                            className="bg-destructive hover:bg-destructive/90 text-destructive rounded-full h-14 px-8 text-lg font-medium transition-all active:scale-95 w-full md:w-auto shrink-0"
                        >
                            <Phone className="w-5 h-5 mr-2" />
                            Call 112
                        </Button>
                    </div>
                </Card>
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                <div className="flex items-center gap-3 mb-8 px-2">
                    <HeartPulse className="w-6 h-6 text-primary" />
                    <h2 className="text-3xl font-serif text-foreground">Crisis Hotlines</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {hotlines.map((hotline, i) => (
                        <motion.div key={i} variants={itemVariants} className="h-full">
                            <Card className="p-8 h-full flex flex-col border-white/40 bg-white/40 backdrop-blur-xl shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 rounded-4xl transition-all duration-500 group">
                                <h3 className="text-xl font-serif text-foreground mb-4 leading-snug group-hover:text-primary transition-colors duration-500">
                                    {hotline.name}
                                </h3>
                                
                                <div className="mt-auto space-y-4 pt-4 border-t border-black/5">
                                    <p className="text-base font-medium text-foreground">
                                        {hotline.link ? (
                                            <a 
                                                href={hotline.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                                            >
                                                {hotline.number} <ExternalLink className="w-4 h-4" />
                                            </a>
                                        ) : (
                                            hotline.number || hotline.text
                                        )}
                                    </p>
                                    <div className="inline-flex">
                                        <span className="text-[10px] uppercase tracking-widest bg-primary/10 text-primary px-3 py-1.5 rounded-full font-bold">
                                            {hotline.available}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pt-8">
                <div className="flex items-center gap-3 mb-8 px-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                    <h2 className="text-3xl font-serif text-foreground">Immediate Coping</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {techniques.map((technique, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <Card className="p-8 border-white/40 bg-white/40 backdrop-blur-xl shadow-sm hover:shadow-xl hover:shadow-primary/5 rounded-[2.5rem] transition-all duration-500">
                                <h3 className="text-2xl font-serif text-foreground mb-6">{technique.title}</h3>
                                <div className="space-y-4">
                                    {technique.steps.map((step, idx) => (
                                        <div key={idx} className="flex gap-4 items-center group cursor-default">
                                            <div className="w-10 h-10 rounded-2xl bg-white border border-black/5 text-primary font-serif text-lg flex items-center justify-center shrink-0 shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                                {idx + 1}
                                            </div>
                                            <p className="text-base text-foreground/80 font-light group-hover:text-foreground transition-colors">
                                                {step}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}