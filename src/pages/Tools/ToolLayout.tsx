import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { Link, Outlet } from 'react-router-dom'
import { Stack } from '@/components/ui/stack'
import { ModeToggle } from '@/components/ui/theme-mode-toggle'

const ToolLayout = () => (
  <Stack
    className="container mx-auto min-h-screen px-12 py-8"
    justify="between"
  >
    <Stack>
      <Stack direction="row" justify="between" align="center">
        <Link to="/" className="align-center flex flex-row gap-2">
          <ArrowLeftIcon className="my-auto h-[18px] w-[18px]" />
          Back Home
        </Link>
        <ModeToggle />
      </Stack>
      <Outlet />
    </Stack>

    <Link to="/" className="align-center flex flex-row gap-2">
      <ArrowLeftIcon className="my-auto h-[18px] w-[18px]" />
      Back Home
    </Link>
  </Stack>
)

export default ToolLayout
