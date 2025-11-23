import { Button } from '@/components/ui'
import { PauseCircle, Bookmark, Volume2 } from 'lucide-react'
import type { Verse } from '../'

type Props = {
  verses: Verse[]
  surahs: Array<{ id: number; name_simple: string }>
  currentAudio: { type: 'surah' | 'verse' | null; isPlaying: boolean; verseKey: string }
  playVerseAudio: (key: string) => void
  stripHtmlTags: (t?: string) => string
}

export const VerseList = ({ verses, surahs, currentAudio, playVerseAudio, stripHtmlTags }: Props) => {
  return (
    <div className="space-y-4 md:space-y-6">
      {verses.map((v) => (
        <div key={v.id} className="p-4 md:p-6 bg-background rounded-xl shadow-xs border">
          <div className="flex justify-between items-start mb-3 md:mb-4">
            <span className="bg-primary/20 text-primary text-xs md:text-sm font-medium py-1 px-2 md:px-3 rounded-full">Verse {v.verse_number ?? Number(v.verse_key.split(':')[1])}</span>
            <button className="text-muted-foreground hover:text-primary" title="Bookmark"><Bookmark size={18} className="md:w-5 md:h-5" /></button>
          </div>
          <div className="text-right text-xl md:text-3xl leading-loose mb-3 md:mb-4" style={{ fontFamily: 'Scheherazade New, serif', lineHeight: '2.5' }}>{v.text_uthmani || v.text || ''}</div>
          <div className="p-3 md:p-4 bg-accent rounded-lg mb-3 md:mb-4">
            <div className="text-sm md:text-base">{stripHtmlTags(v.translations?.[0]?.text)}</div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className="text-xs md:text-sm text-muted-foreground">{v.verse_key}</span>
            <Button onClick={() => playVerseAudio(v.verse_key)} variant="ghost" className="flex items-center text-primary hover:text-primary/80 gap-1">
              {currentAudio.type === 'verse' && currentAudio.isPlaying && currentAudio.verseKey === v.verse_key ? <PauseCircle size={14} className="md:w-4 md:h-4" /> : <Volume2 size={14} className="md:w-4 md:h-4" />}
              <span className="text-xs md:text-sm">Listen to this verse</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

