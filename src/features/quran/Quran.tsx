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
import {
  PlayCircle,
  PauseCircle,
  ChevronDown,
  Download,
  RefreshCw,
  X,
  BookOpen,
  Volume2,
} from 'lucide-react'
import { useQuranData } from './'
import { useQuranAudio } from './'
import { SurahList } from './components/SurahList'
import { SurahHeader } from './components/SurahHeader'
import { VerseList } from './components/VerseList'
import { SurahHeaderSkeleton, VerseListSkeleton } from './components/Skeletons'
import { formatDuration, intervalToDuration } from 'date-fns'
import { useEffect } from 'react'

export const Quran = () => {
  const HEADER_HEIGHT = 50
  const FOOTER_HEIGHT = 80
  // const location = useLocation()
  const defaultChapterId = 1
  const {
    surahs,
    selectedSurah,
    verses,
    loading,
    searchQuery,
    setSearchQuery,
    fetchVerses,
    filteredSurahs,
  } = useQuranData(defaultChapterId)
  const {
    audioUrl,
    reciterId,
    isSurahPlaying,
    playbackSpeed,
    currentAudio,
    surahAudioRef,
    verseAudioRef,
    loadSurahAudio,
    toggleSurahPlayback,
    playVerseAudio,
    handleReciterChange,
    setPlayback,
    syncProgress,
    refreshCurrentAudio,
  } = useQuranAudio()

  useEffect(() => {
    void loadSurahAudio(defaultChapterId, surahs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const recitersList: Array<{ id: string; name: string }> = [
    { id: '7', name: 'Mishary Rashid Alafasy' },
    { id: '1', name: 'Abdul Rahman Al-Sudais' },
    { id: '3', name: 'Abdur Rahman as-Sudais' },
    { id: '5', name: "Sa'ad Al-Ghamdi" },
    { id: '2', name: 'Abdul Basit Abdul Samad' },
    { id: '4', name: 'Mahmoud Khalil Al-Husary' },
    { id: '6', name: 'Muhammad Siddiq Al-Minshawi' },
    { id: '8', name: 'Abu Bakr Al-Shatri' },
    { id: '9', name: 'Ali Al-Hudhaify' },
    { id: '10', name: 'Mahmoud Ali Al-Banna' },
    { id: '11', name: 'Maher Al-Muaiqly' },
    { id: '12', name: 'Yasser Al-Dosari' },
    { id: '13', name: 'Hani Ar-Rifai' },
  ]

  const formatTime = (seconds: number) => {
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 })
    return formatDuration(duration, {
      format: duration.hours ? ['hours', 'minutes', 'seconds'] : ['minutes', 'seconds'],
    })
  }

  return (
    <div className="flex flex-col">
      <header
        className="border p-4 shadow flex items-center justify-between"
        style={{ minHeight: `${HEADER_HEIGHT}px` }}
      >
        <h1 className="text-2xl font-bold text-primary">
          {' '}
          <BookOpen className="inline-block mr-2" /> Quran Reader
        </h1>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Volume2 size={16} className="mr-1 md:mr-2" />
                {recitersList.find((r) => r.id === reciterId)?.name || 'Select Reciter'}
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <DropdownMenuLabel>Reciters</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {recitersList.map((r) => (
                <DropdownMenuItem
                  key={r.id}
                  onClick={() => handleReciterChange(r.id, selectedSurah, surahs)}
                  className={r.id === reciterId ? 'bg-accent' : ''}
                >
                  {r.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 flex">
        <SurahList
          heightStyle={{ height: `calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px - 108px)` }}
          searchQuery={searchQuery}
          setSearchQuery={(v) => setSearchQuery(v)}
          filteredSurahs={filteredSurahs as any}
          selectedSurah={selectedSurah as any}
          onSelectSurah={(id) => {
            fetchVerses(id)
            loadSurahAudio(id, surahs)
          }}
        />
        <section
          className="w-2/3 p-4 app-scrollbar"
          style={{ height: `calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px  - 108px)` }}
        >
          {selectedSurah ? (
            <div className="max-w-4xl mx-auto">
              {loading ? (
                <SurahHeaderSkeleton />
              ) : (
                <SurahHeader
                  selectedSurah={selectedSurah as any}
                  audioUrl={audioUrl}
                  isSurahPlaying={isSurahPlaying}
                  reciters={recitersList}
                  reciterId={reciterId}
                  toggleSurahPlayback={() => toggleSurahPlayback(selectedSurah?.name_simple)}
                />
              )}
              {loading ? (
                <VerseListSkeleton />
              ) : (
                <VerseList
                  verses={verses as any}
                  currentAudio={{
                    type: currentAudio.type,
                    isPlaying: currentAudio.isPlaying,
                    verseKey: currentAudio.verseKey,
                  }}
                  playVerseAudio={(key) => playVerseAudio(key, surahs)}
                  stripHtmlTags={(t) =>
                    t
                      ? t
                          .replace(/<[^>]+>/g, '')
                          .replace(/\s+/g, ' ')
                          .trim()
                      : 'Translation not available'
                  }
                />
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a Surah
            </div>
          )}
        </section>
      </main>
      <footer
        className="border p-4  flex items-center justify-center"
        style={{ minHeight: `${FOOTER_HEIGHT}px` }}
      >
        <div className="flex flex-col gap-2 w-full">
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
                  if (el.paused) {
                    void el.play()
                  } else {
                    el.pause()
                  }
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
                <span>{recitersList.find((r) => r.id === reciterId)?.name}</span>
                <span>•</span>
                <span>
                  {formatTime(currentAudio.currentTime)} / {formatTime(currentAudio.duration)}
                </span>
              </div>
            </div>
            <div className="w-40">
              <Slider
                value={[Math.round(playbackSpeed * 100)]}
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
                {recitersList.map((r) => (
                  <DropdownMenuItem
                    key={r.id}
                    onClick={() => handleReciterChange(r.id, selectedSurah, surahs)}
                    className={r.id === reciterId ? 'bg-accent' : ''}
                  >
                    {r.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <a
              href={
                currentAudio.type === 'surah' ? (audioUrl ?? '') : (currentAudio.audioElement?.src || '')
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <Download size={18} />
            </a>
            <button
              onClick={() => refreshCurrentAudio()}
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
      </footer>
      <audio ref={surahAudioRef} src={audioUrl ?? undefined} onTimeUpdate={syncProgress} />
      <audio ref={verseAudioRef} onTimeUpdate={syncProgress} />
    </div>
  )
}
