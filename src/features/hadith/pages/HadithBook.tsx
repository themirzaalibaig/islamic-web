import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Skeleton,
  Badge,
  Alert,
  AlertDescription,
  AlertTitle,
  Separator,
} from '@/components/ui'
import { useBook, useChapters, useHadithsByBook } from '../hooks'
import { ArrowLeft, BookOpen, AlertCircle, FileText, ChevronRight } from 'lucide-react'

function getLangText(arr: Array<any>, lang: string, prop: string) {
  const entry = arr.find((a) => a.lang === lang)
  return typeof entry?.[prop] === 'string' ? entry?.[prop] : null
}

// Utility function to render Matn with special tag components
function renderMatnWithTags(matn: string) {
  // Replace narrator custom tags with span and tooltip (naive: can be improved)
  return matn
    // Replace [prematn]...[/prematn] and [matn]...[/matn]
    .replace(/\[prematn\](.+?)\[\/prematn\]/gs, '<div class="text-amber-800 text-sm mb-2 font-semibold dark:text-yellow-300"> $1 </div>')
    .replace(/\[matn\](.+?)\[\/matn\]/gs, '<div class="font-arabic text-xl mt-3 mb-2 leading-loose rtl text-rtl text-primary/90">$1</div>')
    // Replace narrator tags
    .replace(
      /\[narrator ([^\]]+)\] ?([^[]+?) ?\[\/narrator\]/g,
      (_, attrs, name) => {
        // Get id and tooltip
        const idMatch = attrs.match(/id="(\d+)"/)
        const tooltipMatch = attrs.match(/tooltip="([^"]+)"/)
        const id = idMatch ? idMatch[1] : ''
        const tooltip = tooltipMatch ? tooltipMatch[1] : ''
        return `<span class="font-semibold text-sky-800 dark:text-sky-300 cursor-help border-b border-dotted border-sky-800 dark:border-sky-300"
                    title="${tooltip}${id ? ` (ID: ${id})` : ''}">
                ${name}
              </span>`
      }
    )
}

