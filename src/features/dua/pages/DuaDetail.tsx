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
import { useDua } from '../hooks'
import { ArrowLeft, Heart, AlertCircle, BookOpen } from 'lucide-react'

export const DuaDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { dua, loading, error } = useDua(id || '')

  if (loading) {
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

  if (error || !dua) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Dua Not Found</AlertTitle>
          <AlertDescription>
            {error || `Dua with ID "${id}" could not be found.`}
          </AlertDescription>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/dua')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Duas
          </Button>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dua')}
                className="shrink-0"
                aria-label="Back to duas"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 space-y-2">
                <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  <Heart className="h-6 w-6 text-primary" />
                  {dua.title}
                </CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary">{dua.category}</Badge>
                  {dua.reference && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {dua.reference}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Arabic Text */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Arabic</h3>
            <div
              className="text-3xl md:text-4xl font-arabic text-right leading-relaxed text-primary/90"
              dir="rtl"
              lang="ar"
            >
              {dua.arabic}
            </div>
          </div>

          <Separator />

          {/* Transliteration */}
          {dua.transliteration && (
            <>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Transliteration</h3>
                <div className="text-lg text-muted-foreground italic leading-relaxed">
                  {dua.transliteration}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Translation */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Translation</h3>
            <div className="text-lg leading-relaxed">{dua.translation}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

