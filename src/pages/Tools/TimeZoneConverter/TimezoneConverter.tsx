import { useState, useCallback, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'

// Initialize dayjs plugins
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

const commonTimezones = [
  { value: 'America/New_York', label: 'EST (America/New_York)' },
  { value: 'America/Chicago', label: 'CST (America/Chicago)' },
  { value: 'America/Denver', label: 'MST (America/Denver)' },
  { value: 'America/Los_Angeles', label: 'PST (America/Los_Angeles)' },
  { value: 'Europe/London', label: 'GMT (Europe/London)' },
  { value: 'Europe/Paris', label: 'CET (Europe/Paris)' },
  { value: 'Asia/Tokyo', label: 'JST (Asia/Tokyo)' },
] as const

const formatOptions = [
  { value: 'YYYY-MM-DD HH:mm:ss', label: 'ISO (2025-04-22 17:53:23)' },
  { value: 'MMM D, YYYY h:mm:ss A', label: 'US (Apr 22, 2025 5:53:23 PM)' },
  { value: 'DD/MM/YYYY HH:mm:ss', label: 'EU (22/04/2025 17:53:23)' },
  { value: 'YYYY年MM月DD日 HH:mm:ss', label: 'JP (2025年04月22日 17:53:23)' },
  {
    value: 'ddd, MMM D, YYYY h:mm:ss A',
    label: 'Full (Tue, Apr 22, 2025 5:53:23 PM)',
  },
  { value: 'relative', label: 'Relative (2 months from now)' },
] as const

export default function TimezoneConverter() {
  const [inputDate, setInputDate] = useState('')
  const [targetTimezone, setTargetTimezone] = useState('America/New_York')
  const [selectedFormat, setSelectedFormat] = useState<string>(
    formatOptions[0].value
  )
  const [showError, setShowError] = useState(false)

  const { convertedDate, error } = useMemo(() => {
    if (!inputDate.trim()) {
      return { convertedDate: '', error: '' }
    }

    try {
      const date = dayjs.utc(inputDate)

      if (!date.isValid()) {
        return { convertedDate: '', error: 'Invalid date format' }
      }

      const converted = date.tz(targetTimezone)
      const formattedDate =
        selectedFormat === 'relative'
          ? converted.fromNow()
          : converted.format(selectedFormat)

      return { convertedDate: formattedDate, error: '' }
    } catch (e) {
      return { convertedDate: '', error: 'Error converting timezone' }
    }
  }, [inputDate, targetTimezone, selectedFormat])

  const selectedTimezone = useMemo(
    () => commonTimezones.find((tz) => tz.value === targetTimezone)?.label,
    [targetTimezone]
  )

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputDate(event.target.value)
      setShowError(false)
    },
    []
  )

  const handleInputBlur = useCallback(() => {
    setShowError(true)
  }, [])

  const handleTimezoneChange = useCallback((value: string) => {
    setTargetTimezone(value)
  }, [])

  const handleFormatChange = useCallback((value: string) => {
    setSelectedFormat(value)
  }, [])

  return (
    <Card className="space-y-4 p-6">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="2025-04-22 17:53:23 UTC"
          value={inputDate}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className={`w-full ${showError && error ? 'border-red-500' : ''}`}
        />
        {showError && error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <div className="space-y-2">
        <Select value={targetTimezone} onValueChange={handleTimezoneChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            {commonTimezones.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Select value={selectedFormat} onValueChange={handleFormatChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            {formatOptions.map((format) => (
              <SelectItem key={format.value} value={format.value}>
                {format.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {convertedDate && (
        <div className="mt-4 rounded-md bg-secondary p-4">
          <p className="text-center">
            {convertedDate} {selectedTimezone}
          </p>
        </div>
      )}
    </Card>
  )
}
