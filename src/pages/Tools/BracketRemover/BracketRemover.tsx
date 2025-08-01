import React, { useState } from 'react'
import { Typography } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Stack } from '@/components/ui/stack'
import { CopyIcon } from '@radix-ui/react-icons'

const BracketRemover: React.FC = () => {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')

  const removeBracketText = () => {
    const lines = inputText.split('\n')
    const processedLines = lines.map(line => 
      line.replace(/\[.*?\]/g, '').replace(/^I,\s+INFO -- :\s*/, '')
    )
    setOutputText(processedLines.join('\n'))
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText)
  }

  const clearAll = () => {
    setInputText('')
    setOutputText('')
  }

  return (
    <Stack gap={8} className="py-6">
      <Typography variant="h1">Bracket Text Remover</Typography>
      
      <Card>
        <CardHeader>
          <CardTitle>Remove Text in Square Brackets</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack gap={6}>
            <div>
              <Label htmlFor="input">Input Text</Label>
              <Textarea
                id="input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text with [brackets] to remove..."
                className="min-h-[200px] mt-2"
              />
            </div>

            <Stack direction="row" gap={4}>
              <Button onClick={removeBracketText} disabled={!inputText.trim()}>
                Remove Brackets
              </Button>
              <Button variant="outline" onClick={clearAll}>
                Clear All
              </Button>
            </Stack>

            {outputText && (
              <>
                <div>
                  <Label htmlFor="output">Output Text</Label>
                  <div className="relative mt-2">
                    <Textarea
                      id="output"
                      value={outputText}
                      readOnly
                      className="min-h-[200px] pr-12"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyToClipboard}
                      className="absolute top-2 right-2"
                    >
                      <CopyIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

export default BracketRemover