import { useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Label,
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui'
import { School, Users, Loader2 } from 'lucide-react'
import { supabase } from '@/config'
import { useAuth } from '@/features/auth'

export const FiqahDialog = () => {
  const [fiqas, setFiqas] = useState<
    Array<{ id: string | number; name: string; description?: string }>
  >([])
  const [selectedFiqah, setSelectedFiqah] = useState<string | number | null>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [updating, setUpdating] = useState<boolean>(false)
  const { session } = useAuth()

  useEffect(() => {
    if (!session?.user?.id) return
    supabase
      .from('users')
      .select('fiqah,user_id')
      .eq('user_id', session.user.id)
      .single()
      .then(({ data }) => {
        if (!data?.fiqah) {
          setOpen(true)
        } else {
          setSelectedFiqah(data.fiqah)
        }
      })
  }, [session])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('fiqa').select('id,name')
      setFiqas((data as any) || [])
    }
    load()
  }, [session])

  const onSelect = (id: string | number) => setSelectedFiqah(id)

  const onConfirm = async () => {
    if (!selectedFiqah || !session?.user?.id) return
    setUpdating(true)
    await supabase.from('users').update({ fiqah: selectedFiqah }).eq('user_id', session.user.id)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setOpen(false)
  }

  const onOpenChange = (val: boolean) => setOpen(val)

  if (!open) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        {updating ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">
              Hang tight! We’re updating your app experience…
            </p>
          </div>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                Choose Your Fiqh
              </AlertDialogTitle>
              <AlertDialogDescription>
                Select your preferred school of Islamic jurisprudence to tailor your experience.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2">
              <RadioGroup
                value={selectedFiqah?.toString() || ''}
                onValueChange={(value) => onSelect(Number(value))}
              >
                {fiqas.map((f) => (
                  <div key={f.id} className="space-y-1">
                    <button
                      type="button"
                      className={`
                        w-full p-3 rounded-md border transition-all
                        ${
                          selectedFiqah === f.id
                            ? 'border-primary bg-primary/5 text-primary shadow-sm'
                            : 'border-border hover:border-primary/50 hover:bg-accent'
                        }
                      `}
                      onClick={() => onSelect(f.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value={f.id.toString()}
                            id={`fiqh-${f.id}`}
                            className="sr-only"
                          />
                          <div className="flex items-center gap-2">
                            <div
                              className={`
                              h-2 w-2 rounded-full
                              ${selectedFiqah === f.id ? 'bg-primary' : 'bg-muted'}
                            `}
                            />
                            <Label htmlFor={`fiqh-${f.id}`} className="font-medium cursor-pointer">
                              {f.name}
                            </Label>
                          </div>
                        </div>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </button>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <AlertDialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onConfirm}
                disabled={!selectedFiqah}
                className="flex-1"
              >
                Continue
              </Button>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}
