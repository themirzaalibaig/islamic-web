import { SidebarTrigger } from '@/components/ui'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '@/components/custom'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth'
import { useInterval } from '@reactuses/core'
import { format } from 'date-fns'

export const Header = () => {
    const [date, setDate] = useState(new Date())
    const { isAuthenticated, logout } = useAuth()

    useInterval(() => setDate(new Date()), 1000)

    return (
        <header className="h-20 border-b bg-background flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger />
                <Link to="/" className="font-semibold sm:hidden">
                    Islamic Web
                </Link>
            </div>
            <div className="text-sm font-mono tabular-nums flex items-center flex-col">
                <span>{format(date, 'EEEE, MMMM d, yyyy')}</span>
                <div className="text-primary text-lg">{format(date, 'h:mm:ss a')}</div>
            </div>
            <div className="flex items-center gap-3">
                <Link to="/profile" className="hidden sm:inline text-sm text-primary">Profile</Link>
                {isAuthenticated ? (
                    <Button size="sm" variant="outline" onClick={() => void logout()}>Logout</Button>
                ) : (
                    <Button asChild size="sm" variant="default"><Link to="/login">Login</Link></Button>
                )}
                <ThemeToggle />
            </div>
        </header>

    )
}
