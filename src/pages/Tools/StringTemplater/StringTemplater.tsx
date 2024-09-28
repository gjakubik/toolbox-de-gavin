import React, { useState, useEffect } from 'react'
import { Typography } from '@/components/ui/typography'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Stack } from '@/components/ui/stack'
import {
  Pencil1Icon,
  PlusIcon,
  Cross2Icon,
  CheckIcon,
  CopyIcon,
} from '@radix-ui/react-icons'
import { formatDistanceToNow } from 'date-fns'

interface Result {
  value: string
  timestamp: string
}

interface Config {
  id: string
  name: string
  prefix: string
  suffix: string
  createdAt: string
  updatedAt: string
  results: Result[]
}

const StringTemplater: React.FC = () => {
  const [configs, setConfigs] = useState<Config[]>([])
  const [selectedConfig, setSelectedConfig] = useState<Config | null>(null)
  const [newConfigName, setNewConfigName] = useState('')
  const [prefix, setPrefix] = useState('')
  const [suffix, setSuffix] = useState('')
  const [middleValue, setMiddleValue] = useState('')
  const [result, setResult] = useState('')
  const [isEditing, setIsEditing] = useState({ prefix: false, suffix: false })
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [results, setResults] = useState<Result[]>([])
  const [editingValue, setEditingValue] = useState({ prefix: '', suffix: '' })

  useEffect(() => {
    const savedConfigs = localStorage.getItem('stringTemplaterConfigs')
    if (savedConfigs) {
      setConfigs(JSON.parse(savedConfigs))
    }
  }, [])

  useEffect(() => {
    if (configs.length) {
      localStorage.setItem('stringTemplaterConfigs', JSON.stringify(configs))
    }
  }, [configs])

  const handleSaveConfig = () => {
    if (newConfigName && prefix && suffix) {
      const newConfig: Config = {
        id: Date.now().toString(),
        name: newConfigName,
        prefix,
        suffix,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        results: [],
      }
      setConfigs([...configs, newConfig])
      setNewConfigName('')
      setPrefix('')
      setSuffix('')
      setIsCreatingNew(false)
      setResult('')
      setResults([])
    }
  }

  const handleSelectConfig = (configId: string) => {
    const config = configs.find((c) => c.id === configId)
    if (config) {
      setSelectedConfig(config)
      setPrefix(config.prefix)
      setSuffix(config.suffix)
      setIsCreatingNew(false)
      setResult('')
      setResults(config.results || [])
    }
  }

  const handleEditConfig = (field: 'prefix' | 'suffix') => {
    if (selectedConfig) {
      setIsEditing({ ...isEditing, [field]: true })
      setEditingValue({ ...editingValue, [field]: selectedConfig[field] })
    }
  }

  const handleCancelEdit = (field: 'prefix' | 'suffix') => {
    setIsEditing({ ...isEditing, [field]: false })
    setEditingValue({ ...editingValue, [field]: '' })
  }

  const handleConfirmEdit = (field: 'prefix' | 'suffix') => {
    if (selectedConfig) {
      const updatedConfig = {
        ...selectedConfig,
        [field]: editingValue[field],
        updatedAt: new Date().toISOString(),
      }
      setConfigs(
        configs.map((c) => (c.id === selectedConfig.id ? updatedConfig : c))
      )
      setSelectedConfig(updatedConfig)
      setIsEditing({ ...isEditing, [field]: false })
      if (field === 'prefix') setPrefix(editingValue.prefix)
      if (field === 'suffix') setSuffix(editingValue.suffix)
    }
  }

  const handleGenerateResult = () => {
    const newResult = `${prefix}${middleValue}${suffix}`
    setResult(newResult)

    if (selectedConfig) {
      const newResultItem: Result = {
        value: newResult,
        timestamp: new Date().toISOString(),
      }

      const updatedResults = selectedConfig.results?.length
        ? [newResultItem, ...selectedConfig.results]
        : [newResultItem]

      const updatedConfig = {
        ...selectedConfig,
        results: updatedResults,
      }
      setConfigs(
        configs.map((c) => (c.id === selectedConfig.id ? updatedConfig : c))
      )
      setSelectedConfig(updatedConfig)
      setResults(updatedResults)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
  }

  const handleNewConfig = () => {
    setIsCreatingNew(true)
    setSelectedConfig(null)
    setPrefix('')
    setSuffix('')
    setMiddleValue('')
  }

  const handleCopyResult = (text: string) => {
    navigator.clipboard.writeText(text)
    // Optionally, you can add some feedback here, like a toast notification
  }

  return (
    <Stack gap={8} className="py-6">
      <Stack direction="row" justify="between" align="center">
        <Typography variant="h1">String Templater</Typography>
        <Button variant="secondary" onClick={handleNewConfig}>
          <PlusIcon className="mr-2 h-4 w-4" /> New Config
        </Button>
      </Stack>
      <Stack direction="row" className="gap-6">
        <Stack className="w-1/3 min-w-[200px] max-w-[300px] gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Config Info</CardTitle>
            </CardHeader>
            <CardContent>
              {isCreatingNew ? (
                <Typography>Creating new config...</Typography>
              ) : selectedConfig ? (
                <Stack className="gap-2">
                  <Typography variant="h4">{selectedConfig.name}</Typography>
                  <Separator className="my-2" />
                  <Typography variant="small" className="text-muted-foreground">
                    Created:{' '}
                    {formatDistanceToNow(new Date(selectedConfig.createdAt), {
                      addSuffix: true,
                    })}
                  </Typography>
                  <Typography variant="small" className="text-muted-foreground">
                    Updated:{' '}
                    {formatDistanceToNow(new Date(selectedConfig.updatedAt), {
                      addSuffix: true,
                    })}
                  </Typography>
                </Stack>
              ) : (
                <Typography>No config selected</Typography>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Saved Configs</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {configs.map((config) => (
                  <Button
                    key={config.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleSelectConfig(config.id)}
                  >
                    {config.name}
                  </Button>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </Stack>
        <Card className="grow">
          <CardHeader>
            {isCreatingNew && <CardTitle>Create New Config</CardTitle>}
          </CardHeader>
          <CardContent>
            {isCreatingNew ? (
              <>
                <div className="mb-4">
                  <Label htmlFor="configName">Config Name</Label>
                  <Input
                    id="configName"
                    value={newConfigName}
                    onChange={(e) => setNewConfigName(e.target.value)}
                    placeholder="Enter config name"
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="prefix">Prefix</Label>
                  <Input
                    id="prefix"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="Enter prefix"
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="suffix">Suffix</Label>
                  <Input
                    id="suffix"
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                    placeholder="Enter suffix"
                  />
                </div>
                <Button onClick={handleSaveConfig}>Save Config</Button>
              </>
            ) : selectedConfig ? (
              <>
                <Stack className="mb-4 gap-2">
                  <Stack direction="row" justify="center" align="center">
                    <div className="w-10" />
                    {isEditing.prefix ? (
                      <Input
                        value={editingValue.prefix}
                        onChange={(e) =>
                          setEditingValue({
                            ...editingValue,
                            prefix: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography variant="pn">{prefix}</Typography>
                    )}
                    {isEditing.prefix ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCancelEdit('prefix')}
                        >
                          <Cross2Icon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleConfirmEdit('prefix')}
                        >
                          <CheckIcon className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditConfig('prefix')}
                      >
                        <Pencil1Icon className="h-4 w-4" />
                      </Button>
                    )}
                  </Stack>
                  <Stack
                    direction="row"
                    className="items-center justify-center"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Stack>
                  <Input
                    value={middleValue}
                    onChange={(e) => setMiddleValue(e.target.value)}
                    placeholder="Enter middle value"
                    className="flex-grow"
                  />
                  <Stack
                    direction="row"
                    className="items-center justify-center"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Stack>
                  <Stack direction="row" justify="center" align="center">
                    <div className="w-10" />
                    {isEditing.suffix ? (
                      <Input
                        value={editingValue.suffix}
                        onChange={(e) =>
                          setEditingValue({
                            ...editingValue,
                            suffix: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography variant="pn">{suffix}</Typography>
                    )}
                    {isEditing.suffix ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCancelEdit('suffix')}
                        >
                          <Cross2Icon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleConfirmEdit('suffix')}
                        >
                          <CheckIcon className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditConfig('suffix')}
                      >
                        <Pencil1Icon className="h-4 w-4" />
                      </Button>
                    )}
                  </Stack>
                </Stack>
                <Stack direction="row" justify="end" gap={4}>
                  <Button onClick={handleGenerateResult} className="mb-4">
                    Generate Result
                  </Button>
                </Stack>
                {result && (
                  <>
                    <Separator className="my-4" />
                    <CardTitle className="mb-4">Result</CardTitle>
                    <Stack direction="row" className="gap-2">
                      <Input
                        id="result"
                        value={result}
                        readOnly
                        className="flex-grow"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={copyToClipboard}
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                    </Stack>
                  </>
                )}
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Typography variant="h3">Please select a config</Typography>
              </div>
            )}
          </CardContent>
          {selectedConfig && (
            <>
              <Separator className="my-4" />
              <CardHeader>
                <CardTitle>History</CardTitle>
              </CardHeader>
              <CardContent className="pr-1">
                <ScrollArea className="h-[150px] pr-3">
                  {results.map((result, index) => (
                    <div key={index} className="mb-6 flex">
                      <div className="relative mr-4 mt-2 w-1 flex-shrink-0">
                        <Separator
                          orientation="vertical"
                          className="pt absolute inset-y-0 w-full"
                          decorative
                        />
                      </div>
                      <Stack gap={2} className="flex-grow">
                        <Typography className="pt-2 font-mono" variant="small">
                          {result.value}
                        </Typography>

                        <Typography
                          variant="small"
                          className="text-muted-foreground"
                        >
                          {formatDistanceToNow(new Date(result.timestamp), {
                            addSuffix: true,
                          })}
                        </Typography>
                      </Stack>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyResult(result.value)}
                        className="ml-2 flex-shrink-0"
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </>
          )}
        </Card>
      </Stack>
    </Stack>
  )
}

export default StringTemplater
