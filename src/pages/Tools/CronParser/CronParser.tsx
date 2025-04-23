import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { parseCron } from './utils'

const CronParser = () => {
  const [cronString, setCronString] = useState('')
  const { fields, humanReadable } = useMemo(
    () => parseCron(cronString),
    [cronString]
  )

  return (
    <div className="container mx-auto space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="cron-input">Cron Expression</Label>
        <Input
          id="cron-input"
          placeholder="Enter cron expression (e.g., '0 7 * * 1-5' for weekdays at 7 AM)"
          value={cronString}
          onChange={(e) => setCronString(e.target.value)}
        />
      </div>

      {fields.length > 0 && (
        <>
          <Card>
            <CardContent className="p-4">
              <h3 className="mb-2 font-semibold">Summary</h3>
              <p className="text-lg">{humanReadable}</p>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {fields.map((field) => (
              <Card key={field.name}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{field.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Value: {field.value}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Range: {field.range}
                    </p>
                    <p>{field.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {cronString && fields.length === 0 && (
        <p className="text-red-500">
          Invalid cron expression. Please use the format: "minute hour
          day-of-month month day-of-week"
        </p>
      )}
    </div>
  )
}

export default CronParser
