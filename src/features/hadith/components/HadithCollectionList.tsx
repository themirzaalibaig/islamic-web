import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui'
import type { Collection } from '../types'
import { BookOpen } from 'lucide-react'

interface HadithCollectionListProps {
  collections: Collection[]
}

export const HadithCollectionList = ({ collections }: HadithCollectionListProps) => {
  const navigate = useNavigate()

  if (collections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No collections available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {collections.map((collection) => {
        const englishInfo =
          collection.collection.find((c) => c.lang === 'en') || collection.collection[0]
        const arabicInfo = collection.collection.find((c) => c.lang === 'ar')

        const englishTitle =
          typeof englishInfo?.title === 'string' ? englishInfo.title : collection.name
        const arabicTitle =
          arabicInfo && typeof arabicInfo?.title === 'string'
            ? arabicInfo.title
            : undefined

        const englishShort =
          typeof englishInfo?.shortIntro === 'string' ? englishInfo.shortIntro : ''
        const arabicShort =
          arabicInfo && typeof arabicInfo?.shortIntro === 'string' ? arabicInfo.shortIntro : ''

        return (
          <Card
            key={collection.name}
            className="cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-200 group"
            onClick={() => navigate(`/hadith/${collection.name}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                navigate(`/hadith/${collection.name}`)
              }
            }}
            aria-label={`View collection ${englishTitle}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <BookOpen className="h-5 w-5 text-primary shrink-0" />
                  <CardTitle className="text-base font-semibold leading-tight line-clamp-2">
                    {englishTitle}
                  </CardTitle>
                </div>
                <Badge variant="outline" className="shrink-0 text-xs">
                  {collection.name}
                </Badge>
              </div>
              {arabicTitle && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
                  <div
                    className="text-lg font-arabic font-bold text-right flex-1 leading-relaxed"
                    dir="rtl"
                    lang="ar"
                  >
                    {arabicTitle}
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {englishShort && (
                  <div
                    className="text-sm text-muted-foreground line-clamp-3 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: englishShort }}
                  />
                )}
                {arabicShort && arabicShort !== englishShort && (
                  <div
                    className="text-sm text-muted-foreground text-right font-arabic line-clamp-3 leading-relaxed"
                    dir="rtl"
                    lang="ar"
                    dangerouslySetInnerHTML={{ __html: arabicShort }}
                  />
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
                <Badge variant="secondary" className="font-medium">
                  {collection.totalAvailableHadith.toLocaleString()} Hadiths
                </Badge>
                {collection.hasBooks && (
                  <Badge variant="outline" className="text-xs">
                    Books
                  </Badge>
                )}
                {collection.hasChapters && (
                  <Badge variant="outline" className="text-xs">
                    Chapters
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
