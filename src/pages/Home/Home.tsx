import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ModeToggle } from '@/components/ui/theme-mode-toggle'
import { Stack } from '@/components/ui/stack'
import tools from '@/lib/tools'

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTools, setFilteredTools] = useState(tools)

  useEffect(() => {
    const filtered = tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredTools(filtered)
  }, [searchTerm])

  return (
    <div className="container mx-auto px-12 py-8">
      <Stack gap={16}>
        <Stack direction="row" justify="between" align="center">
          <Typography variant="h3">Gavin's Toolbox</Typography>
          <ModeToggle />
        </Stack>
        <Stack gap={4}>
          <Input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <ScrollArea className="h-[60vh]">
            {filteredTools.map((tool) => (
              <Link
                key={tool.name}
                to={`/tools/${tool.id}`}
                className="mb-4 block last:mb-0"
              >
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle>{tool.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Typography variant="p">{tool.description}</Typography>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </ScrollArea>
        </Stack>
      </Stack>
    </div>
  )
}

export default Home
