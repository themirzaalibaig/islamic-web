import { SidebarTrigger } from '@/components/ui'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '@/components/custom'

export const Header = () => {
    return (
        <header className="h-20 border-b bg-background flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger />
                <Link to="/" className="font-semibold sm:hidden">
                    Islamic Web
                </Link>
            </div>
            <ThemeToggle />
        </header>

    )
}
