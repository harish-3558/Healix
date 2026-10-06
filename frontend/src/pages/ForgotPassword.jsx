import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Loader2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'

export default function ForgotPassword() {
    const location = useLocation()
    const [email, setEmail] = useState(location.state?.email || '')
    const [otp, setOtp] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [resetToken, setResetToken] = useState('')
    const [reset, setReset] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (!sent) {
                const { data } = await api.post('/auth/forgot-password', { email })
                setSent(Boolean(data.success))
            } else if (!resetToken) {
                const { data } = await api.post('/auth/verify-reset-otp', { email, otp })
                setResetToken(data.resetToken)
            } else {
                if (password !== confirmPassword) {
                    setError('The passwords do not match.')
                    return
                }
                const { data } = await api.post('/auth/reset-password', { email, resetToken, password })
                setReset(Boolean(data.success))
            }
        } catch (requestError) {
            const fallbackMessage = resetToken
                ? 'Could not reset your password. Please try again.'
                : sent
                    ? 'Could not verify the code. Please try again.'
                    : 'Could not send the verification code. Please try again.'
            setError(requestError.response?.data?.message || fallbackMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <Card className="w-full max-w-lg p-8 sm:p-12 border-white/40 bg-white/40 backdrop-blur-xl shadow-2xl rounded-[2.5rem]">
                <Button asChild variant="ghost" className="rounded-full mb-8">
                    <Link to="/login"><ArrowLeft className="w-4 h-4 mr-2" />Back to login</Link>
                </Button>

                <div className="text-center mb-8">
                    <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-primary/10 flex items-center justify-center">
                        {reset ? <CheckCircle2 className="w-7 h-7 text-primary" /> : sent ? <CheckCircle2 className="w-7 h-7 text-primary" /> : <Mail className="w-7 h-7 text-primary" />}
                    </div>
                    <h1 className="text-3xl font-serif text-foreground mb-3">
                        {reset ? 'Password updated' : sent ? 'Enter your code' : 'Reset your password'}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {reset
                            ? 'Your password has been changed. You can now sign in.'
                            : resetToken
                                ? 'Code verified. Now choose your new password.'
                                : sent
                                    ? 'Enter the six-digit code sent to your email. It expires in 10 minutes.'
                                    : 'Enter your account email and we’ll send you a six-digit verification code.'}
                    </p>
                </div>

                {reset ? (
                    <Button asChild className="w-full h-14 rounded-full">
                        <Link to="/login">Back to login</Link>
                    </Button>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && <p role="alert" className="p-4 rounded-2xl bg-destructive/5 text-destructive text-sm">{error}</p>}
                        <div className="space-y-2">
                            <label htmlFor="reset-email" className="text-xs uppercase tracking-widest font-bold text-muted-foreground/70 ml-2">Account email</label>
                            <Input
                                id="reset-email"
                                type="email"
                                autoComplete="email"
                                required
                                readOnly={sent}
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="h-14 px-6 rounded-full bg-white/60 border-white/40"
                            />
                        </div>
                        {sent && !resetToken && (
                            <div className="space-y-2">
                                <label htmlFor="reset-otp" className="text-xs uppercase tracking-widest font-bold text-muted-foreground/70 ml-2">Six-digit code</label>
                                <Input
                                    id="reset-otp"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    pattern="[0-9]{6}"
                                    maxLength={6}
                                    required
                                    value={otp}
                                    onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="h-14 px-6 rounded-full bg-white/60 border-white/40"
                                />
                            </div>
                        )}
                        {resetToken && (
                            <>
                                <div className="space-y-2">
                                    <label htmlFor="new-password" className="text-xs uppercase tracking-widest font-bold text-muted-foreground/70 ml-2">New password</label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        autoComplete="new-password"
                                        minLength={8}
                                        required
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        className="h-14 px-6 rounded-full bg-white/60 border-white/40"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="confirm-password" className="text-xs uppercase tracking-widest font-bold text-muted-foreground/70 ml-2">Confirm new password</label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        autoComplete="new-password"
                                        minLength={8}
                                        required
                                        value={confirmPassword}
                                        onChange={(event) => setConfirmPassword(event.target.value)}
                                        className="h-14 px-6 rounded-full bg-white/60 border-white/40"
                                    />
                                </div>
                            </>
                        )}
                        <Button type="submit" disabled={loading} className="w-full h-14 rounded-full">
                            {loading
                                ? <Loader2 className="w-5 h-5 animate-spin" />
                                : resetToken ? 'Change password' : sent ? 'Verify code' : 'Send verification code'}
                        </Button>
                    </form>
                )}
            </Card>
        </div>
    )
}
