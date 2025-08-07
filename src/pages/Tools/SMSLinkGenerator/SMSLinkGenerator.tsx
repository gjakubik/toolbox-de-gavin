import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Stack } from '@/components/ui/stack'

const normalizePhoneNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, '')
  
  if (digits.length === 10) {
    return `+1${digits}`
  } else if (digits.length === 11 && digits[0] === '1') {
    return `+${digits}`
  } else if (digits.length > 0) {
    return `+${digits}`
  }
  
  return ''
}

const SMSLinkGenerator = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')
  const [smsLink, setSmsLink] = useState('')
  const [copied, setCopied] = useState(false)

  const generateLink = () => {
    const normalizedPhone = normalizePhoneNumber(phoneNumber)
    if (!normalizedPhone) {
      setSmsLink('')
      return
    }
    
    const encodedMessage = encodeURIComponent(message)
    const link = `sms:${normalizedPhone}${message ? `?body=${encodedMessage}` : ''}`
    setSmsLink(link)
    setCopied(false)
  }

  const copyToClipboard = async () => {
    if (!smsLink) return
    
    try {
      await navigator.clipboard.writeText(smsLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const openLink = () => {
    if (!smsLink) return
    window.open(smsLink, '_blank')
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>SMS Link Generator</CardTitle>
        <CardDescription>
          Generate universal SMS links that auto-populate phone number and message
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Stack gap={4}>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567 or 5551234567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Will automatically add +1 for 10-digit US numbers
            </p>
          </div>

          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Enter your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 min-h-[100px]"
            />
          </div>

          <Button onClick={generateLink} className="w-full">
            Generate SMS Link
          </Button>

          {smsLink && (
            <div className="space-y-3">
              <div>
                <Label>Generated Link</Label>
                <div className="mt-1 p-3 bg-muted rounded-md font-mono text-sm break-all">
                  {smsLink}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={copyToClipboard} 
                  variant="outline"
                  className="flex-1"
                >
                  {copied ? 'Copied!' : 'Copy Link'}
                </Button>
                <Button 
                  onClick={openLink}
                  variant="outline"
                  className="flex-1"
                >
                  Test Link
                </Button>
              </div>
            </div>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default SMSLinkGenerator