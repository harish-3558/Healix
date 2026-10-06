import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Play, Clock, Moon, Sun, Wind, Sparkles, Heart, MoonStar, Footprints, Accessibility, CircleDot, HeartPulse, Hand, Smile, Users, Globe, RotateCcw } from "lucide-react"
import BreathingTimer from "@/components/resources/BreathingTimer"
import StepCountdown from "@/components/resources/StepCountdown"

// ─── Meditation data ────────────────────────────────────

const meditationConfigs = {
    "guided-breathing": {
        title: "Guided Breathing",
        description: "Calm your mind through controlled breathing cycles. Inhale deeply, hold, and release tension with each exhale.",
        icon: Wind,
        pattern: [
            { label: "Breathe In", duration: 4 },
            { label: "Hold", duration: 4 },
            { label: "Breathe Out", duration: 6 },
            { label: "Hold", duration: 2 },
        ],
        durations: [5, 10, 15],
        type: "breathing",
    },
    "body-scan": {
        title: "Body Scan Meditation",
        description: "Progressively bring awareness to each part of your body, releasing tension and finding deep relaxation.",
        icon: Sparkles,
        steps: [
            { title: "Feet", instruction: "Bring your awareness to your feet. Notice any sensations — warmth, tingling, pressure. Breathe into this area and gently release any tension.", icon: Footprints, duration: 10 },
            { title: "Legs", instruction: "Move your attention up to your legs. Feel the weight of them and let any tightness melt away with each breath.", icon: Accessibility, duration: 10 },
            { title: "Stomach", instruction: "Focus on your stomach and lower back. Notice the gentle rise and fall of your abdomen as you breathe naturally.", icon: CircleDot, duration: 10 },
            { title: "Chest", instruction: "Bring awareness to your chest. Feel your heartbeat, your breath flowing naturally. Release any heaviness you might be carrying.", icon: HeartPulse, duration: 10 },
            { title: "Shoulders", instruction: "Notice your shoulders. Let them drop away from your ears. Release all accumulated tension from this area.", icon: Hand, duration: 10 },
            { title: "Face & Head", instruction: "Soften your jaw, relax your forehead, close your eyes gently. Let your entire face become peaceful and calm.", icon: Smile, duration: 10 },
        ],
        type: "step",
    },
    "loving-kindness": {
        title: "Loving Kindness",
        description: "Cultivate compassion for yourself and others through guided affirmations that open your heart.",
        icon: Heart,
        steps: [
            { title: "Self-Love", instruction: "May I be happy. May I be healthy. May I be safe. May I live with ease.", icon: Heart, duration: 12 },
            { title: "Someone You Love", instruction: "May you be happy. May you be healthy. May you be safe. May you live with ease.", icon: HeartPulse, duration: 12 },
            { title: "A Neutral Person", instruction: "May you be happy. May you be free from suffering. May you find peace and joy.", icon: Users, duration: 12 },
            { title: "Someone Difficult", instruction: "May you find happiness. May you be free from suffering. May you find peace.", icon: Hand, duration: 12 },
            { title: "All Beings", instruction: "May all beings everywhere be happy. May all beings be free from suffering. May all beings find peace.", icon: Globe, duration: 12 },
            { title: "Return to Self", instruction: "I am worthy of love and kindness. I extend compassion to myself in this moment and always.", icon: Sparkles, duration: 12 },
        ],
        type: "step",
    },
    "sleep-meditation": {
        title: "Sleep Meditation",
        description: "Prepare your mind and body for deep, restorative sleep with a guided slow-breathing sequence in a serene dark environment.",
        icon: MoonStar,
        pattern: [
            { label: "Breathe In", duration: 4 },
            { label: "Hold", duration: 2 },
            { label: "Breathe Out", duration: 6 },
            { label: "Rest", duration: 3 },
        ],
        durations: [5, 10, 15],
        type: "breathing",
        darkMode: true,
    },
}

// ─── Component ──────────────────────────────────────────

