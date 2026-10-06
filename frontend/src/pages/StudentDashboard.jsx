import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, BookOpen, Clock, AlertCircle, Activity, Brain, Dumbbell, FileText, Flame, Timer, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '@/lib/api'

export default function StudentDashboard() {
    const [user, setUser] = useState(null)
    const [appointments, setAppointments] = useState([])
    const [activities, setActivities] = useState([])
    const [activityStats, setActivityStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activityLoading, setActivityLoading] = useState(true)

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'))
        if (storedUser) {
            setUser(storedUser)
            fetchAppointments()
            fetchActivities()
        }
    }, [])

    const fetchAppointments = async () => {
        try {
            const { data } = await api.get('/appointment/my')
            if (data.success) {
                setAppointments(data.data)
            }
        } catch (error) {
            console.error("Failed to fetch appointments", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchActivities = async () => {
        try {
            const { data } = await api.get('/activity/my')
            if (data.success) {
                setActivities(data.data)
                setActivityStats(data.stats)
            }
        } catch (error) {
            console.error("Failed to fetch activities", error)
        } finally {
            setActivityLoading(false)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'text-success bg-success/10 border border-success/20'
            case 'rejected': return 'text-destructive bg-destructive/10 border border-destructive/20'
            case 'completed': return 'text-info bg-info/10 border border-info/20'
            default: return 'text-warning bg-warning/10 border border-warning/20'
        }
    }

    const getActivityIcon = (type) => {
        switch (type) {
            case 'meditation': return <Brain className="w-4 h-4 text-violet-500" />
            case 'exercise': return <Dumbbell className="w-4 h-4 text-emerald-500" />
            case 'strategy': return <FileText className="w-4 h-4 text-blue-500" />
            default: return <Activity className="w-4 h-4 text-primary" />
        }
    }

    const getActivityBg = (type) => {
        switch (type) {
            case 'meditation': return 'bg-violet-500/10'
            case 'exercise': return 'bg-emerald-500/10'
            case 'strategy': return 'bg-blue-500/10'
            default: return 'bg-primary/10'
        }
    }

    const formatActivityDate = (dateStr) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diff = now - date
        const mins = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (mins < 1) return 'Just now'
        if (mins < 60) return `${mins}m ago`
        if (hours < 24) return `${hours}h ago`
        if (days < 7) return `${days}d ago`
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    const formatDuration = (seconds) => {
        if (!seconds) return ''
        const mins = Math.round(seconds / 60)
        return mins < 1 ? '<1 min' : `${mins} min`
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto w-full mt-32">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">
                        Welcome back, <span className="gradient-text">{user?.name}</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">Here is an overview of your wellness journey.</p>
                </div>

                {/* Quick Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <Link to="/counseling">
                        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-primary/20 bg-card/50 backdrop-blur">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-medium">Book Counseling</CardTitle>
                                <Calendar className="w-5 h-5 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Schedule a session with our professionals.</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link to="/resources">
                        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-primary/20 bg-card/50 backdrop-blur">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-medium">Resources</CardTitle>
                                <BookOpen className="w-5 h-5 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Access articles, videos, and self-help guides.</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link to="/assessment">
                        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-primary/20 bg-card/50 backdrop-blur">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-medium">Self Assessment</CardTitle>
                                <Clock className="w-5 h-5 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Take a quick check-in on your mental health.</p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Wellness Stats */}
                {activityStats && activityStats.totalSessions > 0 && (
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-primary" />
                            Wellness Stats
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <Card className="p-5 text-center bg-card/50 backdrop-blur border-primary/10">
                                <div className="text-3xl font-bold text-foreground mb-1">
                                    {activityStats.totalSessions}
                                </div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                                    Total Sessions
                                </div>
                            </Card>
                            <Card className="p-5 text-center bg-card/50 backdrop-blur border-primary/10">
                                <div className="text-3xl font-bold text-foreground mb-1">
                                    {activityStats.totalMinutes}
                                </div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                                    Minutes Practiced
                                </div>
                            </Card>
                            <Card className="p-5 text-center bg-violet-500/5 backdrop-blur border-violet-500/10">
                                <div className="flex items-center justify-center gap-1.5">
                                    <Brain className="w-5 h-5 text-violet-500" />
                                    <span className="text-3xl font-bold text-foreground">{activityStats.meditationCount}</span>
                                </div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">
                                    Meditations
                                </div>
                            </Card>
                            <Card className="p-5 text-center bg-emerald-500/5 backdrop-blur border-emerald-500/10">
                                <div className="flex items-center justify-center gap-1.5">
                                    <Dumbbell className="w-5 h-5 text-emerald-500" />
                                    <span className="text-3xl font-bold text-foreground">{activityStats.exerciseCount}</span>
                                </div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">
                                    Exercises
                                </div>
                            </Card>
                            <Card className="p-5 text-center bg-orange-500/5 backdrop-blur border-orange-500/10">
                                <div className="flex items-center justify-center gap-1.5">
                                    <Flame className="w-5 h-5 text-orange-500" />
                                    <span className="text-3xl font-bold text-foreground">{activityStats.streak}</span>
                                </div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">
                                    Day Streak
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Recent Activity */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-primary" />
                        Recent Activity
                    </h2>
                    {activityLoading ? (
                        <p className="text-muted-foreground">Loading activity...</p>
                    ) : activities.length === 0 ? (
                        <Card className="p-8 text-center text-muted-foreground">
                            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p className="mb-1 font-medium text-foreground">No activities yet</p>
                            <p className="text-sm">Start your wellness journey by exploring our resources.</p>
                            <Button asChild className="mt-4" variant="outline">
                                <Link to="/resources">Explore Resources</Link>
                            </Button>
                        </Card>
                    ) : (
                        <div className="grid gap-3">
                            {activities.slice(0, 10).map((activity) => (
                                <Card
                                    key={activity._id}
                                    className="p-4 flex items-center gap-4 hover:bg-card/80 transition-colors"
                                >
                                    <div className={`p-2.5 rounded-xl ${getActivityBg(activity.type)}`}>
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-foreground text-sm truncate">
                                            {activity.name}
                                        </h4>
                                        <p className="text-xs text-muted-foreground capitalize">
                                            {activity.type}
                                            {activity.duration > 0 && (
                                                <span className="ml-2 inline-flex items-center gap-1">
                                                    <Timer className="w-3 h-3" />
                                                    {formatDuration(activity.duration)}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <span className="text-xs text-muted-foreground shrink-0">
                                        {formatActivityDate(activity.completedAt)}
                                    </span>
                                </Card>
                            ))}
                            {activities.length > 10 && (
                                <p className="text-center text-sm text-muted-foreground mt-2">
                                    + {activities.length - 10} more sessions
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Appointments */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-primary" />
                        My Appointments
                    </h2>
                    {loading ? (
                        <p>Loading appointments...</p>
                    ) : appointments.length === 0 ? (
                        <Card className="p-8 text-center text-muted-foreground">
                            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No appointments booked yet.</p>
                            <Button asChild className="mt-4" variant="outline">
                                <Link to="/counseling">Book Now</Link>
                            </Button>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {appointments.map((apt) => (
                                <Card key={apt._id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex gap-4 items-start">
                                        <div className="p-3 rounded-full bg-primary/10">
                                            <Calendar className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{apt.counselorId?.name || "Counselor"}</h4>
                                            <p className="text-sm text-muted-foreground">{apt.counselorId?.email}</p>
                                            <div className="flex items-center gap-2 mt-1 text-sm">
                                                <span>{new Date(apt.date).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>{apt.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusColor(apt.status)}`}>
                                            {apt.status}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
