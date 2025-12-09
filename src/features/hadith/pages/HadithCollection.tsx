import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Skeleton,
  Badge,
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui'
import { useCollection, useBooks } from '../hooks'
import { ArrowLeft, BookOpen, AlertCircle, List } from 'lucide-react'

export const HadithCollection = () => {
  const { collectionName } = useParams<{ collectionName: string }>()
  const navigate = useNavigate()

  const { collection, isLoading: collectionLoading } = useCollection(collectionName || null)
  const { books, isLoading: booksLoading } = useBooks(collectionName || null)

  const collectionData = collection

  const isLoading = collectionLoading || booksLoading

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!collectionData) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Collection Not Found</AlertTitle>
          <AlertDescription>The collection "{collectionName}" could not be found.</AlertDescription>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/hadith')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Collections
          </Button>
        </Alert>
      </div>
    )
  }

  // Retrieve English and Arabic info, fallback logic
  const englishInfo =
    collectionData.collection.find((c) => c.lang === 'en') || collectionData.collection[0]
  const arabicInfo = collectionData.collection.find((c) => c.lang === 'ar')
  const englishTitle =
    typeof englishInfo?.title === 'string' ? englishInfo.title : collectionData.name
  const arabicTitle =
    arabicInfo && typeof arabicInfo?.title === 'string' ? arabicInfo.title : undefined
  const englishShort = typeof englishInfo?.shortIntro === 'string' ? englishInfo.shortIntro : ''
  const arabicShort =
    arabicInfo && typeof arabicInfo?.shortIntro === 'string' ? arabicInfo.shortIntro : ''

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start flex-col gap-3 flex-1 min-w-0 ">
              <div className="flex items-center justify-between gap-2 w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/hadith')}
                  className="shrink-0"
                  aria-label="Back to collections"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Badge variant="outline" className="shrink-0">
                  {collectionData.name}
                </Badge>
              </div>
              <div className="flex-1 flex min-w-0 items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary shrink-0" />
                  <CardTitle className="text-xl md:text-2xl font-bold">{englishTitle}</CardTitle>
                </div>
                {arabicTitle && (
                  <div
                    className="text-2xl md:text-3xl font-arabic font-bold text-right leading-relaxed text-primary"
                    dir="rtl"
                    lang="ar"
                  >
                    {arabicTitle}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Short Intros */}
          {(englishShort || arabicShort) && (
            <div className="space-y-3 pt-2 border-t border-border/50">
              {englishShort && (
                <div
                  className="text-sm md:text-base text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: englishShort }}
                />
              )}
              {arabicShort && arabicShort !== englishShort && (
                <div
                  className="text-sm md:text-base text-muted-foreground text-right font-arabic leading-relaxed"
                  dir="rtl"
                  lang="ar"
                  dangerouslySetInnerHTML={{ __html: arabicShort }}
                />
              )}
            </div>
          )}

          {/* Stats Badges */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
            <Badge variant="secondary" className="font-semibold">
              {collectionData.totalAvailableHadith.toLocaleString()} Available
            </Badge>
            <Badge variant="secondary" className="font-semibold">
              {collectionData.totalHadith.toLocaleString()} Total
            </Badge>
            {collectionData.hasBooks && (
              <Badge variant="outline" className="text-xs">
                Has Books
              </Badge>
            )}
            {collectionData.hasChapters && (
              <Badge variant="outline" className="text-xs">
                Has Chapters
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <List className="h-5 w-5 text-primary" />
              Books
            </h3>
            {booksLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : books?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No books available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books?.map((book) => {
                  const bookEnglishInfo = book.book.find((b) => b.lang === 'en') || book.book[0]
                  const bookArabicInfo = book.book.find((b) => b.lang === 'ar')
                  const bookNameEn =
                    typeof bookEnglishInfo?.name === 'string'
                      ? bookEnglishInfo.name
                      : `Book ${book.bookNumber}`
                  const bookNameAr =
                    bookArabicInfo && typeof bookArabicInfo?.name === 'string'
                      ? bookArabicInfo.name
                      : undefined

                  return (
                    <Card
                      key={book.bookNumber}
                      className="cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-200 group"
                      role="button"
                      tabIndex={0}
                      onClick={() => navigate(`/hadith/${collectionName}/books/${book.bookNumber}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          navigate(`/hadith/${collectionName}/books/${book.bookNumber}`)
                        }
                      }}
                      aria-label={`View book ${bookNameEn}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <BookOpen className="h-4 w-4 text-primary shrink-0" />
                            <CardTitle className="text-base font-semibold line-clamp-2">
                              {bookNameEn}
                            </CardTitle>
                          </div>
                          <Badge variant="outline" className="shrink-0 text-xs">
                            #{book.bookNumber}
                          </Badge>
                        </div>
                        {bookNameAr && (
                          <div
                            className="text-lg font-arabic font-bold text-right leading-relaxed text-primary/90"
                            dir="rtl"
                            lang="ar"
                          >
                            {bookNameAr}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="secondary" className="font-medium">
                            {book.numberOfHadith} Hadiths
                          </Badge>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">
                            Starts from #{book.hadithStartNumber}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