export default function MeditationPage() {
    const { type } = useParams()
    const navigate = useNavigate()
    const [isActive, setIsActive] = useState(false)
    const [selectedDuration, setSelectedDuration] = useState(5)

    const config = meditationConfigs[type]

    if (!config) {
        return (
            <div className="flex flex-col min-h-screen bg-background">
                <Navbar />
                <main className="flex-1 flex items-center justify-center mt-32">
                    <div className="text-center">
                        <h2 className="text-2xl font-serif text-foreground mb-4">Meditation not found</h2>
                        <Button onClick={() => navigate("/resources")} variant="outline" className="rounded-full px-8 py-6">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Resources
                        </Button>
                    </div>
                </main>
            </div>
        )
    }

    // Active session
    if (isActive) {
        if (config.type === "breathing") {
            return (
                <BreathingTimer
                    pattern={config.pattern}
                    totalDuration={selectedDuration * 60}
                    title={config.title}
                    onClose={() => setIsActive(false)}
                    darkMode={config.darkMode || false}
                    activityType="meditation"
                    activitySlug={type}
                />
            )
        }
        if (config.type === "step") {
            return (
                <StepCountdown
                    steps={config.steps}
                    title={config.title}
                    onClose={() => setIsActive(false)}
                    autoAdvance={true}
                    activityType="meditation"
                    activitySlug={type}
                />
            )
        }
    }

    // Landing / Setup screen
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 max-w-3xl mx-auto w-full mt-32">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <Button
                        onClick={() => navigate("/resources")}
                        variant="ghost"
                        className="rounded-full mb-6 text-muted-foreground hover:text-foreground -ml-2"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Resources
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center"
                >
                    {(() => {
                        const Icon = config.icon; return (
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Icon className="w-8 h-8 text-primary" />
                            </div>
                        )
                    })()}
                    <h1 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-4">
                        {config.title}
                    </h1>
                    <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-xl mx-auto mb-10">
                        {config.description}
                    </p>
                </motion.div>

                {/* Duration selector (for breathing types) */}
                {config.durations && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-10"
                    >
                        <p className="text-sm text-muted-foreground text-center mb-4 uppercase tracking-widest font-semibold">
                            Choose Duration
                        </p>
                        <div className="flex justify-center gap-3">
                            {config.durations.map(dur => (
                                <button
                                    key={dur}
                                    onClick={() => setSelectedDuration(dur)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all border ${selectedDuration === dur
                                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                                        : "bg-white/40 text-foreground border-white/40 hover:bg-white/60"
                                        }`}
                                >
                                    <Clock className="w-3.5 h-3.5" />
                                    {dur} min
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Pattern preview */}
                {config.pattern && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="p-8 bg-white/40 backdrop-blur-xl border-white/40 rounded-[2rem] mb-10">
                            <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-5 text-center">
                                Breathing Pattern
                            </p>
                            <div className="flex items-center justify-center gap-3 flex-wrap">
                                {config.pattern.map((p, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="text-center">
                                            <div className="text-2xl font-light text-foreground tabular-nums">{p.duration}s</div>
                                            <div className="text-xs text-muted-foreground mt-1">{p.label}</div>
                                        </div>
                                        {i < config.pattern.length - 1 && (
                                            <div className="w-8 h-px bg-border" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Steps preview (for step types) */}
                {config.steps && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="p-8 bg-white/40 backdrop-blur-xl border-white/40 rounded-[2rem] mb-10">
                            <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-5 text-center">
                                Session Steps
                            </p>
                            <div className="space-y-3">
                                {config.steps.map((s, i) => (
                                    <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-background/50">
                                        {(() => {
                                            const StepIcon = s.icon; return (
                                                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                    <StepIcon className="w-4 h-4 text-primary" />
                                                </div>
                                            )
                                        })()}
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-foreground">{s.title}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground tabular-nums">{s.duration}s</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Dark mode indicator for sleep */}
                {config.darkMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6"
                    >
                        <Moon className="w-4 h-4" />
                        <span>Dark mode will be enabled during the session</span>
                    </motion.div>
                )}

                {/* Start button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                >
                    <Button
                        onClick={() => setIsActive(true)}
                        className="rounded-full px-12 py-7 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-95"
                    >
                        <Play className="w-5 h-5 mr-3" />
                        Begin Session
                    </Button>
                </motion.div>
            </main>
        </div>
    )
}
