import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Skeleton,
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui'
import { useCollections } from '../hooks'
import { BookOpen, AlertCircle, RefreshCw } from 'lucide-react'
import { HadithCollectionList } from '../components/HadithCollectionList'

export const Hadith = () => {
  const { collections, isLoading, isError, error, refetch } = useCollections()

  if (isLoading) {
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
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error ? (error as any)?.message || 'Failed to load collections' : 'Unknown error'}
          </AlertDescription>
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Hadith Collections
            </CardTitle>
            <CardDescription>
              Browse through authentic collections of prophetic traditions
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <HadithCollectionList collections={collections || []} />
        </CardContent>
      </Card>
    </div>
  )
}
