import React, { useState, useCallback } from 'react'
import { Typography } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Stack } from '@/components/ui/stack'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DownloadIcon } from '@radix-ui/react-icons'

const RegexExtractor: React.FC = () => {
  const [inputText, setInputText] = useState<string>('')
  const [regexPattern, setRegexPattern] = useState<string>('')
  const [extractedText, setExtractedText] = useState<string[]>([])
  const [error, setError] = useState<string>('')

  const handleExtract = useCallback(() => {
    if (!regexPattern) {
      setError('Please enter a regex pattern')
      return
    }

    try {
      const regex = new RegExp(regexPattern)
      const lines = inputText.split('\n')
      const extracted = lines
        .map((line) => {
          const match = line.match(regex)
          if (!match) return null
          return line.substring(match.index! + match[0].length).trim()
        })
        .filter((line): line is string => line !== null)

      setExtractedText(extracted)
      setError('')
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError('Invalid regex pattern')
      }
    }
  }, [inputText, regexPattern])

  const handleDownload = useCallback(() => {
    if (!extractedText.length) return

    const blob = new Blob([extractedText.join('\n')], {
      type: 'text/plain;charset=utf-8;',
    })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', 'extracted_text.txt')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [extractedText])

  return (
    <Stack gap={8} className="py-6">
      <Typography variant="h1">Regex Text Extractor</Typography>

      <Stack gap={6}>
        <Card>
          <CardHeader>
            <CardTitle>Input Text</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap={4}>
              <Textarea
                placeholder="Paste your text here..."
                className="min-h-[200px]"
                value={inputText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setInputText(e.target.value)
                }
              />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regex Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap={4}>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="regex">Enter your regex pattern</Label>
                <Input
                  type="text"
                  id="regex"
                  placeholder="e.g. ^Date: "
                  value={regexPattern}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setRegexPattern(e.target.value)
                  }
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
              <Button onClick={handleExtract}>Extract Text</Button>
            </Stack>
          </CardContent>
        </Card>

        {extractedText.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Extracted Text</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack gap={4}>
                  <Textarea
                    readOnly
                    className="min-h-[200px]"
                    value={extractedText.join('\n')}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleDownload}>
                      <DownloadIcon className="mr-2 h-4 w-4" />
                      Download Results
                    </Button>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </>
        )}
      </Stack>
    </Stack>
  )
}

export default RegexExtractor
