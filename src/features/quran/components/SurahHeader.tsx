import { Button } from '@/components/ui'
import { PlayCircle, PauseCircle } from 'lucide-react'
import type { Surah } from '../'

type Props = {
  selectedSurah: Surah | null
  audioUrl: string | null
  isSurahPlaying: boolean
  reciters: Array<{ id: string; name: string }>
  reciterId: string
  toggleSurahPlayback: () => void
}

export const SurahHeader = ({
  selectedSurah,
  audioUrl,
  isSurahPlaying,
  reciters,
  reciterId,
  toggleSurahPlayback,
}: Props) => {
  if (!selectedSurah) return null
  return (
    <div className="text-center mb-6 md:mb-8">
      <h2
        className="text-2xl md:text-3xl font-bold text-primary"
        style={{ fontFamily: 'Scheherazade New, serif' }}
      >
        {(selectedSurah as any).name_arabic || selectedSurah.name_simple}
      </h2>
      <h3 className="text-lg md:text-xl text-muted-foreground mt-2">
        {selectedSurah.name_simple} ({selectedSurah.translated_name?.name || ''})
      </h3>
      <p className="text-sm md:text-base text-muted-foreground mt-1">
        {selectedSurah.verses_count} Verses •{' '}
        {(selectedSurah as any).revelation_place === 'makkah' ? 'Meccan' : 'Medinan'}
      </p>
      <div className="mt-4 md:mt-6 bg-muted p-3 md:p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={toggleSurahPlayback}
            disabled={!audioUrl}
            className="p-2 md:p-3 rounded-full"
            size="icon"
          >
            {isSurahPlaying ? <PauseCircle size={20} /> : <PlayCircle size={20} />}
          </Button>
          <div className="flex-1 text-center sm:text-left">
            <div className="text-xs md:text-sm font-medium">
              Listening to: {reciters.find((r) => r.id === reciterId)?.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
