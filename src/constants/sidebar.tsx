import type { ElementType } from 'react'
import {
  HomeIcon,
  Clock,
  BookOpen,
  MessageSquare,
  Heart,
  Target,
  Compass,
  Calendar,
} from 'lucide-react'

export type SidebarNavItem = {
  title: string
  href: string
  icon?: ElementType
  subMenu?: SidebarNavItem[]
}

export const SIDEBAR_MENU: SidebarNavItem[] = [
  { href: '/', icon: HomeIcon, title: 'Home' },
  { href: '/prayer-times', icon: Clock, title: 'Prayer Times' },
  { href: '/quran', icon: BookOpen, title: 'Quran' },
  { href: '/hadith', icon: MessageSquare, title: 'Hadith' },
  { href: '/dua', icon: Heart, title: 'Dua' },
  { href: '/tasbeeh', icon: Target, title: 'Tasbeeh' },
  { href: '/qibla', icon: Compass, title: 'Qibla' },
  { href: '/calendar', icon: Calendar, title: 'Calendar' },
]
