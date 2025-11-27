import type { PropsWithChildren } from 'react'
import { useColorMode, useMediaQuery } from '@reactuses/core'

export const AuthLayout = ({ children }: PropsWithChildren) => {
  const systemIsDark = useMediaQuery('(prefers-color-scheme: dark)', false)
  useColorMode({
    attribute: 'class',
    modes: ['light', 'dark', 'system'],
    storageKey: 'theme-mode',
    defaultValue: systemIsDark ? 'dark' : 'light',
    modeClassNames: {
      light: 'light',
      dark: 'dark',
      system: systemIsDark ? 'dark' : 'light',
    },
  })
  return (
    <div className="min-h-svh grid place-items-center p-4">
      <div className="w-full max-w-md border rounded-lg p-6 bg-background">
        {children}
      </div>
    </div>
  )
}
