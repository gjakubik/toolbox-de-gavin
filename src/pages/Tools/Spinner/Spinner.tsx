import { useState, useRef, useEffect } from 'react'
import { Typography } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Stack } from '@/components/ui/stack'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { ReloadIcon } from '@radix-ui/react-icons'

// Default options for the spinner
const DEFAULT_OPTIONS = [
  'Win Son',
  'Banh Mi Saigon',
  'Court St Grocer',
  'Kotti Berliner',
  'Just Salad',
  'Sweetgreen',
]

interface WheelSection {
  option: string
  color: string
}

const Spinner = () => {
  const [options, setOptions] = useState<string[]>(DEFAULT_OPTIONS)
  const [optionsText, setOptionsText] = useState(DEFAULT_OPTIONS.join('\n'))
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [rotationDeg, setRotationDeg] = useState(0)
  const [wheelSections, setWheelSections] = useState<WheelSection[]>([])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const spinTimeoutRef = useRef<number | null>(null)

  // Colors for the wheel sections
  const colors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#8AC054',
    '#F2545B',
    '#52D726',
    '#7158E2',
    '#00B8D9',
    '#FF8C00',
  ]

  useEffect(() => {
    // Create wheel sections from options
    const sections = options.map((option, index) => ({
      option,
      color: colors[index % colors.length],
    }))
    setWheelSections(sections)

    // Draw the wheel
    drawWheel()
  }, [options, colors])

  useEffect(() => {
    // Redraw wheel when rotation changes
    drawWheel()
  }, [rotationDeg])

  const drawWheel = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    // Draw wheel sections
    if (wheelSections.length > 0) {
      const arcSize = (2 * Math.PI) / wheelSections.length

      wheelSections.forEach((section, index) => {
        const startAngle = index * arcSize + (rotationDeg * Math.PI) / 180
        const endAngle = startAngle + arcSize

        // Draw section
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, endAngle)
        ctx.closePath()
        ctx.fillStyle = section.color
        ctx.fill()

        // Draw text
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(startAngle + arcSize / 2)
        ctx.textAlign = 'right'
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 16px Arial'
        ctx.fillText(section.option, radius - 20, 5)
        ctx.restore()
      })
    }

    // Draw center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI)
    ctx.fillStyle = '#333333'
    ctx.fill()

    // Draw pointer
    ctx.beginPath()
    ctx.moveTo(centerX + 15, centerY)
    ctx.lineTo(centerX + 30, centerY - 10)
    ctx.lineTo(centerX + 30, centerY + 10)
    ctx.closePath()
    ctx.fillStyle = '#FF0000'
    ctx.fill()
  }

  const handleOptionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOptionsText(e.target.value)
  }

  const applyOptions = () => {
    // Filter out empty lines
    const newOptions = optionsText
      .split('\n')
      .map((opt) => opt.trim())
      .filter((opt) => opt.length > 0)

    if (newOptions.length > 0) {
      setOptions(newOptions)
    } else {
      // If all options were removed, reset to defaults
      setOptions(DEFAULT_OPTIONS)
      setOptionsText(DEFAULT_OPTIONS.join('\n'))
    }
  }

  const resetToDefaults = () => {
    setOptions(DEFAULT_OPTIONS)
    setOptionsText(DEFAULT_OPTIONS.join('\n'))
  }

  const spinWheel = () => {
    if (isSpinning) return

    // Clear any existing timeout
    if (spinTimeoutRef.current !== null) {
      window.clearTimeout(spinTimeoutRef.current)
    }

    setSelectedOption(null)
    setIsSpinning(true)

    // Random final rotation between 2 and 5 full rotations (720-1800 degrees)
    const spinTime = 3000 + Math.random() * 2000
    const targetRotation = rotationDeg + 720 + Math.random() * 1080

    // Animation duration
    const startTime = performance.now()

    const animateSpin = (currentTime: number) => {
      const timeProgress = Math.min(1, (currentTime - startTime) / spinTime)

      // Easing function for deceleration
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
      const progress = easeOut(timeProgress)

      const currentRotation =
        rotationDeg + (targetRotation - rotationDeg) * progress
      setRotationDeg(currentRotation)

      if (timeProgress < 1) {
        requestAnimationFrame(animateSpin)
      } else {
        // Spinning finished
        // Calculate which option is selected based on final rotation
        const finalRotation = targetRotation % 360
        const sectionSize = 360 / options.length
        const selectedIndex =
          options.length - 1 - Math.floor(finalRotation / sectionSize)
        const selected = options[selectedIndex % options.length]

        setSelectedOption(selected)
        setIsSpinning(false)
      }
    }

    requestAnimationFrame(animateSpin)
  }

  return (
    <Stack gap={8} className="py-6">
      <Typography variant="h1">Spinner</Typography>

      <Stack direction="row" className="gap-6">
        <Stack className="w-1/3 min-w-[250px] max-w-[400px] gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Options</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack gap={4}>
                <Label htmlFor="options">Enter options (one per line)</Label>
                <textarea
                  id="options"
                  className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={optionsText}
                  onChange={handleOptionsChange}
                  placeholder="Enter options, one per line"
                  disabled={isSpinning}
                />
                <Stack direction="row" gap={2}>
                  <Button onClick={applyOptions} disabled={isSpinning}>
                    Apply
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetToDefaults}
                    disabled={isSpinning}
                  >
                    Reset to Defaults
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        <Card className="grow">
          <CardContent className="p-6">
            <Stack gap={6} align="center">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="mx-auto"
                />
              </div>

              <Button
                size="lg"
                onClick={spinWheel}
                disabled={isSpinning || options.length < 2}
                className="min-w-[150px]"
              >
                {isSpinning ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Spinning...
                  </>
                ) : (
                  'Spin Wheel'
                )}
              </Button>

              {selectedOption && (
                <>
                  <Separator />
                  <div className="text-center">
                    <Typography
                      variant="small"
                      className="text-muted-foreground"
                    >
                      Result:
                    </Typography>
                    <Typography variant="h3" className="mt-2">
                      {selectedOption}
                    </Typography>
                  </div>
                </>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  )
}

export default Spinner
