import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Pause, Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import SessionComplete from "./SessionComplete"

const CIRCLE_RADIUS = 110
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS

export default function BreathingTimer({
    pattern = [
        { label: "Breathe In", duration: 4 },
        { label: "Hold", duration: 4 },
        { label: "Breathe Out", duration: 6 },
        { label: "Hold", duration: 2 },
    ],
    totalDuration = 300, // seconds (5 min default)
    title = "Guided Breathing",
    onClose,
    darkMode = false,
    // Activity tracking props
    activityType = "meditation",
    activitySlug = "guided-breathing",
}) {
    const [isRunning, setIsRunning] = useState(true)
    const [elapsed, setElapsed] = useState(0)
    const [phaseIndex, setPhaseIndex] = useState(0)
    const [phaseElapsed, setPhasElapsed] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const intervalRef = useRef(null)

    const currentPhase = pattern[phaseIndex]
    const phaseRemaining = currentPhase.duration - phaseElapsed
    const totalRemaining = totalDuration - elapsed
    const progressPercent = elapsed / totalDuration

    const phaseProgress = phaseElapsed / currentPhase.duration

    const cleanup = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }, [])

    useEffect(() => {
        if (!isRunning || isComplete) {
            cleanup()
            return
        }

        intervalRef.current = setInterval(() => {
            setElapsed(prev => {
                const next = prev + 1
                if (next >= totalDuration) {
                    setIsComplete(true)
                    cleanup()
                    return totalDuration
                }
                return next
            })

            setPhasElapsed(prev => {
                const next = prev + 1
                if (next >= currentPhase.duration) {
                    setPhaseIndex(pi => (pi + 1) % pattern.length)
                    return 0
                }
                return next
            })
        }, 1000)

        return cleanup
    }, [isRunning, isComplete, currentPhase.duration, pattern.length, totalDuration, cleanup])

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s.toString().padStart(2, "0")}`
    }

    const handleRestart = () => {
        setElapsed(0)
        setPhaseIndex(0)
        setPhasElapsed(0)
        setIsComplete(false)
        setIsRunning(true)
    }

    if (isComplete) {
        return (
            <SessionComplete
                title="Session Complete"
                onRestart={handleRestart}
                activityType={activityType}
                activityName={title}
                activitySlug={activitySlug}
                duration={totalDuration}
            />
        )
    }

    const getScale = () => {
        const label = currentPhase.label.toLowerCase()
        if (label.includes("in") || label === "breathe in") {
            return 1 + phaseProgress * 0.3
        } else if (label.includes("out") || label === "breathe out") {
            return 1.3 - phaseProgress * 0.3
        }
        const prevPhase = pattern[(phaseIndex - 1 + pattern.length) % pattern.length]
        return prevPhase.label.toLowerCase().includes("in") ? 1.3 : 1
    }

    const strokeDashoffset = CIRCUMFERENCE * (1 - phaseProgress)

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${darkMode
                ? "bg-[hsl(220,30%,6%)] text-[hsl(210,25%,92%)]"
                : "bg-background/98 backdrop-blur-xl"
                }`}
        >
            <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="absolute top-6 right-6 rounded-full w-12 h-12 text-muted-foreground hover:text-foreground"
            >
                <X className="w-5 h-5" />
            </Button>

            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-serif text-foreground/80 mb-2"
                style={darkMode ? { color: "hsl(210,25%,80%)" } : {}}
            >
                {title}
            </motion.h2>

            <p className="text-sm text-muted-foreground mb-10 tabular-nums">
                {formatTime(totalRemaining)} remaining
            </p>

            <div className="relative flex items-center justify-center mb-12">
                <svg width="260" height="260" className="absolute">
                    <circle
                        cx="130"
                        cy="130"
                        r={CIRCLE_RADIUS}
                        fill="none"
                        stroke={darkMode ? "hsl(215,25%,15%)" : "hsl(214,25%,92%)"}
                        strokeWidth="4"
                    />
                    <motion.circle
                        cx="130"
                        cy="130"
                        r={CIRCLE_RADIUS}
                        fill="none"
                        stroke={darkMode ? "hsl(200,80%,65%)" : "hsl(210,85%,70%)"}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90 130 130)"
                        style={{ transition: "stroke-dashoffset 0.3s ease" }}
                    />
                </svg>

                <motion.div
                    animate={{ scale: getScale() }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className={`w-40 h-40 rounded-full flex items-center justify-center ${darkMode
                        ? "bg-[hsl(200,60%,15%)] shadow-[0_0_60px_hsl(200,80%,50%,0.15)]"
                        : "bg-primary/10 shadow-[0_0_60px_hsl(210,85%,70%,0.15)]"
                        }`}
                >
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={currentPhase.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                            className={`text-lg font-medium text-center px-2 ${darkMode ? "text-[hsl(200,80%,75%)]" : "text-primary"
                                }`}
                        >
                            {currentPhase.label}
                        </motion.span>
                    </AnimatePresence>
                </motion.div>
            </div>

            <motion.div
                key={phaseRemaining}
                initial={{ opacity: 0.6, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-5xl font-light tabular-nums mb-10"
                style={darkMode ? { color: "hsl(210,25%,85%)" } : {}}
            >
                {phaseRemaining}
            </motion.div>

            <Button
                onClick={() => setIsRunning(prev => !prev)}
                variant="outline"
                className={`rounded-full px-10 py-6 text-base font-medium transition-all ${darkMode
                    ? "border-[hsl(215,25%,22%)] bg-[hsl(220,30%,11%)] text-[hsl(210,25%,85%)] hover:bg-[hsl(220,30%,15%)]"
                    : "border-primary/20 hover:bg-primary/5"
                    }`}
            >
                {isRunning ? (
                    <>
                        <Pause className="w-4 h-4 mr-2" /> Pause
                    </>
                ) : (
                    <>
                        <Play className="w-4 h-4 mr-2" /> Resume
                    </>
                )}
            </Button>

            <div className="absolute bottom-6 left-6 right-6">
                <div className={`h-1 rounded-full overflow-hidden ${darkMode ? "bg-[hsl(215,25%,15%)]" : "bg-muted"}`}>
                    <motion.div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${progressPercent * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center tabular-nums">
                    {Math.round(progressPercent * 100)}% complete
                </p>
            </div>
        </motion.div>
    )
}
