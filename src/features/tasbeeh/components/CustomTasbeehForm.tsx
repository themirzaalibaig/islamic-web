import { useCallback, useMemo, useState } from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@/components/ui'
import { useTasbeehPresets } from '@/features/tasbeeh/hooks'

export const CustomTasbeehForm = () => {
  const { create } = useTasbeehPresets()
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [defaultTarget, setDefaultTarget] = useState<number>(33)
  const [saving, setSaving] = useState(false)
  const valid = useMemo(() => name.trim().length > 0 && text.trim().length > 0 && defaultTarget > 0, [name, text, defaultTarget])
  const onSubmit = useCallback(async () => {
    if (!valid) return
    setSaving(true)
    const { error } = await create(name.trim(), text.trim(), defaultTarget)
    setSaving(false)
    if (!error) {
      setName('')
      setText('')
      setDefaultTarget(33)
    }
  }, [name, text, defaultTarget, create, valid])
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-sm">Create Custom Tasbeeh</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="SubhanAllah" />
        </div>
        <div className="space-y-2">
          <Label>Arabic Text</Label>
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="سُبْحَانَ اللّٰهِ" />
        </div>
        <div className="space-y-2">
          <Label>Default Target</Label>
          <Input type="number" min={1} value={defaultTarget} onChange={(e) => setDefaultTarget(Number(e.target.value) || 33)} />
        </div>
        <div className="sm:col-span-3">
          <Button onClick={onSubmit} disabled={!valid || saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
