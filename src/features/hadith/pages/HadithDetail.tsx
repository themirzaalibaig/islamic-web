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
  Separator,
} from '@/components/ui'
import { useHadithById } from '../hooks'
import { ArrowLeft, FileText, AlertCircle, BookOpen, Languages } from 'lucide-react'
import { useMemo } from 'react'

export const HadithDetail = () => {
  const { collectionName, hadithNumber } = useParams<{
    collectionName: string
    hadithNumber: string
  }>()
  const navigate = useNavigate()

  const { hadith, isLoading, isError, error } = useHadithById(
    collectionName || null,
    hadithNumber || null,
  )

  const hadithData = hadith

  const englishHadith = useMemo(() => {
    if (!hadithData) return null
    return hadithData.hadith.find((h) => h.lang === 'en') || hadithData.hadith[0]
  }, [hadithData])

  const arabicHadith = useMemo(() => {
    if (!hadithData) return null
    return hadithData.hadith.find((h) => h.lang === 'ar')
  }, [hadithData])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 mb-4" />
            <Skeleton className="h-48" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError || !hadithData) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hadith Not Found</AlertTitle>
          <AlertDescription>
            {error
              ? (error as any)?.message || 'Failed to load hadith'
              : `Hadith #${hadithNumber} in collection "${collectionName}" could not be found.`}
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/hadith/${collectionName}`)}
                className="shrink-0"
                aria-label="Back to collection"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 space-y-2">
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                  <FileText className="h-6 w-6 text-primary" />
                  Hadith #{hadithData.hadithNumber}
                </CardTitle>
                {englishHadith?.chapterTitle && (
                  <p className="text-sm text-muted-foreground">
                    Chapter: {englishHadith.chapterTitle}
                  </p>
                )}
              </div>
            </div>
            <Badge variant="outline" className="shrink-0">
              {collectionName}
            </Badge>
          </div>
          {englishHadith?.grades && englishHadith.grades.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
              {englishHadith.grades.map((grade, idx) => (
                <Badge key={idx} variant="secondary" className="font-medium">
                  {grade.grade} - {grade.name}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Arabic Text First */}
          {arabicHadith && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Languages className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Arabic</h3>
              </div>
              <div
                className="text-2xl md:text-3xl font-arabic text-right leading-relaxed text-primary/90 space-y-4 prose prose-lg max-w-none"
                dir="rtl"
                lang="ar"
                dangerouslySetInnerHTML={{ __html: arabicHadith.body }}
              />
            </div>
          )}

          {/* English Text */}
          {englishHadith && (
            <>
              {arabicHadith && <Separator />}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">English</h3>
                </div>
                <div
                  className="text-base md:text-lg leading-relaxed prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: englishHadith.body }}
                />
                {englishHadith.reference && (
                  <div className="mt-4 pt-4 border-t border-border/50 text-sm text-muted-foreground">
                    <strong>Reference:</strong> Book {englishHadith.reference.book}, Hadith{' '}
                    {englishHadith.reference.hadith}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

