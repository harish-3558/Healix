import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import api from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Shield, GraduationCap, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, Activity, Sparkles } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { motion as Motion, AnimatePresence } from 'motion/react'

export default function Login() {
    const [role, setRole] = useState('student')
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const { login } = useAuth()
    const location = useLocation()
    const from = location.state?.from

    const handleLogin = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage({ type: '', text: '' })

        try {
            const { data } = await api.post('/auth/login', formData)
            if (data.success) {
                login({
                    ...data,
                    token: data.token
                })

                if (data.role !== role) {
                    setMessage({ type: 'info', text: `Logging you in as a ${data.role}...` })
                }

                setTimeout(() => {
                    if (from) {
                        window.location.href = from
                    } else if (data.role === 'student') window.location.href = '/student-dashboard'
                    else if (data.role === 'counselor') window.location.href = '/counselor-dashboard'
                    else if (data.role === 'admin') window.location.href = '/admin'
                    else window.location.href = '/'
                }, 800)
            }
        } catch (error) {
            console.error('Login error:', error)
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to authenticate. Please check your credentials.'
            })
            setIsLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        if (message.text) setMessage({ type: '', text: '' })
    }

    const roles = [
        { id: 'student', label: 'Student', icon: GraduationCap },
        { id: 'counselor', label: 'Counselor', icon: User },
        { id: 'admin', label: 'Admin', icon: Shield },
    ]

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">

            {/* Back to Home Button */}
            <Motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="absolute top-6 left-6 md:top-10 md:left-10 z-50"
            >
                <Button asChild variant="ghost" className="rounded-full bg-white/40 backdrop-blur-md border border-white/40 shadow-sm hover:bg-white/60 text-foreground gap-2 transition-all">
                    <Link to="/">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Home</span>
                    </Link>
                </Button>
            </Motion.div>

            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[600px] pointer-events-none -z-10">
                <div className="absolute top-0 left-10 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <Motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="w-full max-w-lg z-10"
            >
                <Card className="w-full p-8 sm:p-12 border-white/40 bg-white/40 backdrop-blur-xl shadow-2xl rounded-[2.5rem] relative overflow-hidden">

                    {/* Header */}
                    <div className="text-center space-y-3 mb-10">
                        <h1 className="text-3xl md:text-4xl font-serif text-foreground tracking-tight">
                            Welcome <span className="italic text-primary">Back</span>
                        </h1>
                        <p className="text-muted-foreground font-light text-sm">
                            Enter your sanctuary to continue your journey.
                        </p>
                    </div>

                    {/* Form Area */}
                    <div className="space-y-8">

                        {/* Custom Role Selector (Pill Style) */}
                        <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-full border border-white/40 shadow-sm relative">
                            {roles.map((r) => {
                                const Icon = r.icon
                                const isActive = role === r.id
                                return (
                                    <button
                                        key={r.id}
                                        type="button"
                                        onClick={() => setRole(r.id)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium transition-all duration-500 relative z-10
                                            ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
                                        `}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="hidden sm:inline">{r.label}</span>
                                        {isActive && (
                                            <Motion.div
                                                layoutId="active-role"
                                                className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                            />
                                        )}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Error/Info Messages */}
                        <AnimatePresence mode="wait">
                            {message.text && (
                                <Motion.div
                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                    className={`overflow-hidden rounded-2xl ${message.type === 'error' ? 'bg-destructive/5 text-destructive' : 'bg-primary/5 text-primary'
                                        }`}
                                >
                                    <div className={`p-4 border text-sm flex items-start gap-3 rounded-2xl ${message.type === 'error' ? 'border-destructive/10' : 'border-primary/10'
                                        }`}>
                                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                        <p className="leading-relaxed">{message.text}</p>
                                    </div>
                                </Motion.div>
                            )}
                        </AnimatePresence>

                        {/* Inputs */}
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 ml-2">Email Address</label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="healix@gmail.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="h-14 px-6 rounded-full bg-white/60 border-white/40 focus-visible:ring-primary/30 shadow-sm transition-all text-base"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-2 mr-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60">Password</label>
                                    <Link
                                        to="/forgot-password"
                                        state={{ email: formData.email }}
                                        className="text-[10px] uppercase tracking-widest font-bold text-primary/60 hover:text-primary transition-colors"
                                    >
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder=""
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="h-14 pl-6 pr-14 rounded-full bg-white/60 border-white/40 focus-visible:ring-primary/30 shadow-sm transition-all text-base"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 rounded-full bg-gradient-to-b from-white from-10% to-secondary to-95% shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 text-primary text-lg font-semibold transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:hover:scale-100 mt-4 border border-white/40"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Sparkles className="w-5 h-5" />
                                        Enter as {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </span>
                                )}
                            </Button>
                        </form>
                        {/* Journey Tracker Hint */}
                        <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary/10">
                                    <Activity className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-foreground">Journey Tracker</p>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">Track your meditations, exercises & counseling sessions after login.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Footer Link */}
                <div className="text-center mt-8">
                    <p className="text-sm text-muted-foreground font-light">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary font-medium hover:underline underline-offset-4">
                            Begin your journey
                        </Link>
                    </p>
                </div>
            </Motion.div>
        </div>
    )
}