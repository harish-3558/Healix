import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'

const paths = [
  {
    feeling: 'I want to reduce anxiety',
    description: 'Breathe easier with daily check-ins, guided meditations, and a calm AI companion by your side.',
    cta: 'Start here',
    href: '/chatbot',
    accent: 'from-primary/20 to-secondary/10',
    number: '01',
  },
  {
    feeling: 'I want to talk to someone',
    description: "You don't have to navigate this alone. Connect with a peer or book a professional session now.",
    cta: 'Connect',
    href: '/community',
    accent: 'from-secondary/40 to-primary/10',
    number: '02',
  },
  {
    feeling: 'I just want to explore',
    description: 'No pressure. Browse resources, read stories, and find what resonates at your own pace.',
    cta: 'Browse',
    href: '/resources',
    accent: 'from-accent/60 to-secondary/20',
    number: '03',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 90, damping: 18 },
  },
}

export default function PersonalizedPaths() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-32 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center space-y-3"
        >
          <h2 className="text-5xl md:text-8xl font-serif text-foreground tracking-tight leading-none">
            What brings you <span className="italic text-primary">here today?</span>
          </h2>
        </motion.div>

        {/* Path cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {paths.map((path, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02, transition: { type: 'spring', stiffness: 200, damping: 18 } }}
              className="group relative overflow-hidden rounded-[3rem] cursor-pointer"
            >
              {/* Background gradient layer */}
              <div className={`absolute inset-0 bg-linear-to-br ${path.accent} transition-opacity duration-500 opacity-80 group-hover:opacity-100`} />
              {/* White base */}
              <div className="absolute inset-0 bg-white/60 group-hover:bg-white/80 transition-colors duration-500" />

              {/* Spotlight glow */}
              <div className="absolute -inset-4 bg-linear-to-br from-primary/20 to-transparent opacity-40 group-hover:opacity-100 blur-2xl transition-opacity duration-700" />

              <div className="relative z-10 p-10 flex flex-col justify-between h-full min-h-[360px] space-y-8">
                {/* Number */}
                <span className="text-6xl font-serif italic text-primary/20 group-hover:text-primary/40 transition-colors duration-500 leading-none">
                  {path.number}
                </span>

                {/* Text content */}
                <div className="space-y-5 flex-1 flex flex-col justify-end">
                  <h3 className="text-3xl font-serif text-foreground leading-tight group-hover:translate-x-1 transition-transform duration-500">
                    {path.feeling}
                  </h3>
                  <p className="text-muted-foreground font-light leading-relaxed text-base">
                    {path.description}
                  </p>
                  <div className="pt-2">
                    <Button asChild size="default" variant="default" className="rounded-full group-hover:shadow-md group-hover:shadow-primary/20 transition-shadow duration-500">
                      <Link to={path.href}>
                        {path.cta} →
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
