import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'

const steps = [
  {
    number: '01',
    title: 'Chat',
    description: 'Tell our AI how you feel — no judgment, just a calm space to speak freely.',
  },
  {
    number: '02',
    title: 'Assess',
    description: 'Complete a gentle wellness check to understand where you are right now.',
  },
  {
    number: '03',
    title: 'Track',
    description: 'Log daily moods and patterns so you can actually see yourself grow.',
  },
  {
    number: '04',
    title: 'Improve',
    description: 'Explore curated meditations, breathing tools, and guided exercises.',
  },
  {
    number: '05',
    title: 'Support',
    description: 'Connect with peers or book a session with a professional counselor.',
  },
]

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const [hoveredStep, setHoveredStep] = useState(null)
  const [isPaused, setIsPaused] = useState(false)

  // Idle cycling — advances every 2s, pauses when user hovers
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [isPaused])

  // Which step is "displayed" — hover takes priority over idle cycle
  const displayStep = hoveredStep !== null ? hoveredStep : activeStep

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-32 bg-background relative overflow-hidden">
      {/* Soft ambient glow */}
      <div className="absolute inset-0 bg-linear-to-b from-secondary/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="mb-24 text-center"
        >
          <h2 className="text-5xl md:text-8xl font-serif text-foreground tracking-tight leading-none">
            Your Journey <span className="italic text-primary">in 5 Steps</span>
          </h2>
        </motion.div>

        {/* ── Step Tabs Row ── */}
        <div className="relative">
          {/* Base progress track */}
          <div className="hidden md:block absolute top-0 left-0 right-0 h-2 rounded-full bg-primary/10 z-0" />

          {/* Animated fill — covers up to the active step */}
          <motion.div
            className="hidden md:block absolute top-0 left-0 h-2 rounded-full bg-primary z-10 origin-left"
            animate={{ width: `${(displayStep / (steps.length - 1)) * 100}%` }}
            transition={{ type: 'spring', stiffness: 60, damping: 20 }}
          />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-0">
            {steps.map((step, i) => {
              const isActive = i === displayStep
              const isPast = i < displayStep

              return (
                <motion.div
                  key={i}
                  className="relative flex flex-col items-center gap-0 cursor-pointer select-none"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ type: 'spring', stiffness: 80, damping: 20, delay: i * 0.1 }}
                  onMouseEnter={() => { setHoveredStep(i); setIsPaused(true) }}
                  onMouseLeave={() => { setHoveredStep(null); setIsPaused(false) }}
                >

                  {/* Card — fixed height prevents layout shift */}
                  <motion.div
                    animate={{
                      scale: isActive ? 1.02 : 1,
                      boxShadow: isActive
                        ? '0 20px 40px -10px hsl(var(--primary) / 0.15)'
                        : '0 0px 0px 0px transparent',
                    }}
                    transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                    className={`
                      mt-6 w-full p-7 rounded-4xl relative overflow-hidden
                      transition-colors duration-500
                      ${isActive ? 'bg-white' : 'bg-secondary/10 hover:bg-secondary/20'}
                    `}
                  >
                    {/* Active spotlight */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          key="glow"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute -inset-2 bg-linear-to-br from-primary/40 to-transparent blur-2xl pointer-events-none"
                        />
                      )}
                    </AnimatePresence>

                    <div className="relative z-10 space-y-3">
                      {/* Step number + title */}
                      <div className="flex items-baseline gap-2">
                      </div>
                      <motion.h3
                        animate={{ x: isActive ? 2 : 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="text-4xl font-serif text-foreground leading-none"
                      >
                        {step.title}
                      </motion.h3>

                      {/* Description — opacity-only fade, no height change */}
                      <motion.p
                        animate={{ opacity: isActive ? 1 : 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="text-muted-foreground text-sm font-light leading-relaxed mt-12"
                      >
                        {step.description}
                      </motion.p>

                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
