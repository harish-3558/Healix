import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, Loader2, Heart, AlertCircle, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import axios from "axios"
import API_URL from "../../config/api"

export default function ChatbotComponent() {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hello. I'm Odyssey, your personal AI companion. I'm here to listen and support you. How are you feeling today?" },
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const messagesEndRef = useRef(null)

    const quickSuggestions = [
        "I'm feeling anxious",
        "How do I manage stress?",
        "I'm having trouble sleeping"
    ]

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isLoading])

    const handleSendMessage = async (text) => {
        if (!text.trim() || isLoading) return

        const userMessage = text.trim()
        setMessages((prev) => [...prev, { role: "user", content: userMessage }])
        setInput("")
        setIsLoading(true)
        setError(null)

        try {
            const conversationHistory = messages
                .filter(msg => msg.role !== "system")
                .map(msg => ({ role: msg.role, content: msg.content }))

            const response = await axios.post(
                `${API_URL}/api/chatbot/message`,
                {
                    message: userMessage,
                    conversationHistory: conversationHistory
                },
                { timeout: 30000 }
            )

            if (response.data.success) {
                setMessages((prev) => [...prev, {
                    role: "assistant",
                    content: response.data.message
                }])
            } else {
                throw new Error(response.data.message || "Failed to get response")
            }
        } catch (err) {
            console.error("Chatbot error:", err)
            const errorMessage = err.response?.data?.message || err.message || "Failed to get AI response. Please try again."
            setError(errorMessage)
            setMessages((prev) => [...prev, {
                role: "assistant",
                content: "I'm sorry, the sanctuary is currently experiencing a connection issue. Please try breathing and try again in a moment."
            }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col flex-1 w-full max-w-4xl mx-auto space-y-4 min-h-0">

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-destructive/5 border border-destructive/10 text-destructive px-4 py-3 rounded-2xl flex items-center gap-3 text-sm shrink-0"
                >
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </motion.div>
            )}

            <Card className="inset-shadow-2xl flex-1 flex flex-col p-2 sm:p-4 rounded-3xl overflow-hidden relative">

                {/* THE FIX: A relative wrapper that bounds the absolute scroll container */}
                <div className="flex-1 relative min-h-0 w-full z-10">
                    <div className="absolute inset-0 overflow-y-auto custom-scrollbar space-y-4 pr-3 px-2 sm:px-4 pb-4">
                        <AnimatePresence initial={false}>
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`flex items-end gap-3 max-w-[85%] sm:max-w-[75%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                        {msg.role === "assistant" && (
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mb-1">
                                                <Heart className="w-4 h-4 text-primary fill-primary opacity-50" />
                                            </div>
                                        )}
                                        <div
                                            className={`px-5 py-4 rounded-full ${msg.role === "user"
                                                    ? "bg-linear-to-r from-primary to-primary/50 text-background rounded-br-md shadow-md"
                                                    : "bg-white text-foreground rounded-bl-md font-serif text-md"
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-start"
                            >
                                <div className="flex items-end gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mb-1">
                                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                    </div>
                                    <div className="bg-white/50 text-foreground/50 px-5 py-4 rounded-3xl rounded-bl-sm border border-black/5 flex gap-2 items-center">
                                        <span className="text-sm font-serif italic">Reflecting...</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </Card>

            <div className="shrink-0 space-y-3 pb-2 z-10">
                <div className="flex gap-3 pb-2 px-2 items-center justify-center">
                    {quickSuggestions.map((suggestion, i) => (
                        <Button
                            key={i}
                            variant="outline"
                            onClick={() => handleSendMessage(suggestion)}
                            disabled={isLoading}
                            className="rounded-full bg-white/50 backdrop-blur-sm border-primary/10 text-foreground/70 hover:bg-white hover:text-primary transition-all shrink-0"
                        >
                            {suggestion}
                        </Button>
                    ))}
                </div>

                <div className="relative">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage(input)}
                        placeholder="Share your thoughts..."
                        disabled={isLoading}
                        className="h-14 pl-6 pr-14 rounded-full bg-white/60 backdrop-blur-md border-primary/20 focus-visible:ring-primary/30 focus-visible:ring-offset-0 text-base shadow-lg shadow-black/5"
                    />
                    <Button
                        onClick={() => handleSendMessage(input)}
                        disabled={isLoading || !input.trim()}
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-primary hover:bg-primary/90 transition-transform active:scale-95"
                    >
                        <Send className="w-4 h-4 ml-0.5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
