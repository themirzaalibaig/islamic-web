import { Button } from '@/components/ui'
import type { DuaCategory } from '../types'
import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  categories: DuaCategory[]
  selectedCategoryId?: string
  onSelectCategory: (categoryId?: string) => void
}

export const CategoryFilter = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={!selectedCategoryId ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSelectCategory(undefined)}
        className={cn(!selectedCategoryId && 'bg-primary text-primary-foreground')}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category._id}
          variant={selectedCategoryId === category._id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelectCategory(category._id)}
          className={cn(
            selectedCategoryId === category._id && 'bg-primary text-primary-foreground',
          )}
        >
          {category.name}
          {category.nameArabic && (
            <span className="mr-2 text-xs font-arabic">({category.nameArabic})</span>
          )}
        </Button>
      ))}
    </div>
  )
}

