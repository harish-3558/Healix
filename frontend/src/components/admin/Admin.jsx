import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, Trash2, AlertCircle, ShieldCheck, CheckCircle2, Activity, Shield, XCircle, ChevronRight } from "lucide-react"
import api from '@/lib/api'
import { motion, AnimatePresence } from "motion/react"

export default function AdminComponent() {
    const [stats, setStats] = useState({
        students: 0,
        counselors: 0,
        appointments: 0,
        pending: 0,
        pendingCounselors: 0
    })
    const [appointments, setAppointments] = useState([])
    const [users, setUsers] = useState([])
    const [pendingCounselors, setPendingCounselors] = useState([])
    const [loading, setLoading] = useState(true)
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' })

    useEffect(() => {
        fetchData()
    }, [])

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type })
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000)
    }

    const fetchData = async () => {
        try {
            const [statsRes, aptRes, usersRes, pendRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/appointments'),
                api.get('/admin/users'),
                api.get('/admin/pending-counselors')
            ])

            if (statsRes.data.success) setStats(statsRes.data.data)
            if (aptRes.data.success) setAppointments(aptRes.data.data)
            if (usersRes.data.success) setUsers(usersRes.data.data)
            if (pendRes.data.success) setPendingCounselors(pendRes.data.data)
        } catch (error) {
            console.error("Failed to fetch admin data", error)
            showNotification("Failed to load dashboard data", "error")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this user?")) return
        try {
            const { data } = await api.delete(`/admin/user/${id}`)
            if (data.success) {
                setUsers(users.filter(u => u._id !== id))
                const statsRes = await api.get('/admin/stats')
                if (statsRes.data.success) setStats(statsRes.data.data)
                showNotification("User removed successfully")
            }
        } catch (error) {
            console.error("Failed to delete user", error)
            showNotification("Failed to delete user", "error")
        }
    }

    const handleApproveCounselor = async (id) => {
        try {
            const { data } = await api.patch(`/admin/approve-counselor/${id}`)
            if (data.success) {
                setPendingCounselors(pendingCounselors.filter(c => c._id !== id))
                fetchData()
                showNotification("Counselor approved and active")
            }
        } catch (error) {
            console.error("Failed to approve counselor", error)
            showNotification("Failed to approve counselor", "error")
        }
    }

    const handleRejectCounselor = async (id) => {
        if (!window.confirm("Reject and delete this counselor application?")) return
        try {
            const { data } = await api.delete(`/admin/reject-counselor/${id}`)
            if (data.success) {
                setPendingCounselors(pendingCounselors.filter(c => c._id !== id))
                fetchData()
                showNotification("Application rejected", "info")
            }
        } catch (error) {
            console.error("Failed to reject counselor", error)
            showNotification("Failed to reject counselor", "error")
        }
    }

    const statCards = [
        { icon: Users, label: "Total Students", value: stats.students },
        { icon: ShieldCheck, label: "Active Counselors", value: stats.counselors },
        { icon: Calendar, label: "Total Sessions", value: stats.appointments },
        { icon: Activity, label: "Pending Sessions", value: stats.pending },
        { icon: AlertCircle, label: "Applications", value: stats.pendingCounselors },
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="font-serif italic text-xl text-muted-foreground">Accessing Records...</p>
            </div>
        )
    }

    return (
        <div className="space-y-12 relative w-full max-w-7xl mx-auto pb-12">
            
            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            {/* Floating Notification */}
            <AnimatePresence>
                {notification.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className="fixed top-24 left-1/2 z-50 min-w-[300px]"
                    >
                        <div className={`p-4 rounded-full backdrop-blur-md border shadow-xl flex items-center justify-center gap-3 text-sm font-medium
                            ${notification.type === 'error' ? 'bg-destructive/90 border-destructive text-white' : 
                              notification.type === 'info' ? 'bg-black/80 border-black/20 text-white' : 
                              'bg-primary/90 border-primary text-white'}
                        `}>
                            {notification.type === 'error' ? <XCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                            {notification.message}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 pt-4 px-2">
            </div>

            {/* Stats Grid */}
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {statCards.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <motion.div key={i} variants={itemVariants}>
                            <Card className="p-6 bg-accent/40 backdrop-blur-xl border-white/40 transition-all duration-300">
                                <div className="flex flex-col gap-4">
                                    <div className={`w-12 h-12 rounded-xl bg-linear-to-t from-primary/90 to-primary/10 flex items-center justify-center shadow-inner text-white`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-4xl font-serif text-foreground leading-none mb-2">{stat.value}</p>
                                        <p className="text-xs uppercase tracking-widest text-muted-foreground/60 font-semibold">{stat.label}</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )
                })}
            </motion.div>

            {/* Main Content Area */}
            <Tabs defaultValue="requests" className="w-full flex flex-col">
                
                {/* Modern Pill Tabs */}
                <TabsList className="flex w-full md:w-auto h-auto bg-white/40 backdrop-blur-md border border-white/40 p-1.5 rounded-full shadow-sm mb-8 self-start overflow-x-auto no-scrollbar">
                    <TabsTrigger value="requests" className="rounded-full px-6 sm:px-8 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm relative">
                        Pending Applications
                        {stats.pendingCounselors > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="appointments" className="rounded-full px-6 sm:px-8 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                        All Appointments
                    </TabsTrigger>
                    <TabsTrigger value="users" className="rounded-full px-6 sm:px-8 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                        User Directory
                    </TabsTrigger>
                </TabsList>

                {/* Tab: Pending Counselors */}
                <TabsContent value="requests" className="mt-0 outline-none">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        <Card className="bg-white/40 backdrop-blur-xl border-white/40 shadow-xl shadow-primary/5 rounded-[2.5rem] overflow-hidden">
                            <div className="p-8 border-b border-black/5 bg-white/20">
                                <h3 className="text-2xl font-serif text-foreground">Review Applications</h3>
                                <p className="text-sm font-light text-muted-foreground mt-1">Approve or reject counselor accounts waiting for access.</p>
                            </div>
                            
                            {pendingCounselors.length === 0 ? (
                                <div className="p-16 text-center text-muted-foreground/60">
                                    <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p className="font-serif text-xl italic">No pending applications right now.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto p-4">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-b border-black/5 hover:bg-transparent">
                                                <TableHead className="text-xs uppercase tracking-widest font-bold text-muted-foreground/50 h-12">Applicant</TableHead>
                                                <TableHead className="text-xs uppercase tracking-widest font-bold text-muted-foreground/50">Speciality</TableHead>
                                                <TableHead className="text-xs uppercase tracking-widest font-bold text-muted-foreground/50">Credentials</TableHead>
                                                <TableHead className="text-xs uppercase tracking-widest font-bold text-muted-foreground/50 text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {pendingCounselors.map((c) => (
                                                <TableRow key={c._id} className="border-b border-black/5 hover:bg-white/40 transition-colors group">
                                                    <TableCell className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-serif text-primary">
                                                                {c.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-foreground">{c.name}</p>
                                                                <p className="text-xs text-muted-foreground">{c.email}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-foreground/80">{c.speciality}</TableCell>
                                                    <TableCell>
                                                        <a href={c.credentials} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline hover:text-primary/80">
                                                            View Document <ChevronRight className="w-3 h-3" />
                                                        </a>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                            <Button size="sm" onClick={() => handleApproveCounselor(c._id)} className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm h-9 px-4">
                                                                Approve
                                                            </Button>
                                                            <Button size="sm" variant="ghost" onClick={() => handleRejectCounselor(c._id)} className="rounded-full text-rose-500 hover:bg-rose-50 h-9 px-4">
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                </TabsContent>

                {/* Tab: Appointments */}
                <TabsContent value="appointments" className="mt-0 outline-none">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        <Card className="bg-white/40 backdrop-blur-xl border-white/40 shadow-xl shadow-primary/5 rounded-[2.5rem] overflow-hidden">
                            <div className="p-8 border-b border-black/5 bg-white/20">
                                <h3 className="text-2xl font-serif text-foreground">Session Log</h3>
                                <p className="text-sm font-light text-muted-foreground mt-1">Overview of all booked and completed sessions.</p>
                            </div>
                            
                            <div className="overflow-x-auto p-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-black/5 hover:bg-transparent">
                                            <TableHead className="text-xs uppercase tracking-widest font-bold text-muted-foreground/50 h-12">Student</TableHead>
                                            <TableHead className="text-xs uppercase tracking-widest font-bold text-muted-foreground/50">Counselor</TableHead>
                                            <TableHead className="text-xs uppercase tracking-widest font-bold text-muted-foreground/50">Schedule</TableHead>
                                            <TableHead className="text-xs uppercase tracking-widest font-bold text-muted-foreground/50">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {appointments.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground/60 font-serif italic">
                                                    No sessions found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            appointments.map((apt) => (
                                                <TableRow key={apt._id} className="border-b border-black/5 hover:bg-white/40 transition-colors">
                                                    <TableCell className="py-4">
                                                        <p className="font-medium text-foreground">{apt.userId?.name || 'Unknown'}</p>
                                                        <p className="text-xs text-muted-foreground">{apt.userId?.email}</p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className="font-medium text-foreground">{apt.counselorId?.name || 'Unknown'}</p>
                                                        <p className="text-xs text-muted-foreground">{apt.counselorId?.email}</p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className="text-sm text-foreground/80">{new Date(apt.date).toLocaleDateString()}</p>
                                                        <p className="text-xs text-muted-foreground">{apt.time}</p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest
                                                            ${apt.status === 'pending' ? 'bg-amber-100 text-amber-700' : ''}
                                                            ${apt.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : ''}
                                                            ${apt.status === 'rejected' ? 'bg-rose-100 text-rose-700' : ''}
                                                            ${apt.status === 'completed' ? 'bg-blue-100 text-blue-700' : ''}
                                                        `}>
                                                            {apt.status}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </motion.div>
                </TabsContent>

                {/* Tab: Users Directory */}
                <TabsContent value="users" className="mt-0 outline-none">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        <Card className="bg-white/40 backdrop-blur-xl border-white/40 shadow-xl shadow-primary/5 rounded-[2.5rem] overflow-hidden">
                            <div className="p-8 border-b border-black/5 bg-white/20">
                                <h3 className="text-2xl font-serif text-foreground">Directory</h3>
                                <p className="text-sm font-light text-muted-foreground mt-1">Manage all registered accounts.</p>
                            </div>
                            
                            <div className="overflow-x-auto p-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-black/5 hover:bg-transparent">
                                            <TableHead className="text-xs uppercase tracking-widest font-bold text-muted-foreground/50 h-12">User</TableHead>
                                            <TableHead className="text-xs uppercase tracking-widest font-bold text-muted-foreground/50">Role</TableHead>
                                            <TableHead className="text-xs uppercase tracking-widest font-bold text-muted-foreground/50">Joined</TableHead>
                                            <TableHead className="text-xs uppercase tracking-widest font-bold text-muted-foreground/50 text-right">Access</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((u) => (
                                            <TableRow key={u._id} className="border-b border-black/5 hover:bg-white/40 transition-colors group">
                                                <TableCell className="py-4">
                                                    <p className="font-medium text-foreground">{u.name}</p>
                                                    <p className="text-xs text-muted-foreground">{u.email}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest border
                                                        ${u.role === 'admin' ? 'bg-purple-50 border-purple-100 text-purple-600' : 
                                                          u.role === 'counselor' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                                                          'bg-slate-50 border-slate-200 text-slate-600'}
                                                    `}>
                                                        {u.role}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-sm text-foreground/80 font-light">
                                                    {new Date(u.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {u.role !== 'admin' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 rounded-full text-muted-foreground hover:bg-rose-100 hover:text-rose-600 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                                                            onClick={() => handleDeleteUser(u._id)}
                                                            title="Remove User"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </motion.div>
                </TabsContent>

            </Tabs>
        </div>
    )
}