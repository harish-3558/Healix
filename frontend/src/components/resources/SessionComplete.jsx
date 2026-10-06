import { useEffect, useRef } from "react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { CheckCircle, ArrowLeft, RotateCcw } from "lucide-react"
import api from "@/lib/api"

const affirmations = [
    "You are worthy of peace and calm.",
    "Every breath you take is a step toward healing.",
    "You showed up for yourself today — that matters.",
    "Stillness is not emptiness; it is fullness of presence.",
    "You are enough, just as you are.",
    "Let go of what you cannot control.",
    "This moment of peace is a gift you gave yourself.",
    "You carry light within you, even on the darkest days.",
]

export default function SessionComplete({
    title = "Session Complete",
    onRestart,
    // Activity logging props
    activityType,   // 'meditation' | 'exercise' | 'strategy'
    activityName,   // e.g. "Guided Breathing"
    activitySlug,   // e.g. "guided-breathing"
    duration,       // in seconds
}) {
    const navigate = useNavigate()
    const affirmation = affirmations[Math.floor(Math.random() * affirmations.length)]
    const loggedRef = useRef(false)

    // Log activity to backend on mount
    useEffect(() => {
        if (loggedRef.current) return
        if (!activityType || !activityName || !activitySlug) return

        loggedRef.current = true
        api.post("/activity", {
            type: activityType,
            name: activityName,
            slug: activitySlug,
            duration: duration || 0,
        }).catch(err => {
            console.error("Failed to log activity:", err)
        })
    }, [activityType, activityName, activitySlug, duration])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl"
        >
            <div className="text-center max-w-md px-6">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
                    className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8"
                >
                    <CheckCircle className="w-12 h-12 text-primary" />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-3xl font-serif text-foreground mb-4"
                >
                    {title}
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-lg text-muted-foreground font-light italic leading-relaxed mb-10"
                >
                    "{affirmation}"
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                    {onRestart && (
                        <Button
                            onClick={onRestart}
                            variant="outline"
                            className="rounded-full px-8 py-6 border-primary/20 hover:bg-primary/5 text-foreground"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Restart
                        </Button>
                    )}
                    <Button
                        onClick={() => navigate("/resources")}
                        className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Resources
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    )
}
