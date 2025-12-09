import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Skeleton,
  Badge,
  Separator,
} from '@/components/ui'
import { useRandomHadith } from '../hooks'
import { RefreshCw, Loader2, Sparkles, FileText } from 'lucide-react'

export const RandomHadithCard = () => {
  const navigate = useNavigate()
  const [refreshKey, setRefreshKey] = useState(0)
  const { randomHadith, isLoading, refetch } = useRandomHadith(refreshKey === 0)

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
    refetch()
  }

  const hadithData = randomHadith
  const englishHadith = hadithData?.hadith.find((h) => h.lang === 'en') || hadithData?.hadith[0]
  const arabicHadith = hadithData?.hadith.find((h) => h.lang === 'ar')

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Random Hadith
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : hadithData && englishHadith ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">{hadithData.collection}</Badge>
              <Badge variant="secondary" className="font-medium">
                Book {hadithData.bookNumber} • #{hadithData.hadithNumber}
              </Badge>
            </div>
            {englishHadith.chapterTitle && (
              <p className="text-sm text-muted-foreground font-medium">
                {englishHadith.chapterTitle}
              </p>
            )}

            {/* Arabic Text */}
            {arabicHadith && (
              <div
                className="text-xl font-arabic text-right leading-relaxed text-primary/90"
                dir="rtl"
                lang="ar"
                dangerouslySetInnerHTML={{ __html: arabicHadith.body }}
              />
            )}

            {/* English Text */}
            {englishHadith && (
              <div
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: englishHadith.body }}
              />
            )}

            {englishHadith.grades && englishHadith.grades.length > 0 && (
              <>
                <Separator />
                <div className="flex gap-2 flex-wrap">
                  {englishHadith.grades.map((grade, idx) => (
                    <Badge key={idx} variant="secondary" className="font-medium">
                      {grade.grade} - {grade.graded_by}
                    </Badge>
                  ))}
                </div>
              </>
            )}
            <Separator />
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                navigate(`/hadith/${hadithData.collection}/hadiths/${hadithData.hadithNumber}`)
              }
            >
              <FileText className="h-4 w-4 mr-2" />
              View Full Hadith
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">No hadith available</p>
        )}
      </CardContent>
    </Card>
  )
}

