import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Slider,
} from '@/components/ui'
import { PlayCircle, PauseCircle, Download, RefreshCw, X } from 'lucide-react'

type Props = {
  audioUrl: string | null
  verseSrc: string
  currentAudio: {
    isPlaying: boolean
    audioElement: HTMLAudioElement | null
    surahName: string
    verseKey: string
    progress: number
    currentTime: number
    duration: number
    type: 'surah' | 'verse' | null
  }
  reciters: Array<{ id: string; name: string }>
  reciterId: string
  playbackSpeed: number
  setPlayback: (speed: number) => void
  handleReciterChange: (id: string) => void
  onRefresh: () => void
}

export const BottomPlayer = ({
  audioUrl,
  verseSrc,
  currentAudio,
  reciters,
  reciterId,
  playbackSpeed,
  setPlayback,
  handleReciterChange,
  onRefresh,
}: Props) => {
  const toSliderValue = Math.round(playbackSpeed * 100)
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50 p-3 md:p-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        <div className="w-full bg-muted rounded-full h-1">
          <div
            className="bg-primary h-1 rounded-full transition-all"
            style={{ width: `${currentAudio.progress}%` }}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const el = currentAudio.audioElement
              if (el) {
                el.paused ? el.play() : el.pause()
              }
            }}
            className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
          >
            {currentAudio.isPlaying ? <PauseCircle size={20} /> : <PlayCircle size={20} />}
          </button>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">
              {currentAudio.surahName}
              {currentAudio.type === 'verse' &&
                ` • Verse ${currentAudio.verseKey.split(':')[1] || ''}`}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span>{reciters.find((r) => r.id === reciterId)?.name}</span>
              <span>•</span>
              <span>
                {Math.floor(currentAudio.currentTime / 60)}:
                {Math.floor(currentAudio.currentTime % 60)
                  .toString()
                  .padStart(2, '0')}{' '}
                / {Math.floor(currentAudio.duration / 60)}:
                {Math.floor(currentAudio.duration % 60)
                  .toString()
                  .padStart(2, '0')}
              </span>
            </div>
          </div>
          <div className="w-40">
            <Slider
              value={[toSliderValue]}
              min={50}
              max={200}
              step={25}
              onValueChange={(v) => setPlayback(Number((v[0] / 100).toFixed(2)))}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="text-primary">
                Reciter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Reciters</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {reciters.map((r) => (
                <DropdownMenuItem
                  key={r.id}
                  onClick={() => handleReciterChange(r.id)}
                  className={r.id === reciterId ? 'bg-accent' : ''}
                >
                  {r.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <a
            href={currentAudio.type === 'surah' ? (audioUrl ?? '') : verseSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Download size={18} />
          </a>
          <button
            onClick={onRefresh}
            className="text-muted-foreground hover:text-foreground"
            title="Refresh audio"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => {
              const el = currentAudio.audioElement
              el?.pause()
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
