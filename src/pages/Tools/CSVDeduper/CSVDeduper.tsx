import React, { useState, useCallback } from 'react'
import { Typography } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Stack } from '@/components/ui/stack'
import { UploadIcon, DownloadIcon } from '@radix-ui/react-icons'
import Papa, { ParseResult } from 'papaparse'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CSVRow {
  [key: string]: string
}

interface ProcessingStats {
  originalRows: number
  duplicatesRemoved: number
  finalRows: number
}

interface DuplicateExample {
  value: string
  count: number
  firstRow: CSVRow
}

const CSVDeduper: React.FC = () => {
  const [processedData, setProcessedData] = useState<CSVRow[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [selectedHeader, setSelectedHeader] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [stats, setStats] = useState<ProcessingStats | null>(null)
  const [duplicateExamples, setDuplicateExamples] = useState<
    DuplicateExample[]
  >([])
  const [originalData, setOriginalData] = useState<CSVRow[]>([])

  const processCSV = (data: CSVRow[], columnToDedup: string) => {
    const processed: CSVRow[] = []
    const seen = new Set<string>()
    const duplicateCounts: {
      [key: string]: { count: number; firstRow: CSVRow }
    } = {}

    data.forEach((row) => {
      const value = row[columnToDedup]

      if (!seen.has(value)) {
        seen.add(value)
        processed.push(row)
        duplicateCounts[value] = { count: 1, firstRow: row }
      } else {
        duplicateCounts[value].count++
      }
    })

    // Prepare duplicate examples
    const examples = Object.entries(duplicateCounts)
      .filter(([_, info]) => info.count > 1)
      .map(([value, info]) => ({
        value,
        count: info.count,
        firstRow: info.firstRow,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    setDuplicateExamples(examples)

    // Calculate stats
    const newStats: ProcessingStats = {
      originalRows: data.length,
      duplicatesRemoved: data.length - processed.length,
      finalRows: processed.length,
    }
    setStats(newStats)

    return processed
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setStats(null)
    setDuplicateExamples([])
    setSelectedHeader('')

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<CSVRow>) => {
        const data = results.data
        setHeaders(results.meta.fields || [])
        setOriginalData(data)
        setProcessedData([]) // Clear processed data until column is selected
      },
    })
  }

  const handleColumnSelect = (value: string) => {
    setSelectedHeader(value)
    if (originalData.length > 0) {
      setProcessedData(processCSV(originalData, value))
    }
  }

  const handleDownload = useCallback(() => {
    if (!processedData.length) return

    const csv = Papa.unparse(processedData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `deduped_${fileName || 'data.csv'}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [processedData, fileName])

  return (
    <Stack gap={8} className="py-6">
      <Typography variant="h1">CSV Deduplicator</Typography>

      <Stack gap={6}>
        <Card>
          <CardHeader>
            <CardTitle>Upload CSV File</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap={4}>
              <div className="flex w-full items-center justify-center">
                <label
                  htmlFor="file-upload"
                  className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed hover:bg-secondary/50"
                >
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <UploadIcon className="mb-3 h-8 w-8" />
                    <p className="mb-2 text-sm">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      CSV files only
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              {fileName && (
                <p className="text-sm text-muted-foreground">
                  Uploaded: {fileName}
                </p>
              )}
            </Stack>
          </CardContent>
        </Card>

        {headers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Select Column to Deduplicate</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedHeader} onValueChange={handleColumnSelect}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent>
                  {headers.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>Processing Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-secondary p-4">
                  <Typography variant="h4" className="text-2xl font-bold">
                    {stats.originalRows.toLocaleString()}
                  </Typography>
                  <Typography variant="small" className="text-muted-foreground">
                    Original Rows
                  </Typography>
                </div>
                <div className="rounded-lg bg-secondary p-4">
                  <Typography variant="h4" className="text-2xl font-bold">
                    {stats.duplicatesRemoved.toLocaleString()}
                  </Typography>
                  <Typography variant="small" className="text-muted-foreground">
                    Duplicates Removed
                  </Typography>
                </div>
                <div className="rounded-lg bg-secondary p-4">
                  <Typography variant="h4" className="text-2xl font-bold">
                    {stats.finalRows.toLocaleString()}
                  </Typography>
                  <Typography variant="small" className="text-muted-foreground">
                    Final Rows
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {duplicateExamples.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Duplicate Examples</CardTitle>
              <Typography variant="small" className="text-muted-foreground">
                Showing the values with the most duplicates that were removed
              </Typography>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {duplicateExamples.map((example, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                        {index + 1}
                      </div>
                      <div className="space-y-1">
                        <Typography variant="small" className="font-medium">
                          Value "{example.value}" appeared {example.count} times
                        </Typography>
                        <div className="border-l-2 pl-4">
                          <Typography
                            variant="small"
                            className="text-muted-foreground"
                          >
                            Kept first occurrence:{' '}
                            {Object.entries(example.firstRow)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(', ')}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {processedData.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        {headers.map((header) => (
                          <th
                            key={header}
                            className="border-b px-4 py-2 text-left"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {processedData.slice(0, 5).map((row, index) => (
                        <tr key={index}>
                          {headers.map((header) => (
                            <td
                              key={`${index}-${header}`}
                              className="border-b px-4 py-2"
                            >
                              {row[header]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {processedData.length > 5 && (
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                      Showing first 5 of {processedData.length} rows
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Stack direction="row" justify="end">
              <Button onClick={handleDownload}>
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download Deduplicated CSV
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </Stack>
  )
}

export default CSVDeduper
