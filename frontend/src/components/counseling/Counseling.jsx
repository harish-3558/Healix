import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, User, CheckCircle2, AlertCircle, Sparkles, ShieldCheck, LogIn, HeartHandshake, ArrowRight, CalendarClock } from "lucide-react"
import api from '@/lib/api'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from "motion/react"
import { useAuth } from '@/context/AuthContext'

export default function CounselingComponent() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState("counselors")
    const [formData, setFormData] = useState({
        counselorId: "",
        date: "",
        time: "",
        concern: "",
        anonymous: false,
    })
    const [counselors, setCounselors] = useState([])
    const [availableSlots, setAvailableSlots] = useState([])
    const [slotsLoading, setSlotsLoading] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (user) fetchCounselors()
    }, [user])

    useEffect(() => {
        if (user?.role !== "student") {
            setAvailableSlots([])
            setSlotsLoading(false)
            setError(null)
            return
        }

        if (!formData.counselorId || !formData.date) {
            setAvailableSlots([])
            setSlotsLoading(false)
            return
        }

        let cancelled = false
        setAvailableSlots([])
        setSlotsLoading(true)

        api.get('/appointment/availability', {
            params: { counselorId: formData.counselorId, date: formData.date }
        })
            .then(({ data }) => {
                if (!cancelled && data.success) setAvailableSlots(data.data)
            })
            .catch((requestError) => {
                if (!cancelled) {
                    console.error("Failed to fetch appointment availability", requestError)
                    const status = requestError.response?.status
                    setError(status === 404
                        ? "The availability API is not running. Restart the local backend or deploy the latest backend, then refresh."
                        : status
                            ? `Could not load available times (HTTP ${status}). Please try again.`
                            : "Could not reach the booking service. Check that the backend is running, then try again.")
                }
            })
            .finally(() => {
                if (!cancelled) setSlotsLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [user?.role, formData.counselorId, formData.date])

    const fetchCounselors = async () => {
        try {
            const { data } = await api.get('/auth/counselors')
            if (data.success) {
                setCounselors(data.data)
            }
        } catch (error) {
            console.error("Failed to fetch counselors", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        try {
            if (!formData.counselorId) {
                setError("Please select a counselor from the previous tab.")
                setSubmitting(false)
                return
            }

            const { data } = await api.post('/appointment/book', formData)
            if (data.success) {
                setSubmitted(true)
                setTimeout(() => {
                    navigate('/student-dashboard')
                }, 3000)
            }
        } catch (error) {
            console.error("Booking error:", error)
            setError(error.response?.data?.message || "Failed to book appointment")
            if (error.response?.status === 409) {
                setAvailableSlots((slots) => slots.filter((slot) => slot !== formData.time))
                setFormData((current) => ({ ...current, time: "" }))
            }
        } finally {
            setSubmitting(false)
        }
    }

    const selectCounselor = (id) => {
        setFormData({ ...formData, counselorId: id })
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100, damping: 20 }
        }
    }

    // Find the selected counselor's name for the proceed button
    const selectedCounselor = counselors.find(c => c._id === formData.counselorId)
    const today = new Date()
    const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

    if (submitted) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="p-12 text-center bg-white/40 backdrop-blur-xl border-white/40 shadow-2xl rounded-[2.5rem] relative overflow-hidden max-w-2xl mx-auto mt-12">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-24 h-24 mx-auto bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
                            <CheckCircle2 className="w-12 h-12 text-primary" />
                        </div>
                        <h2 className="text-4xl font-serif text-foreground mb-4">Sanctuary Reserved</h2>
                        <p className="text-muted-foreground text-lg font-light max-w-md mb-8">
                            Your session request has been gently sent to the counselor. You'll be redirected to your dashboard momentarily.
                        </p>
                        <div className="w-12 h-1 bg-primary/20 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 3, ease: "linear" }}
                                className="h-full bg-primary"
                            />
                        </div>
                    </div>
                </Card>
            </motion.div>
        )
    }

    // ─── Logged-out state: show login gate ────────────────
    if (!user) {
        return (
            <div className="space-y-12 relative z-10 w-full max-w-4xl mx-auto">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-xl mx-auto"
                >
                    <Card className="p-10 sm:p-12 bg-card/40 backdrop-blur-xl border-border/40 shadow-lg rounded-[2.5rem] text-center space-y-5">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                            <HeartHandshake className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-medium text-foreground mb-2">Book a Counseling Session</h3>
                            <p className="text-muted-foreground font-light leading-relaxed max-w-md mx-auto">
                                Log in to connect with professional counselors, schedule sessions, and get personalized mental health support.
                            </p>
                        </div>
                        <Button asChild className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/15">
                            <Link to="/login">
                                <LogIn className="w-4 h-4 mr-2" />
                                Log In to Book a Session
                            </Link>
                        </Button>
                        <p className="text-sm text-muted-foreground pt-1">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary font-medium hover:underline underline-offset-4">
                                Sign up
                            </Link>
                        </p>
                    </Card>
                </motion.div>
            </div>
        )
    }

    // ─── Logged-in state: full counseling experience ─────
    return (
        <div className="space-y-12 relative z-10 w-full max-w-4xl mx-auto">
            {/* Ambient Background Glow */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Header Area */}
            <div className="text-center space-y-2 shrink-0 relative z-10">
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col items-center relative z-10">
                {/* Minimal Pill Tabs */}
                <TabsList className="flex w-auto mx-auto h-auto bg-white/40 backdrop-blur-md border border-white/40 p-1.5 rounded-full shadow-sm mb-12">
                    <TabsTrigger
                        value="counselors"
                        className="rounded-full px-8 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                    >
                        Select Counselor
                    </TabsTrigger>
                    <TabsTrigger
                        value="request"
                        className="rounded-full px-8 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                    >
                        Reserve Session
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="counselors" className="w-full mt-0 outline-none">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/50">
                            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                            <p className="font-serif italic text-lg">Finding available guides...</p>
                        </div>
                    ) : counselors.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl font-serif italic text-muted-foreground">No counselors available at the moment.</p>
                        </div>
                    ) : (
                        <>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                {counselors.map((counselor) => {
                                    const isSelected = formData.counselorId === counselor._id
                                    return (
                                        <motion.div key={counselor._id} variants={itemVariants}>
                                            <Card
                                                onClick={() => selectCounselor(counselor._id)}
                                                className={`p-8 bg-white/40 backdrop-blur-xl border-white/40 rounded-[2.5rem] group transition-all duration-500
                                                    cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5
                                                    ${isSelected ? 'ring-2 ring-primary bg-white/80 shadow-lg' : 'shadow-sm'}
                                                `}
                                            >
                                                <div className="flex items-start gap-5">
                                                    <div className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-colors duration-500 shadow-sm
                                                        ${isSelected ? 'bg-primary text-white' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'}
                                                    `}>
                                                        <User className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-serif text-foreground mb-1">{counselor.name}</h3>
                                                        <p className="text-xs uppercase tracking-widest text-primary font-bold mb-3">{counselor.email}</p>

                                                        <p className="text-sm text-muted-foreground mb-5">
                                                            View available 20-minute times after choosing a date.
                                                        </p>

                                                        <Button
                                                            size="sm"
                                                            className={`w-full rounded-full transition-all duration-300 font-medium
                                                                ${isSelected
                                                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                                                    : 'bg-card text-foreground border border-border shadow-sm hover:bg-primary hover:text-primary-foreground'
                                                                }`}
                                                        >
                                                            {isSelected ? 'Selected Guide ✓' : 'Choose Guide'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    )
                                })}
                            </motion.div>

                            {/* Proceed to Session CTA */}
                            <AnimatePresence>
                                {formData.counselorId && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.97 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                        className="mt-10 flex justify-center"
                                    >
                                        <Card className="p-6 sm:p-8 bg-white/60 backdrop-blur-xl border-white/40 shadow-xl shadow-primary/10 rounded-[2rem] flex flex-col sm:flex-row items-center gap-5 max-w-xl w-full">
                                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                                    <CalendarClock className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm text-muted-foreground font-light">Your selected guide</p>
                                                    <p className="text-lg font-serif text-foreground truncate">
                                                        {selectedCounselor?.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => setActiveTab("request")}
                                                className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95 font-medium text-base group/btn w-full sm:w-auto"
                                            >
                                                Proceed to Session
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                            </Button>
                                        </Card>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    )}
                </TabsContent>

                <TabsContent value="request" className="w-full mt-0 outline-none">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Card className="p-8 md:p-12 bg-white/40 backdrop-blur-xl border-white/40 shadow-xl shadow-primary/5 rounded-[2.5rem]">
                            <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">

                                {error && (
                                    <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10 text-destructive text-sm flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                {!formData.counselorId && !error && (
                                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-primary/80 text-sm flex items-center gap-3">
                                        <ShieldCheck className="w-5 h-5 shrink-0" />
                                        Please select a guide from the previous tab before reserving your session.
                                    </div>
                                )}

                                {formData.counselorId && selectedCounselor && (
                                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                                        <span>Booking with <strong className="font-semibold">{selectedCounselor.name}</strong> — Fill in your preferred time below.</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground/60 ml-2">Preferred Date *</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                                            <Input
                                                type="date"
                                                min={minDate}
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value, time: "" })}
                                                required
                                                disabled={user?.role !== "student"}
                                                className="pl-12 h-14 rounded-full bg-white/60 border-white/40 focus-visible:ring-primary/30 shadow-sm transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground/60 ml-2">Preferred Time *</label>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                                            <select
                                                value={formData.time}
                                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                                required
                                                disabled={user?.role !== "student" || !formData.date || slotsLoading || availableSlots.length === 0}
                                                className="w-full pl-12 pr-4 h-14 rounded-full bg-white/60 border border-white/40 focus-visible:ring-primary/30 shadow-sm transition-all disabled:opacity-60"
                                            >
                                                <option value="">
                                                    {user?.role !== "student"
                                                        ? "Student account required to reserve"
                                                        : !formData.date
                                                        ? "Choose a date first"
                                                        : slotsLoading
                                                            ? "Loading available times..."
                                                            : availableSlots.length
                                                                ? "Select a 20-minute slot"
                                                                : "No available times"}
                                                </option>
                                                {availableSlots.map((slot) => {
                                                    const [hours, minutes] = slot.split(':').map(Number)
                                                    const period = hours < 12 ? 'AM' : 'PM'
                                                    const displayHour = hours % 12 || 12
                                                    return (
                                                        <option key={slot} value={slot}>
                                                            {`${displayHour}:${String(minutes).padStart(2, '0')} ${period}`}
                                                        </option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Textarea
                                        value={formData.concern}
                                        onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                                        placeholder="Share what's on your mind... (required)"
                                        required
                                        className="bg-white/60 border-white/40 focus-visible:ring-primary/30 min-h-[160px] rounded-3xl resize-none shadow-sm transition-all p-5 font-light"
                                    />
                                </div>

                                <div className="flex items-start gap-4 p-5 rounded-3xl bg-white/40 border border-white/40">
                                    <div className="flex items-center h-5 mt-0.5">
                                        <input
                                            type="checkbox"
                                            id="anonymous"
                                            checked={formData.anonymous}
                                            onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                                            className="w-5 h-5 rounded border-primary/30 text-primary focus:ring-primary bg-white shadow-sm cursor-pointer"
                                        />
                                    </div>
                                    <label htmlFor="anonymous" className="text-sm text-foreground/80 cursor-pointer select-none leading-relaxed">
                                        <span className="font-medium block mb-1">Keep details private</span>
                                        <span className="text-muted-foreground font-light text-xs">Your counselor will see your name to prepare for the session, but your specific concerns will remain sealed until the meeting.</span>
                                    </label>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={user?.role !== "student" || submitting || !formData.counselorId}
                                    className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-lg font-medium shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none mt-4"
                                >
                                    {submitting ? 'Securing your spot...' : 'Reserve Session'}
                                </Button>
                            </form>
                        </Card>
                    </motion.div>
                </TabsContent>
            </Tabs>
        </div>
    )
}