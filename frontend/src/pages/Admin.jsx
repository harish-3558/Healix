import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AdminComponent from '@/components/admin/Admin'

export default function Admin() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto w-full mt-32">
                <div className="mb-2">
                    <h1 className="text-4xl font-serif text-foreground mb-2">
                        Admin <span className="text-primary italic">Dashboard</span>
                    </h1>
                    <p className="text-muted-foreground">Manage platform data, counseling requests, and user activity.</p>
                </div>
                <AdminComponent />
            </main>
        </div>
    )
}
