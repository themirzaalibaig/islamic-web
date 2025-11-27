import { DigitalTasbeeh, PresetList, CustomTasbeehForm } from '@/features/tasbeeh/components'
import { Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { useCallback, useState } from 'react'

export const Tasbeeh = () => {
  const [tab, setTab] = useState<'digital' | 'presets'>('digital')
  const onUse = useCallback(() => setTab('digital'), [])
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tasbeeh</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
            <TabsList>
              <TabsTrigger value="digital" onClick={() => setTab('digital')}>Digital Tasbeeh</TabsTrigger>
              <TabsTrigger value="presets" onClick={() => setTab('presets')}>Tasbeehat</TabsTrigger>
            </TabsList>
            <TabsContent value="digital">
              <DigitalTasbeeh className="mt-4" />
            </TabsContent>
            <TabsContent value="presets">
              <div className="mt-4">
                <PresetList onUse={onUse} />
                <div className="mt-4">
                  <CustomTasbeehForm />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
