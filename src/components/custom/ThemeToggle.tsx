import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui'
import { useColorMode, useMediaQuery } from '@reactuses/core'
import { Sun, Moon, Laptop, Check, SunMoon } from 'lucide-react'

export const ThemeToggle = () => {
  const systemIsDark = useMediaQuery('(prefers-color-scheme: dark)', false)
  const [mode, setMode] = useColorMode({
    attribute: 'class',
    modes: ['light', 'dark', 'system'],
    storageKey: 'theme-mode',
    defaultValue: systemIsDark ? 'dark' : 'light',
    modeClassNames: {
      light: 'light',
      dark: 'dark',
      system: systemIsDark ? 'dark' : 'light',
    }
  })

  const options = ['light', 'dark', 'system'] as const

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={"icon"}>
         <SunMoon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {options.map((m) => {
          const active = m === mode
          return (
            <DropdownMenuItem
              key={m}
              onClick={() => setMode(m)}
              className="flex items-center gap-2"
            >
              {m === 'system' ? (
                <Laptop className="size-4" />
              ) : m === 'dark' ? (
                <Moon className="size-4" />
              ) : (
                <Sun className="size-4" />
              )}
              <span className="capitalize flex-1">{m}</span>
              {active && <Check className="size-4 text-primary" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
