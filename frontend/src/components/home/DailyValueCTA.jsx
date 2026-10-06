import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function DailyValueCTA() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ type: 'spring', stiffness: 70, damping: 18 }}
          className="relative overflow-hidden rounded-full bg-linear-to-r from-primary/10 via-primary to-primary/10 px-8 py-20 md:px-20 md:py-28 text-center"
        >

          <div className="relative z-10 space-y-8 max-w-3xl mx-auto">

            {/* Main headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 80 }}
              className="text-5xl md:text-8xl font-serif text-white tracking-tight leading-[0.9]"
            >
              Start Today. <br />
              <span className="italic opacity-80">Stay Happy.</span>
            </motion.h2>

            {/* Sub-copy */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-white/70 text-lg font-light max-w-xl mx-auto leading-relaxed"
            >
              Sign up now and talk to our AI companion. Feel better in 2 minutes. 
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 120 }}
              className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white text-primary hover:bg-white/90 shadow-xl shadow-primary/40 hover:shadow-2xl transition-all duration-300 text-base font-semibold px-8"
              >
                <Link to="/register">
                  Begin Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <p className="text-white/40 text-xs font-light italic">Free. Secure. Always here.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
