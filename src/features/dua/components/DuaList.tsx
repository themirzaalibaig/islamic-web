import { DuaCard } from './DuaCard'
import type { Dua } from '../types'

interface DuaListProps {
  duas: Dua[]
}

export const DuaList = ({ duas }: DuaListProps) => {
  if (duas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No duas found in this category</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {duas.map((dua) => (
        <DuaCard key={dua._id} dua={dua} />
      ))}
    </div>
  )
}

