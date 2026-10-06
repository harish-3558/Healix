import { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown, LayoutDashboard, Activity, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function ProfileDropdown() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const getDashboardLink = () => {
        if (user?.role === 'counselor') return '/counselor-dashboard';
        if (user?.role === 'admin') return '/admin';
        return '/student-dashboard';
    };

    const getDashboardLabel = () => {
        if (user?.role === 'counselor') return 'Counselor Hub';
        if (user?.role === 'admin') return 'Admin Panel';
        return 'My Journey';
    };

    return (
        <div className="relative ml-3" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center border-2 border-white/50 ring-2 ring-primary/20 active:scale-95"
                aria-label="User menu"
            >
                {user?.name ? (
                    <span className="text-lg font-semibold text-background">
                        {user.name.charAt(0).toUpperCase()}
                    </span>
                ) : (
                    <User className="w-5 h-5" />
                )}
                {/* Online indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="absolute right-0 z-50 mt-3 w-64 origin-top-right rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl shadow-primary/10 border border-white/40 overflow-hidden"
                    >
                        {/* User Info Header */}
                        <div className="px-5 py-4 bg-gradient-to-br from-primary/5 to-secondary/10 border-b border-white/40">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-foreground text-sm truncate">{user?.name || 'User'}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-wider font-bold">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        {user?.role}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2 px-2">
                            <Link
                                to={getDashboardLink()}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary transition-all duration-200 group"
                            >
                                <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                                    <Activity className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <span className="block">{getDashboardLabel()}</span>
                                    <span className="text-[10px] text-muted-foreground font-normal">Track your progress</span>
                                </div>
                            </Link>

                            <div className="h-px bg-border/50 mx-3 my-1.5" />

                            <button
                                onClick={() => {
                                    logout();
                                    setIsOpen(false);
                                }}
                                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-destructive/5 hover:text-destructive transition-all duration-200 group"
                            >
                                <div className="p-1.5 rounded-lg bg-muted group-hover:bg-destructive/10 transition-colors">
                                    <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                                </div>
                                <span>Sign out</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
