import React, { useState, useCallback } from 'react'
import { Typography } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Stack } from '@/components/ui/stack'
import { UploadIcon, DownloadIcon } from '@radix-ui/react-icons'
import Papa, { ParseResult } from 'papaparse'

interface CSVRow {
  [key: string]: string
}

interface ProcessingStats {
  originalRows: number
  rowsWithMultiplePhones: number
  finalRows: number
  netRowsAdded: number
}

interface SplitExample {
  original: CSVRow
  phoneNumbers: string[]
}

const CustomerCSVCleaner: React.FC = () => {
  const [processedData, setProcessedData] = useState<CSVRow[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [fileName, setFileName] = useState<string>('')
  const [stats, setStats] = useState<ProcessingStats | null>(null)
  const [splitExamples, setSplitExamples] = useState<SplitExample[]>([])

  const processCSV = (data: CSVRow[]) => {
    const processed: CSVRow[] = []
    let rowsWithMultiplePhones = 0
    const examples: SplitExample[] = []

    data.forEach((row) => {
      if (!row.phone_number) {
        processed.push(row)
        return
      }

      // Check if phone_number is a list (assuming it's comma-separated)
      const phoneNumbers = row.phone_number.split(',').map((num) => num.trim())

      if (phoneNumbers.length <= 1) {
        processed.push(row)
        return
      }

      rowsWithMultiplePhones++
      // Store as example if it has multiple phone numbers
      examples.push({
        original: row,
        phoneNumbers,
      })

      // Create a new row for each phone number
      phoneNumbers.forEach((phone) => {
        const newRow = { ...row, phone_number: phone }
        processed.push(newRow)
      })
    })

    // Sort examples by number of phone numbers (descending)
    examples.sort((a, b) => b.phoneNumbers.length - a.phoneNumbers.length)
    setSplitExamples(examples.slice(0, 5)) // Keep top 5 examples

    // Calculate stats
    const newStats: ProcessingStats = {
      originalRows: data.length,
      rowsWithMultiplePhones,
      finalRows: processed.length,
      netRowsAdded: processed.length - data.length,
    }
    setStats(newStats)

    return processed
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setStats(null)
    setSplitExamples([])

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<CSVRow>) => {
        const data = results.data
        setHeaders(results.meta.fields || [])
        setProcessedData(processCSV(data))
      },
    })
  }

  const handleDownload = useCallback(() => {
    if (!processedData.length) return

    const csv = Papa.unparse(processedData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `processed_${fileName || 'data.csv'}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [processedData, fileName])

  return (
    <Stack gap={8} className="py-6">
      <Typography variant="h1">Customer CSV Cleaner</Typography>

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

        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>Processing Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
                    {stats.rowsWithMultiplePhones.toLocaleString()}
                  </Typography>
                  <Typography variant="small" className="text-muted-foreground">
                    Rows with Multiple Numbers
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
                <div className="rounded-lg bg-secondary p-4">
                  <Typography variant="h4" className="text-2xl font-bold">
                    {stats.netRowsAdded.toLocaleString()}
                  </Typography>
                  <Typography variant="small" className="text-muted-foreground">
                    Net Rows Added
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {splitExamples.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Split Row Examples</CardTitle>
              <Typography variant="small" className="text-muted-foreground">
                Showing the records with the most phone numbers that were split
                into multiple rows
              </Typography>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {splitExamples.map((example, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                        {index + 1}
                      </div>
                      <div className="space-y-1">
                        <Typography variant="small" className="font-medium">
                          Original Row:
                        </Typography>
                        <div className="border-l-2 pl-4">
                          <Typography variant="small">
                            {Object.entries(example.original)
                              .filter(([key]) => key !== 'phone_number')
                              .map(([_, value]) => `${value}`)
                              .join(', ')}{' '}
                            with {example.phoneNumbers.join(', ')}
                          </Typography>
                        </div>
                        <Typography
                          variant="small"
                          className="mt-2 font-medium"
                        >
                          Split into {example.phoneNumbers.length} rows:
                        </Typography>
                        <div className="space-y-1 border-l-2 pl-4">
                          {example.phoneNumbers.map((phone, phoneIndex) => (
                            <Typography
                              key={phoneIndex}
                              variant="small"
                              className="text-muted-foreground"
                            >
                              → Row {phoneIndex + 1}:{' '}
                              {Object.entries(example.original)
                                .filter(([key]) => key !== 'phone_number')
                                .map(([_, value]) => `${value}`)
                                .join(', ')}{' '}
                              with {phone}
                            </Typography>
                          ))}
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
                Download Processed CSV
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </Stack>
  )
}

export default CustomerCSVCleaner
