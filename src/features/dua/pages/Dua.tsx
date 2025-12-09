import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Skeleton,
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Input,
} from '@/components/ui'
import { useDuas, useDuaCategories } from '../hooks'
import { DuaList, CategoryFilter } from '../components'
import { Heart, AlertCircle, RefreshCw, Search } from 'lucide-react'

export const Dua = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>()
  const [searchQuery, setSearchQuery] = useState('')

  const { duas, loading, error, refetch } = useDuas(selectedCategoryId)
  const { categories } = useDuaCategories()

  const filteredDuas = useMemo(() => {
    if (!searchQuery.trim()) return duas

    const query = searchQuery.toLowerCase().trim()
    return duas.filter(
      (dua) =>
        dua.title.toLowerCase().includes(query) ||
        dua.arabic.includes(query) ||
        dua.translation.toLowerCase().includes(query) ||
        (dua.transliteration && dua.transliteration.toLowerCase().includes(query)) ||
        dua.category.toLowerCase().includes(query),
    )
  }, [duas, searchQuery])

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || 'Failed to load duas'}</AlertDescription>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                Islamic Duas (Supplications)
              </CardTitle>
              <CardDescription>
                Browse authentic duas and supplications from the Quran and Sunnah
              </CardDescription>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search duas by title, text, or translation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <CategoryFilter
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredDuas.length > 0 ? (
            <DuaList duas={filteredDuas} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? 'No duas found matching your search' : 'No duas found in this category'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

