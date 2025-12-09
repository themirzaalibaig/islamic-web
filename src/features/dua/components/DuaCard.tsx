import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  CardFooter,
} from '@/components/ui'
import type { Dua } from '../types'
import { Heart, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface DuaCardProps {
  dua: Dua
}

export const DuaCard = ({ dua }: DuaCardProps) => {
  const navigate = useNavigate()

  return (
    <Card className="hover:shadow-lg hover:border-primary transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-2 flex-1">{dua.title}</CardTitle>
          <Badge variant="outline" className="shrink-0 text-xs">
            {dua.category}
          </Badge>
        </div>
        {dua.reference && (
          <p className="text-xs text-muted-foreground mt-1">Reference: {dua.reference}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4 h-full">
        {/* Arabic Text */}
        <div
          className="text-2xl md:text-3xl font-arabic text-right leading-relaxed text-primary/90"
          dir="rtl"
          lang="ar"
        >
          {dua.arabic}
        </div>

        {/* Transliteration */}
        {dua.transliteration && (
          <div className="text-sm text-muted-foreground italic">{dua.transliteration}</div>
        )}

        {/* Translation */}
        <div className="text-base leading-relaxed">{dua.translation}</div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full transition-colors"
          onClick={() => navigate(`/dua/${dua._id}`)}
        >
          <Heart className="h-4 w-4 mr-2" />
          View Details
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )
}