export const HadithBook = () => {
  const { collectionName, bookNumber } = useParams<{ collectionName: string; bookNumber: string }>()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const limit = 20

  const { book, isLoading: bookLoading } = useBook(collectionName || null, bookNumber || null)
  const { chapters, isLoading: chaptersLoading } = useChapters(
    collectionName || null,
    bookNumber || null,
  )
  const {
    hadiths,
    total: totalHadiths,
    limit: limitHadiths,
    previous,
    next,
    isLoading: hadithsLoading,
  } = useHadithsByBook(collectionName || null, bookNumber || null, { page, limit })

  const bookData = book

  const isLoading = bookLoading || chaptersLoading || hadithsLoading
  const pagination = { total: totalHadiths, limit: limitHadiths, previous, next }

  if (isLoading && !book) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!bookData) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Book Not Found</AlertTitle>
          <AlertDescription>
            The book "{bookNumber}" in collection "{collectionName}" could not be found.
          </AlertDescription>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate(`/hadith/${collectionName}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Collection
          </Button>
        </Alert>
      </div>
    )
  }

  // Book names for UI
  const bookNameEn =
    getLangText(bookData.book, 'en', 'name') || `Book ${bookData.bookNumber}`
  const bookNameAr = getLangText(bookData.book, 'ar', 'name')

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 pb-8">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start flex-col gap-3 flex-1 min-w-0 ">
              <div className="flex items-center justify-between gap-2 w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/hadith/${collectionName}`)}
                  className="shrink-0"
                  aria-label="Back to collection"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Badge variant="outline" className="shrink-0">
                  Book {bookData.bookNumber}
                </Badge>
              </div>
              <div className="flex-1 flex min-w-0 items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary shrink-0" />
                  <CardTitle className="text-xl md:text-2xl font-bold">{bookNameEn}</CardTitle>
                </div>
                {bookNameAr && (
                  <div
                    className="text-2xl md:text-3xl font-arabic font-bold text-right leading-relaxed text-primary/90"
                    dir="rtl"
                    lang="ar"
                  >
                    {bookNameAr}
                  </div>
                )}
              </div>
            </div>
          </div>
          <CardDescription className="text-base">
            <span className="font-semibold">{bookData.numberOfHadith}</span> Hadiths &bull; Starting
            from <span className="font-semibold">#{bookData.hadithStartNumber}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Chapters Section */}
          {chapters && chapters.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Chapters
              </h3>
              <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                {chapters.map((chapter) => {
                  const chapterEn = chapter.chapter.find((c) => c.lang === 'en') || chapter.chapter[0]
                  const chapterAr = chapter.chapter.find((c) => c.lang === 'ar')
                  return (
                    <Card
                      key={chapter.chapterId}
                      className="hover:shadow-md hover:border-primary/50 transition-all cursor-default"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0 space-y-2">
                              <p className="font-semibold text-base leading-tight">
                                {chapterEn.chapterTitle}
                              </p>
                              {chapterAr && (
                                <p
                                  className="font-arabic text-lg text-right leading-relaxed text-primary/90"
                                  dir="rtl"
                                  lang="ar"
                                >
                                  {chapterAr.chapterTitle}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                Chapter {chapterEn.chapterNumber}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
              <Separator className="my-6" />
            </div>
          )}

          {/* Hadiths Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Hadiths
            </h3>
            {hadithsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-lg" />
                ))}
              </div>
            ) : hadiths?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No hadiths available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {hadiths?.map((hadith) => {
                  const en = hadith.hadith.find((h) => h.lang === 'en')
                  const ar = hadith.hadith.find((h) => h.lang === 'ar')
                  const chapterLabel = en?.chapterTitle || ar?.chapterTitle || ''

                  // Get body content - prefer Arabic if available
                  const bodyEn = en?.body || ''
                  const bodyAr = ar?.body || ''

                  // Check if body contains special tags
                  const hasSpecialTags =
                    /\[matn\]|\[prematn\]|\[narrator/.test(bodyAr) ||
                    /\[matn\]|\[prematn\]|\[narrator/.test(bodyEn)

                  return (
                    <Card
                      key={hadith.hadithNumber}
                      className="cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-200 group"
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        navigate(`/hadith/${collectionName}/hadiths/${hadith.hadithNumber}`)
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          navigate(`/hadith/${collectionName}/hadiths/${hadith.hadithNumber}`)
                        }
                      }}
                      aria-label={`View hadith ${hadith.hadithNumber}`}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="secondary" className="font-semibold">
                            #{hadith.hadithNumber}
                          </Badge>
                          {chapterLabel && (
                            <span className="text-xs text-muted-foreground truncate flex-1 text-right">
                              {chapterLabel}
                            </span>
                          )}
                          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition shrink-0" />
                        </div>

                        {/* Arabic Text */}
                        {bodyAr && (
                          <div
                            className="text-xl md:text-2xl font-arabic text-right leading-relaxed text-primary/90"
                            dir="rtl"
                            lang="ar"
                            dangerouslySetInnerHTML={{
                              __html: hasSpecialTags ? renderMatnWithTags(bodyAr) : bodyAr,
                            }}
                          />
                        )}

                        {/* English Text */}
                        {bodyEn && (
                          <div
                            className="text-sm md:text-base text-muted-foreground leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: hasSpecialTags && !bodyAr ? renderMatnWithTags(bodyEn) : bodyEn,
                            }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  )
                })}

                {/* Pagination Controls */}
                {pagination && (pagination.next || pagination.previous) && (
                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-muted">
                    <Button
                      variant="outline"
                      disabled={!pagination.previous}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {page} of {Math.max(1, Math.ceil((pagination.total || 0) / (pagination.limit || 1)))}
                    </span>
                    <Button
                      variant="outline"
                      disabled={!pagination.next}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
