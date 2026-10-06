import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'
import { motion } from 'motion/react'

export default function Hero() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        }
    }

    return (
        <section className="relative mt-20 px-4 sm:px-6 lg:px-8 py-20 min-h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Background Image Container */}
            <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 z-0 p-4 sm:p-12 pointer-events-none"
            >
                <div className="relative w-full h-full rounded-4xl overflow-hidden opacity-80">
                    <img
                        src="/bg1.jpg"
                        alt="Background"
                        className="w-full h-full object-zoom brightness-110"
                    />
                    {/* Seamless Blur Fade Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-background via-background/10 to-transparent backdrop-blur-[1px]" />
                    <div className="absolute inset-x-0 bottom-0 h-50 bg-linear-to-t from-background to-transparent" />
                </div>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative max-w-5xl mx-auto z-10 text-center space-y-8"
            >
                <div className="space-y-12">
                    {/* Badge */}
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white backdrop-blur-sm rounded-full px-5 py-2 shadow-sm border border-black/5">
                        <span className="text-sm font-light tracking-tight text-primary leading-none">Mental health for everyone</span>
                    </motion.div>

                    {/* Heading */}
                    <div className="space-y-8">
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl md:text-8xl font-serif text-background leading-[0.85] tracking-tight text-shadow-lg"
                        >
                            Seamless Healing, <br />
                            <span className="italic">Happier Mindset</span>
                        </motion.h1>
                        <motion.p
                            variants={itemVariants}
                            className="text-lg text-white max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md"
                        >
                            Our gentle sanctuary ensures a smooth journey towards peace,
                            leaving you satisfied and boosting your mental resilience.
                        </motion.p>
                    </div>

                    {/* CTAs */}
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Button asChild size="lg" variant="default">
                            <Link to="/register">
                                Join Us Today
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link to="/resources">
                                How it Works
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Trusted By Section */}
                    <motion.div variants={itemVariants} className="pt-16 space-y-8">
                        <p className="text-sm uppercase tracking-tight font-semibold text-muted-foreground/50">
                            Trusted by folks worldwide
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}
