import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ChatbotComponent from '@/components/chatbot/Chatbot'

export default function Chatbot() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            {/* pt-32 clears the fixed navbar. flex-1 allows this container to grow */}
            <main className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 pt-32 pb-12 max-w-4xl mx-auto w-full">
                <ChatbotComponent />
            </main>
        </div>
    )
}