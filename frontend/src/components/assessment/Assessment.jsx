import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

export default function AssessmentComponent() {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [scores, setScores] = useState([])
    const [showResults, setShowResults] = useState(false)

    const questions = [
        "How frequently do you experience unmanageable stress?",
        "How restful and consistent is your sleep?",
        "Do you feel adequately supported by your personal network?",
        "How often do feelings of anxiety interfere with your day?",
        "How would you rate your current overall well-being?",
        "How effectively are you able to process negative emotions?",
        "Do you rely on constructive habits when feeling overwhelmed?",
        "How consistently do you prioritize time for yourself?",
    ]

    const handleAnswer = (score) => {
        const newScores = [...scores, score]
        setScores(newScores)

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
        } else {
            setShowResults(true)
        }
    }

    const getResultContent = () => {
        const average = scores.reduce((a, b) => a + b, 0) / scores.length
        if (average >= 4) return { 
            status: "Resilient", 
            text: "Your responses indicate a strong foundation of well-being and effective coping strategies. Keep maintaining your current routines." 
        }
        if (average >= 3) return { 
            status: "Stable", 
            text: "You maintain a steady balance, though there is room to strengthen your daily routines and stress management techniques." 
        }
        if (average >= 2) return { 
            status: "Stressed", 
            text: "Your responses suggest you are currently managing a heavy cognitive or emotional load. Utilizing our support resources could be beneficial." 
        }
        return { 
            status: "Overwhelmed", 
            text: "Your scores indicate significant difficulty coping right now. We strongly encourage connecting with our professional resources or counselors." 
        }
    }

    if (showResults) {
        const result = getResultContent()
        
        return (
            <Card className="p-8 sm:p-12 text-center bg-white/40 backdrop-blur-xl border-white/20 shadow-2xl rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 space-y-10"
                >
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">Assessment Complete</p>
                        <h2 className="text-4xl md:text-5xl font-serif text-foreground leading-tight">
                            Your <span className="italic text-primary">Overview</span>
                        </h2>
                    </div>

                    <div className="bg-white/50 border border-black/5 rounded-[2rem] p-10 max-w-lg mx-auto shadow-sm">
                        <p className="text-sm text-muted-foreground mb-4 font-light">Current State</p>
                        <p className="text-4xl font-serif italic text-foreground mb-6">{result.status}</p>
                        <div className="w-12 h-px bg-primary/20 mx-auto mb-6" />
                        <p className="text-muted-foreground font-light leading-relaxed">
                            {result.text}
                        </p>
                    </div>

                    <Button
                        onClick={() => {
                            setCurrentQuestion(0)
                            setScores([])
                            setShowResults(false)
                        }}
                        variant="ghost"
                        className="rounded-full gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Begin Again
                    </Button>
                </motion.div>
            </Card>
        )
    }

    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
        <Card className="p-8 sm:p-12 bg-white/40 backdrop-blur-xl border-white/20 rounded-[2.5rem] relative overflow-hidden min-h-[400px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 space-y-12">
                {/* Progress Header */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs uppercase tracking-wide font-bold text-muted-foreground/50">
                            Reflection {currentQuestion + 1} / {questions.length}
                        </span>
                    </div>
                    <Progress value={progress} className="h-1 bg-primary/30 [&>div]:bg-primary" />
                </div>

                {/* Animated Question */}
                <div className="min-h-[100px] flex items-center">
                    <AnimatePresence mode="wait">
                        <motion.h3
                            key={currentQuestion}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="text-3xl md:text-4xl font-serif text-foreground leading-tight"
                        >
                            {questions[currentQuestion]}
                        </motion.h3>
                    </AnimatePresence>
                </div>
            </div>

            {/* Response Scale */}
            <div className="relative z-10 pt-8 mt-auto">
                <div className="flex justify-between items-center gap-2 sm:gap-4 mb-4">
                    {[1, 2, 3, 4, 5].map((score) => (
                        <button
                            key={score}
                            onClick={() => handleAnswer(score)}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-accent border border-primary/10 flex items-center justify-center text-xl font-serif text-foreground/70 hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300"
                        >
                            {score}
                        </button>
                    ))}
                </div>
                <div className="flex justify-between px-2">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">Rarely</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">Frequently</span>
                </div>
            </div>
        </Card>
    )
}