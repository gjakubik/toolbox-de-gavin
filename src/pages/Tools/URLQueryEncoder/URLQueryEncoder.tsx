import React, { useState, useCallback } from 'react'
import { Typography } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Stack } from '@/components/ui/stack'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CopyIcon, ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons'

const URLQueryEncoder: React.FC = () => {
  const [regularText, setRegularText] = useState<string>('')
  const [encodedText, setEncodedText] = useState<string>('')

  const handleEncode = useCallback(() => {
    if (!regularText.trim()) return
    try {
      const encoded = encodeURIComponent(regularText)
      setEncodedText(encoded)
    } catch (error) {
      console.error('Encoding error:', error)
    }
  }, [regularText])

  const handleDecode = useCallback(() => {
    if (!encodedText.trim()) return
    try {
      const decoded = decodeURIComponent(encodedText)
      setRegularText(decoded)
    } catch (error) {
      console.error('Decoding error:', error)
    }
  }, [encodedText])

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
  }, [])

  return (
    <Stack gap={8} className="py-6">
      <Typography variant="h1">URL Query Parameter Encoder/Decoder</Typography>

      <Stack gap={6}>
        <Card>
          <CardHeader>
            <CardTitle>Regular Text</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap={4}>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="regular-text">
                  Enter regular text to encode
                </Label>
                <Textarea
                  id="regular-text"
                  placeholder="Enter text here to encode it for URL query parameters..."
                  className="min-h-[200px]"
                  value={regularText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setRegularText(e.target.value)
                  }
                />
              </div>
              <Stack direction="row" gap={2}>
                <Button onClick={handleEncode} className="flex-1">
                  <ArrowDownIcon className="mr-2 h-4 w-4" />
                  Encode to URL Query Parameters
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(regularText)}
                  disabled={!regularText.trim()}
                >
                  <CopyIcon className="h-4 w-4" />
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>URL Query Parameter Encoded Text</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap={4}>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="encoded-text">
                  Enter encoded text to decode
                </Label>
                <Textarea
                  id="encoded-text"
                  placeholder="Enter URL query parameter encoded text here to decode it..."
                  className="min-h-[200px]"
                  value={encodedText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setEncodedText(e.target.value)
                  }
                />
              </div>
              <Stack direction="row" gap={2}>
                <Button onClick={handleDecode} className="flex-1">
                  <ArrowUpIcon className="mr-2 h-4 w-4" />
                  Decode from URL Query Parameters
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(encodedText)}
                  disabled={!encodedText.trim()}
                >
                  <CopyIcon className="h-4 w-4" />
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap={4}>
              <Typography variant="p">
                This tool helps you encode and decode text for use in URL query
                parameters.
              </Typography>
              <Typography variant="p">
                <strong>Encoding:</strong> Converts regular text into URL-safe
                format using <code>encodeURIComponent()</code>. This is useful
                when you need to pass text as a query parameter in a URL.
              </Typography>
              <Typography variant="p">
                <strong>Decoding:</strong> Converts URL-encoded text back to
                regular text using <code>decodeURIComponent()</code>. This is
                useful when you receive encoded text from a URL and need to read
                it.
              </Typography>
              <Typography variant="p">
                <strong>Example:</strong> "Hello World!" becomes
                "Hello%20World!" when encoded, and "Hello%20World!" becomes
                "Hello World!" when decoded.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  )
}

export default URLQueryEncoder
