import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Separator } from '@/components/ui'
import { useTasbeehCounter, useTasbeehPresets } from '@/features/tasbeeh/hooks'

type Props = {
  onUse?: () => void
}

export const PresetList = ({ onUse }: Props) => {
  const { defaultPresets, selectPreset } = useTasbeehCounter()
  const { items: customItems } = useTasbeehPresets()
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-sm">Relevant Tasbeehat</CardTitle>
      </CardHeader>
      <CardContent>
        {Array.isArray(customItems) && customItems.length > 0 && (
          <>
            <div className="mb-2 text-xs text-muted-foreground">Your Tasbeehat</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {customItems.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <Badge variant="outline" className="mt-1">
                      {p.text}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{p.defaultTarget}</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        selectPreset(p.id)
                        onUse?.()
                      }}
                    >
                      Use
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Separator />
          </>
        )}
        <div className="mt-4 mb-2 text-xs text-muted-foreground">Default Tasbeehat</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {defaultPresets.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <div className="font-medium">{p.name}</div>
                <Badge variant="outline" className="mt-1">
                  {p.text}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{p.defaultTarget}</Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    selectPreset(p.id)
                    onUse?.()
                  }}
                >
                  Use
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
