import StringTemplater from '@/pages/Tools/StringTemplater'
import Spinner from '@/pages/Tools/Spinner'

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
]

export default tools
