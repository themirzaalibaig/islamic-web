import { SidebarTrigger } from '@/components/ui'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '@/components/custom'
import { useState } from 'react'
import { useInterval } from '@reactuses/core'
import { format } from 'date-fns'

export const Header = () => {
    const [date, setDate] = useState(new Date())

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
            <ThemeToggle />
        </header>

    )
}
