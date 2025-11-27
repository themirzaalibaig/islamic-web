import { useEffect, useState } from 'react'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { supabase } from '@/config'
import { useAuth } from '@/features/auth'

export const FiqahDialog = () => {
  const [fiqas, setFiqas] = useState<Array<{ id: string | number; name: string }>>([])
  const [selectedFiqah, setSelectedFiqah] = useState<string | number | null>(null)
  const [open, setOpen] = useState<boolean>(() => !localStorage.getItem('fiqah:selected'))
  const {session}=useAuth()

  useEffect(() => {
    console.log(session);
    
    const load = async () => {
      const { data } = await supabase.from('fiqa').select('id,name')
      setFiqas((data as any) || [])
    }
    load()
  }, [])

  const confirmSelection = () => {
    if (!selectedFiqah) return
    localStorage.setItem('fiqah:selected', String(selectedFiqah))
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={(o) => o && setOpen(true)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Choose Your Fiqah</AlertDialogTitle>
          <AlertDialogDescription>Select one to continue.</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          {fiqas.map((f) => (
            <Card key={String(f.id)} className="p-4 grid gap-2">
              <div className="flex items-center gap-2">
                <input
                  id={`fiqah-${f.id}`}
                  type="checkbox"
                  checked={selectedFiqah === f.id}
                  onChange={() => setSelectedFiqah(f.id)}
                />
                <Label htmlFor={`fiqah-${f.id}`}>{f.name}</Label>
              </div>
            </Card>
          ))}
        </div>
        <AlertDialogFooter>
          <Button onClick={confirmSelection} disabled={!selectedFiqah}>Continue</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

