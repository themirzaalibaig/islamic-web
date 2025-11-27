import { useMemo } from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Separator, Slider, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui'
import { useTasbeehCounter } from '@/features/tasbeeh/hooks'
import { cn } from '@/lib/utils'
import { Volume2, VolumeX, Vibrate, Hand, RotateCcw } from 'lucide-react'

type Props = {
  className?: string
}

export const DigitalTasbeeh = ({ className }: Props) => {
  const {
    count,
    target,
    rounds,
    preset,
    presets,
    soundEnabled,
    increment,
    decrement,
    reset,
    setTarget,
    selectPreset,
    toggleSound,
    toggleVibrate,
  } = useTasbeehCounter()

  const progress = useMemo(() => {
    const t = Number(target || 0)
    const c = Number(count || 0)
    if (!t || t <= 0) return 0
    return Math.round((c / t) * 100)
  }, [count, target])

  return (
    <Card className={cn('bg-card', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-center">
          {preset.name}
          <Badge variant="outline" className="font-mono">{preset.text}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6">
          <button
            type="button"
            onClick={increment}
            className="rounded-full h-52 w-52 flex items-center justify-center bg-primary text-primary-foreground shadow-sm active:scale-[0.98] transition-transform"
            title="Tap to count"
          >
            <div className="text-6xl font-mono">{count}</div>
          </button>
          <div className="w-full max-w-md">
            <div className="h-2 rounded bg-muted">
              <div className="h-2 rounded bg-primary" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-1 text-center text-xs text-muted-foreground">Progress {progress}%</div>
          </div>
          <div className="text-sm text-muted-foreground">Target {target} • Rounds {rounds}</div>
          <div className="w-full space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">Presets</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  {presets.map((p) => (
                    <DropdownMenuItem key={p.id} onClick={() => selectPreset(p.id)}>
                      <div className="flex items-center justify-between w-full">
                        <span>{p.name}</span>
                        <Badge variant="outline">{p.defaultTarget}</Badge>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" onClick={toggleSound} title="Toggle sound">
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleVibrate} title="Toggle vibration">
                <Vibrate className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={decrement}>
                <Hand className="h-4 w-4 mr-2" /> Decrease
              </Button>
              <Button variant="destructive" onClick={reset}>
                <RotateCcw className="h-4 w-4 mr-2" /> Reset
              </Button>
            </div>
            <Separator />
            <div>
              <div className="mb-2 text-sm text-center">Set target</div>
              <Slider
                min={10}
                max={200}
                step={1}
                value={[Number(target || 0)]}
                onValueChange={(v) => setTarget(Number(v?.[0] ?? target ?? 33))}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
