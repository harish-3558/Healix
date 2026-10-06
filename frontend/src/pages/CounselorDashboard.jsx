import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, User, Clock, CheckCircle2, XCircle } from 'lucide-react'
import api from '@/lib/api'

export default function CounselorDashboard() {
    const [user, setUser] = useState(null)
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkUserStatus = async () => {
            const storedUser = JSON.parse(localStorage.getItem('user'))
            if (storedUser) {
                setUser(storedUser) // Set initial state from local storage to avoid flash

                try {
                    // Fetch latest user data from backend
                    const { data } = await api.get('/auth/me');
                    if (data.success) {
                        const updatedUser = { ...storedUser, ...data.data };

                        // Only update if there are changes (e.g. isApproved changed)
                        if (JSON.stringify(updatedUser) !== JSON.stringify(storedUser)) {
                            setUser(updatedUser);
                            localStorage.setItem('user', JSON.stringify(updatedUser));
                        }
                    }
                } catch (error) {
                    console.error("Failed to verify user status", error);
                }

                fetchAppointments()
            }
        }

        checkUserStatus()
    }, [])

    const fetchAppointments = async () => {
        try {
            const { data } = await api.get('/appointment/counselor')
            if (data.success) {
                setAppointments(data.data)
            }
        } catch (error) {
            console.error("Failed to fetch appointments", error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (id, status) => {
        try {
            const { data } = await api.patch(`/appointment/${id}/status`, { status })
            if (data.success) {
                // Update local state
                setAppointments(appointments.map(apt =>
                    apt._id === id ? { ...apt, status } : apt
                ))
            }
        } catch (error) {
            console.error("Failed to update status", error)
            alert("Failed to update status")
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-success/10 text-success'
            case 'rejected': return 'bg-destructive/10 text-destructive'
            case 'completed': return 'bg-info/10 text-info'
            default: return 'bg-warning/10 text-warning'
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto w-full mt-32">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">
                        Counselor <span className="gradient-text">Dashboard</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">Manage your appointments and student requests.</p>
                </div>

                <div className="space-y-6">
                    {user?.role === 'counselor' && !user?.isApproved && (
                        <Card className="border-warning/50 bg-warning/10 mb-6">
                            <CardContent className="flex items-center gap-4 p-4">
                                <div className="p-2 rounded-full bg-warning/20 text-warning">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-warning-foreground">Account Pending Approval</h3>
                                    <p className="text-warning-foreground/90">
                                        Your counselor account is currently under review by an administrator. You will not receive any appointment requests until approved.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="border-primary/20 bg-card/50 backdrop-blur">
                        <CardHeader>
                            <CardTitle>Appointment Requests</CardTitle>
                            <CardDescription>Review and manage upcoming sessions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <p>Loading appointments...</p>
                            ) : appointments.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">No appointments assigned yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {appointments.map((apt) => (
                                        <div key={apt._id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors gap-4">
                                            <div className="flex gap-4 items-start">
                                                <div className="p-3 rounded-full bg-primary/10 mt-1">
                                                    <User className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-lg">{apt.userId?.name || "Student"}</h4>
                                                    <p className="text-sm text-muted-foreground">{apt.userId?.email}</p>
                                                    <div className="flex flex-wrap gap-4 mt-2 text-sm">
                                                        <div className="flex items-center gap-1 text-muted-foreground">
                                                            <Calendar className="w-4 h-4" />
                                                            {new Date(apt.date).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-muted-foreground">
                                                            <Clock className="w-4 h-4" />
                                                            {apt.time}
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 text-sm bg-muted/50 p-2 rounded">
                                                        <span className="font-medium">Concern: </span>
                                                        {apt.concern}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-3 min-w-[140px]">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusColor(apt.status)}`}>
                                                    {apt.status}
                                                </span>

                                                {apt.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-success border-success/20 hover:bg-success/10 hover:text-success"
                                                            onClick={() => handleStatusUpdate(apt._id, 'approved')}
                                                        >
                                                            <CheckCircle2 className="w-4 h-4 mr-1" />
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                                                            onClick={() => handleStatusUpdate(apt._id, 'rejected')}
                                                        >
                                                            <XCircle className="w-4 h-4 mr-1" />
                                                            Reject
                                                        </Button>
                                                    </div>
                                                )}
                                                {apt.status === 'approved' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-info border-info/20 hover:bg-info/10 hover:text-info"
                                                        onClick={() => handleStatusUpdate(apt._id, 'completed')}
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 mr-1" />
                                                        Mark Complete
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}
