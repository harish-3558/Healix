import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Play, BookOpen, Sparkles, ArrowRight, Clock } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

export default function ResourcesComponent() {
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate()

    const resources = {
        meditation: [
            { title: "Guided Breathing", duration: "5 min", description: "Calm your mind with deep breathing", slug: "guided-breathing" },
            { title: "Body Scan Meditation", duration: "10 min", description: "Release tension throughout your body", slug: "body-scan" },
            { title: "Loving Kindness", duration: "8 min", description: "Cultivate compassion and self-love", slug: "loving-kindness" },
            { title: "Sleep Meditation", duration: "15 min", description: "Prepare for restful sleep", slug: "sleep-meditation" },
        ],
        exercises: [
            { title: "5-4-3-2-1 Grounding", description: "Sensory grounding technique for anxiety", slug: "5-4-3-2-1-grounding" },
            { title: "Box Breathing", description: "Regulate your nervous system", slug: "box-breathing" },
            { title: "Progressive Muscle Relaxation", description: "Release physical tension", slug: "progressive-muscle-relaxation" },
            { title: "Journaling Prompts", description: "Process emotions through writing", slug: "journaling-prompts" },
        ],
        strategies: [
            { title: "Stress Management", description: "Practical techniques for daily stress", slug: "stress-management" },
            { title: "Sleep Hygiene", description: "Tips for better sleep quality", slug: "sleep-hygiene" },
            { title: "Social Connection", description: "Build meaningful relationships", slug: "social-connection" },
            { title: "Self-Compassion", description: "Treat yourself with kindness", slug: "self-compassion" },
        ],
    }

    const routeMap = {
        meditation: (slug) => `/resources/meditation/${slug}`,
        exercises: (slug) => `/resources/exercises/${slug}`,
        strategies: (slug) => `/resources/strategies/${slug}`,
    }

    const filteredResources = (type) => {
        return resources[type].filter(
            (r) =>
                r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.description.toLowerCase().includes(searchTerm.toLowerCase()),
        )
    }

    const handleCardAction = (tabValue, slug) => {
        navigate(routeMap[tabValue](slug))
    }

    // Animation variants for staggered card loading
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 100, damping: 20 }
        },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
    }

    return (
        <div className="space-y-12 relative z-10 w-full max-w-5xl mx-auto">

            {/* Ambient Background Glow */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Premium Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative max-w-2xl mx-auto"
            >
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                <Input
                    placeholder="Search your sanctuary..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-14 pr-6 h-16 rounded-full bg-white/60 backdrop-blur-xl border-white/40 focus-visible:ring-primary/30 text-lg shadow-sm shadow-black/5"
                />
            </motion.div>

            <Tabs defaultValue="meditation" className="w-full flex flex-col items-center">
                {/* Minimal Pill Tabs */}
                <TabsList className="flex w-auto mx-auto h-auto bg-white/40 backdrop-blur-md border border-white/40 p-1.5 rounded-full shadow-sm mb-12">
                    <TabsTrigger
                        value="meditation"
                        className="rounded-full px-8 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                    >
                        Meditation
                    </TabsTrigger>
                    <TabsTrigger
                        value="exercises"
                        className="rounded-full px-8 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                    >
                        Exercises
                    </TabsTrigger>
                    <TabsTrigger
                        value="strategies"
                        className="rounded-full px-8 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                    >
                        Strategies
                    </TabsTrigger>
                </TabsList>

                {/* Tab Contents mapped dynamically for clean structure */}
                {["meditation", "exercises", "strategies"].map((tabValue) => (
                    <TabsContent key={tabValue} value={tabValue} className="w-full mt-0 outline-none">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredResources(tabValue).map((item, i) => (
                                    <motion.div key={item.title} variants={itemVariants} layout>
                                        <Card
                                            className="h-full p-8 bg-white/40 backdrop-blur-xl border-white/40 hover:shadow-xl hover:shadow-primary/5 rounded-[2.5rem] group overflow-hidden relative transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                                            onClick={() => handleCardAction(tabValue, item.slug)}
                                        >

                                            {/* Subtle Hover Gradient */}
                                            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                                                <div>
                                                    {tabValue === "strategies"}

                                                    <h3 className="text-2xl font-serif text-foreground mb-3 group-hover:translate-x-1 transition-transform duration-500">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-muted-foreground font-light leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between mt-auto">
                                                    {tabValue === "meditation" && (
                                                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full bg-white text-primary shadow-sm border border-black/5">
                                                            <Clock className="w-3 h-3 stroke-3" />
                                                            {item.duration}
                                                        </div>
                                                    )}

                                                    <Button
                                                        size={tabValue === "meditation" ? "icon" : "default"}
                                                        variant={tabValue === "strategies" ? "link" : "default"}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleCardAction(tabValue, item.slug)
                                                        }}
                                                        className={`
                                                            ${tabValue === "meditation" ? "w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary shadow-md active:scale-95 transition-all ml-auto" : ""}
                                                            ${tabValue === "exercises" ? "w-full rounded-full bg-white text-foreground hover:bg-primary hover:text-primary border border-black/5 shadow-sm transition-all font-medium py-6" : ""}
                                                            ${tabValue === "strategies" ? "p-0 text-primary hover:text-primary/80 font-medium ml-auto" : ""}
                                                        `}
                                                    >
                                                        {tabValue === "meditation" && <Play className="w-5 h-5 ml-1" />}
                                                        {tabValue === "exercises" && "Begin Exercise"}
                                                        {tabValue === "strategies" && (
                                                            <span className="flex items-center gap-2">Read Guide <ArrowRight className="w-4 h-4" /></span>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Empty State */}
                            {filteredResources(tabValue).length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full py-12 text-center"
                                >
                                    <p className="text-xl font-serif italic text-muted-foreground">No resources found matching your search.</p>
                                </motion.div>
                            )}
                        </motion.div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}