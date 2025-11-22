import { useEffect, useMemo, useState } from 'react'
import { Button, Popover, PopoverContent, PopoverTrigger, Slider } from '@/components/ui'

const MAP: Record<string, number> = {
  sm: 87.5,
  md: 100,
  lg: 112.5,
  large: 125,
  xl: 137.5,
  '2xl': 150,
}

export const AccessibilityComponet = () => {
  const [open, setOpen] = useState(false)
  const [size, setSize] = useState<keyof typeof MAP>(() => {
    const saved = localStorage.getItem('app-font-size')
    return (saved && saved in MAP ? (saved as keyof typeof MAP) : 'md')
  })

  const percent = useMemo(() => MAP[size], [size])

  useEffect(() => {
    document.documentElement.style.fontSize = `${percent}%`
    localStorage.setItem('app-font-size', size)
  }, [percent, size])

  const options = Object.keys(MAP) as Array<keyof typeof MAP>
  const values = options
  const index = values.indexOf(size)

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="rounded-full shadow-lg" size="icon">
            A
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm">Font Size</span>
            <span className="text-sm font-medium">{size.toUpperCase()}</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs">A</span>
              <Slider
                value={[index]}
                max={values.length - 1}
                step={1}
                onValueChange={(v) => setSize(values[v[0]])}
                className="flex-1"
              />
              <span className="text-lg">A</span>
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground">
              {values.map((v) => (
                <button
                  key={v}
                  onClick={() => setSize(v as keyof typeof MAP)}
                  className={`px-1.5 py-0.5 rounded ${v === size ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
