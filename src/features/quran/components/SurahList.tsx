import { Input, Separator } from '@/components/ui'
import { Search } from 'lucide-react'
import type { Surah } from '../'

type Props = {
  heightStyle: React.CSSProperties
  searchQuery: string
  setSearchQuery: (v: string) => void
  filteredSurahs: Surah[]
  selectedSurah: Surah | null
  onSelectSurah: (id: number) => void
}

export const SurahList = ({ heightStyle, searchQuery, setSearchQuery, filteredSurahs, selectedSurah, onSelectSurah }: Props) => {
  return (
    <section className="w-1/3 p-4 border-r" style={heightStyle}>
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Surah" className="pl-8" />
          <Search className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
      <Separator className="my-2" />
      <div className="space-y-1 app-scrollbar pr-1 h-[calc(100%-3.5rem)]">
        {filteredSurahs.map((s) => (
          <div
            key={s.id}
            onClick={() => onSelectSurah(s.id)}
            className={`p-3 rounded-lg cursor-pointer transition-all ${selectedSurah?.id === s.id ? 'bg-primary/20 text-primary' : 'hover:bg-muted'}`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm md:text-base">{s.name_simple}</span>
              <span className="text-xs md:text-sm text-muted-foreground">{s.verses_count} verses</span>
            </div>
            <div className="text-xs md:text-sm text-muted-foreground mt-1">{s.translated_name?.name || ''}</div>
            <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
              <span>{s.name_arabic}</span>
              <span>{s.revelation_place} · #{s.revelation_order}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

