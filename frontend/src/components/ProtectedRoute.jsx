import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LogIn, Lock, Sparkles, ArrowRight, Wind, HeartPulse, BookOpen, ShieldAlert } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { user } = useAuth()
    const location = useLocation()

    if (!user) {
        return (
            <div className="flex flex-col min-h-screen bg-background">
                <Navbar />
                <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-32 pb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="w-full max-w-md"
                    >
                        {/* Ambient glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-primary/8 blur-[120px] rounded-full pointer-events-none -z-10" />

                        <Card className="p-10 sm:p-12 bg-white/40 backdrop-blur-xl border-white/40 shadow-2xl rounded-[2.5rem] text-center relative overflow-hidden">
                            {/* Decorative gradient */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                                className="w-20 h-20 mx-auto rounded-[1.5rem] bg-primary/10 flex items-center justify-center mb-8"
                            >
                                <Lock className="w-9 h-9 text-primary" />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-3">
                                    Sign In <span className="italic text-primary">Required</span>
                                </h2>
                                <p className="text-muted-foreground font-light leading-relaxed mb-8 text-[0.95rem]">
                                    This is a safe, personal space. Log in to access guided meditations, exercises, coping strategies, and track your wellness journey.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-3"
                            >
                                <Button
                                    asChild
                                    className="w-full rounded-full px-8 py-6 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-95 font-medium"
                                >
                                    <Link to="/login" state={{ from: location.pathname }}>
                                        <LogIn className="w-4 h-4 mr-2" />
                                        Log In to Continue
                                    </Link>
                                </Button>
                                <p className="text-sm text-muted-foreground pt-2">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="text-primary font-medium hover:underline underline-offset-4">
                                        Begin your journey
                                    </Link>
                                </p>
                            </motion.div>

                            {/* Feature hints */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mt-10 pt-8 border-t border-border/20"
                            >
                                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60 uppercase tracking-widest font-medium mb-4">
                                    <Sparkles className="w-3 h-3" />
                                    What awaits you
                                </div>
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div className="p-3 rounded-2xl bg-background/50">
                                        <div className="w-8 h-8 mx-auto mb-1.5 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <Wind className="w-4 h-4 text-primary" />
                                        </div>
                                        <p className="text-[11px] text-muted-foreground font-medium">Guided Meditations</p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-background/50">
                                        <div className="w-8 h-8 mx-auto mb-1.5 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <HeartPulse className="w-4 h-4 text-primary" />
                                        </div>
                                        <p className="text-[11px] text-muted-foreground font-medium">Wellness Exercises</p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-background/50">
                                        <div className="w-8 h-8 mx-auto mb-1.5 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <BookOpen className="w-4 h-4 text-primary" />
                                        </div>
                                        <p className="text-[11px] text-muted-foreground font-medium">Coping Strategies</p>
                                    </div>
                                </div>
                            </motion.div>
                        </Card>
                    </motion.div>
                </main>
                <Footer />
            </div>
        )
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return (
            <div className="flex flex-col min-h-screen bg-background">
                <Navbar />
                <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-32 pb-12">
                    <Card className="w-full max-w-md p-10 text-center bg-white/40 backdrop-blur-xl border-white/40 shadow-2xl rounded-[2.5rem]">
                        <ShieldAlert className="w-12 h-12 mx-auto mb-6 text-destructive" />
                        <h2 className="text-2xl font-serif font-medium text-foreground mb-3">
                            Access <span className="italic text-primary">Denied</span>
                        </h2>
                        <p className="text-muted-foreground font-light leading-relaxed mb-8">
                            You do not have permission to view this page.
                        </p>
                        <Button asChild className="rounded-full px-8 py-6 text-base">
                            <Link to="/">
                                Return Home
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </Card>
                </main>
                <Footer />
            </div>
        )
    }

    return children
}
