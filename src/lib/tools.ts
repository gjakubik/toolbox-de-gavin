import StringTemplater from '@/pages/Tools/StringTemplater'
import Spinner from '@/pages/Tools/Spinner'
import TimezoneConverter from '@/pages/Tools/TimeZoneConverter/TimezoneConverter'

const tools = [
  {
    id: 'string-templater',
    name: 'String Templater',
    description:
      'Save a prefix and/or suffix and copy their result with any input',
    Component: StringTemplater,
  },
  {
    id: 'spinner',
    name: 'Spinner',
    description:
      'Spin a wheel with customizable options to make random selections',
    Component: Spinner,
  },
  {
    id: 'timezone-converter',
    name: 'Timezone Converter',
    description:
      'Convert dates between different timezones with a default to EST',
    Component: TimezoneConverter,
  },
]

export default tools
