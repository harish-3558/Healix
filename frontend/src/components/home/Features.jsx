import { Card } from '@/components/ui/card'
import { motion } from 'motion/react'

export default function Features() {
    const features = [
        { title: "Odyssey AI", description: "Talk to our AI about your feelings and get instant support and suggestions" },
        { title: "Self-Assessment", description: "Understand your mental health with our guided wellness questionnaire" },
        { title: "Resources", description: "Access meditation guides, breathing exercises, and coping strategies" },
        { title: "Community Wall", description: "Connect with peers anonymously and share your journey" },
        { title: "Counseling", description: "Request sessions with professional mental health counselors" },
        { title: "Emergency Help", description: "Quick access to crisis hotlines and emergency resources" },
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            }
        }
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 80,
                damping: 20
            }
        }
    }

    return (
        <section className="px-4 sm:px-6 lg:px-8 py-32 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-24 space-y-4"
                >
                    <h2 className="text-5xl md:text-8xl font-serif text-foreground tracking-tight text-center leading-none">
                        Our <span className="italic text-primary">Focus</span> Areas
                    </h2>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div key={index} variants={cardVariants}>
                            <Card
                                className="group relative h-80 p-10 bg-secondary/10 border-none rounded-[3rem] overflow-hidden transition-all duration-700 ease-out hover:bg-white hover:shadow-2xl hover:shadow-primary/5"
                            >
                                {/* Animated Background Blur (The Spotlight) */}
                                <div className="absolute -inset-2 bg-linear-to-br from-primary/30 to-transparent opacity-100 group-hover:opacity-40 blur-2xl transition-opacity duration-700" />

                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    {/* Top: Index/Numbering */}
                                    <span className="text-6xl font-serif italic text-primary transition-colors duration-500">
                                        0{index + 1}
                                    </span>

                                    {/* Bottom: Typography Content */}
                                    <div className="space-y-6">
                                        <h3 className="text-4xl font-serif text-foreground leading-none group-hover:translate-x-2 transition-transform duration-500">
                                            {feature.title}
                                        </h3>
                                        <p className="text-muted-foreground group-hover:text-foreground/80 font-light leading-relaxed transition-colors duration-500 text-lg">
                                            {feature.description}
                                        </p>
                                    </div>

                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
