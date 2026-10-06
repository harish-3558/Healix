import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Pause, Play, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import SessionComplete from "./SessionComplete"

export default function StepCountdown({
    steps = [],
    title = "Exercise",
    onClose,
    autoAdvance = true,
    // Activity tracking props
    activityType = "exercise",
    activitySlug = "",
}) {
    const [currentStep, setCurrentStep] = useState(0)
    const [timeLeft, setTimeLeft] = useState(steps[0]?.duration || 10)
    const [isRunning, setIsRunning] = useState(true)
    const [isComplete, setIsComplete] = useState(false)
    const intervalRef = useRef(null)

    const step = steps[currentStep]
    const totalSteps = steps.length
    const progress = (currentStep / totalSteps) * 100
    const totalDuration = steps.reduce((sum, s) => sum + (s.duration || 0), 0)

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
            setTimeLeft(prev => {
                if (prev <= 1) {
                    if (currentStep >= totalSteps - 1) {
                        setIsComplete(true)
                        cleanup()
                        return 0
                    }
                    if (autoAdvance) {
                        setCurrentStep(s => s + 1)
                        return steps[currentStep + 1]?.duration || 10
                    }
                    setIsRunning(false)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return cleanup
    }, [isRunning, isComplete, currentStep, totalSteps, autoAdvance, steps, cleanup])

    const goNext = () => {
        if (currentStep >= totalSteps - 1) {
            setIsComplete(true)
            return
        }
        setCurrentStep(s => s + 1)
        setTimeLeft(steps[currentStep + 1]?.duration || 10)
        setIsRunning(true)
    }

    const handleRestart = () => {
        setCurrentStep(0)
        setTimeLeft(steps[0]?.duration || 10)
        setIsComplete(false)
        setIsRunning(true)
    }

    if (isComplete) {
        return (
            <SessionComplete
                title="Exercise Complete"
                onRestart={handleRestart}
                activityType={activityType}
                activityName={title}
                activitySlug={activitySlug}
                duration={totalDuration}
            />
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/98 backdrop-blur-xl"
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
                className="text-2xl font-serif text-foreground/80 mb-6"
            >
                {title}
            </motion.h2>

            <div className="flex items-center gap-2 mb-10">
                {steps.map((_, i) => (
                    <div
                        key={i}
                        className={`h-2 rounded-full transition-all duration-500 ${i === currentStep
                            ? "w-10 bg-primary"
                            : i < currentStep
                                ? "w-6 bg-primary/40"
                                : "w-6 bg-muted"
                            }`}
                    />
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center mb-10 max-w-lg px-6"
                >
                    {step?.icon && (() => {
                        const StepIcon = step.icon; return (
                            <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <StepIcon className="w-7 h-7 text-primary" />
                            </div>
                        )
                    })()}
                    <h3 className="text-3xl font-serif text-foreground mb-3">
                        {step?.title}
                    </h3>
                    <p className="text-lg text-muted-foreground font-light leading-relaxed">
                        {step?.instruction}
                    </p>
                </motion.div>
            </AnimatePresence>

            <motion.div
                key={timeLeft}
                initial={{ opacity: 0.6, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-6xl font-light tabular-nums text-foreground mb-10"
            >
                {timeLeft}
            </motion.div>

            <p className="text-sm text-muted-foreground mb-6">
                Step {currentStep + 1} of {totalSteps}
            </p>

            <div className="flex gap-3">
                <Button
                    onClick={() => setIsRunning(prev => !prev)}
                    variant="outline"
                    className="rounded-full px-8 py-6 border-primary/20 hover:bg-primary/5"
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
                {!autoAdvance && !isRunning && timeLeft === 0 && (
                    <Button
                        onClick={goNext}
                        className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        Next <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                )}
            </div>

            <div className="absolute bottom-6 left-6 right-6">
                <div className="h-1 rounded-full overflow-hidden bg-muted">
                    <motion.div
                        className="h-full rounded-full bg-primary"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                    {Math.round(progress)}% complete
                </p>
            </div>
        </motion.div>
    )
}
